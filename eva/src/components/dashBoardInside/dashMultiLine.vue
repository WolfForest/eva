<template>
  <div 
    ref="lineChart"
    class="multiLine-block" 
  >
    <div 
      v-if="props.nodata"
      class="nodata"
    > 
      {{ props.message }}
    </div>
    <div
      v-show="!dataLoading" 
      :class="props.class" 
      class="dash-multi" 
      :data-status="getDataStart"
    />
    <div 
      v-show="dataLoading"
      class="loading"
    >
      <div class="preloader">
        <div class="stable" />
        <div class="dynamic" />
      </div>
      <p> Загружаю данные... </p>
    </div>
    <div 
      ref="legends"
      class="legend-block" 
    >
      <div 
        v-for="item in props.legends" 
        :key="item.label"
        class="legend-line" 
      >
        <div 
          class="circle" 
          :style="{backgroundColor:item.color}"
        />
        <div 
          class="text" 
          :style="{color:color.text}"
        >
          {{ item.label }}
        </div>    
      </div>
    </div>
  </div>  
</template>


<script>

import * as d3 from "d3";


export default {
  props: {
    dataRestFrom: null,
    colorFrom: null,
    widthFrom: null,
    heightFrom: null,
    idFrom: null,
    idDashFrom: null,
    dataLoadingFrom: null,
  },
  data () {
    return {
      props: {
        id: '',
        result: [],
        loading: false,
        nodata: true,
        message: 'Нет данных для отображения',
        class: '',
        hash: '',
        actions: [
          {
            name: 'click',
            capture: ['pointX','pointY']
          },
          {
            name: 'select',
            capture: ['start','end']
          },
        ],
        legends: [],
        metrics: [],
      }
    }
  },
  computed: {
    id: function() {
      return this.idFrom
    },
    idDash: function() { 
      return this.idDashFrom
    },
    dataRest: function() {
      this.props.legends = [];
      return this.dataRestFrom
    },
    color: function() {
      return this.colorFrom
    },
    colorLegends: function() {
      return [this.colorFrom.controls,this.colorFrom.controlsActive,
        '#660099','#3366FF','#e5194a','#fbbe18','#26295a','#228B22',
        '#CCCC00','#CC0000','#9933FF','#0099CC','#009966','#99CC00',
        '#FF4500','#FFC125','#FF6A6A','#483D8B','#2F4F4F','#8B4513'];
    },
    dataLoading: function() {
      return this.dataLoadingFrom
    },
    width: function() {
      return this.widthFrom
    },
    height: function() {
      return this.heightFrom
    },
    getDataStart: function() {

      let sizeLine = {'width': 0,'height': 0};  // получаем размеры от родителя
      sizeLine['width'] = this.width;
      sizeLine['height'] = this.height;
      

      if (sizeLine.width > 0 && sizeLine.height > 0) {  // если размеры получены выше нуля
        
        if (this.dataRest.length > 0) {  // если данные от родителя тоже пришли
          if(this.dataRest.error) {  // сомтрим если с ошибкой
            this.props.message = this.dataRest.error; // то выводим сообщение о ошибке
          } else {  // если нет
            
            let time = false;
            let onlyNum = true;
            let key = Object.keys(this.dataRest[0])[0];
            typeof(this.dataRest[0][key]) != 'number' ? onlyNum = false : false
            if (onlyNum){  // если все-таки число
              if(this.dataRest[0][key] > 1000000000 && this.dataRest[0][key] < 2000000000) {
                time = true;
              }

              this.props.nodata = false; // то убираем соощение о отсутствии данных
              this.props.result = this.dataRest;  // заносим все данные в переменную
              let united = this.$store.getters.getOptions({idDash: this.idDash, id: this.id}).united;
              let lastDot = this.$store.getters.getOptions({idDash: this.idDash, id: this.id}).lastDot;
              let metricsOpt = [];
              if (this.$store.getters.getOptions({idDash: this.idDash, id: this.id}).metrics) {
                metricsOpt = [...[],...this.$store.getters.getOptions({idDash: this.idDash, id: this.id}).metrics];
              }
              
              if (this.props.legends.length == 0) {
                this.props.metrics = [];
                let metricsName = Object.keys(this.props.result[0]).filter( item => {
                  if (item.indexOf('caption') == -1 && item.indexOf('annotation') == -1) {
                    return item
                  }
                }); 
                                          
                if (metricsName.length > 0) {
                  this.props.metrics = [...[],...metricsName];
                  metricsName.splice(0,1)

                              
                  this.createLegends(metricsName);

                  let timeOut = setTimeout( function tick() {
                    if (this.$refs && this.props.legends.length > 0 ) {    
                      clearTimeout(timeOut);
                      this.createLineChart(this.props,this,sizeLine,time,united,lastDot,metricsOpt);
                    }  else {
                      timeOut = setTimeout(tick.bind(this), 100); 
                    }
                  }.bind(this), 0);

                } else {
                  this.props.message = 'Данные не подходят для построения графика';
                  this.props.nodata = true; 
                }

              } else {
                this.createLineChart(this.props,this,sizeLine,time,united,lastDot,metricsOpt);
              }
                      
              this.setMetrics();
                                        
            } else {  // если первое значение первого элемнета (подразумеваем что это time не число)
              this.props.nodata = true;  // показываем сообщение о некорректности данных
              this.props.result = [];  // очищаем массив результатов
              this.props.message = "К сожалению данные не подходят к линейному графику";  // выводим сообщение
              d3.select(this.$el.querySelector('.dash-multi')).selectAll('svg').remove(); // и еще график очищаем, чтобы не мешался
            }
          }
        }
      }         
      return 'done'
    
    }

  },
  methods: {
    setMetrics: function() {
      this.$store.commit('setMetricsMulti', {metrics: this.props.metrics, idDash: this.idDash, id: this.id });
    },
    createLineChart: function (props,that,sizeLine,time,united,lastDot,metricsOpt) {  // создает график

      let colors = [this.color.controls,this.color.text,this.color.controlsActive,'#660099','#3366FF','#e5194a',]; // основные используемые цвета
      let colorLine = this.colorLegends;
  
      let otstupBottom = 50;
      if (screen.width <= 1600) {
        otstupBottom = 40;
      }
             

      let otstupTop = this.$refs.legends.getBoundingClientRect().height;
      // устанавливаем размер и отступы графика 
      let margin = {top: otstupTop-10, right: 20, bottom: 20, left: 40},
        width = sizeLine.width - margin.left - margin.right - 20,
        height = sizeLine.height - margin.top - margin.bottom - otstupBottom;


      let graphics = d3.select(this.$el.querySelector('.dash-multi')).selectAll('svg').nodes(); // получаем область в которой будем рисовтаь график 
      
      if(graphics.length != 0){  // если график уже есть
        graphics[0].remove(); // удаляем его
      }

      // полготавливаем данные

      let data = props.result;

      let secondTransf = 1000;


      let xMetric = Object.keys(data[0])[0];  // в эту переменную кладем временную метрику (подразумеваем, что она первая по счету)

      let extraDot = checkExtraDot(props.result);

      let metricsName = [...[],...that.props.metrics];  // массив из всех метрик что доступны на графике и в нужном нам порядке
      metricsName.splice(0,1);

      if(metricsName.length == 0){ // если метрик вообще не найдено
        this.props.nodata = true;  // показываем сообщение о некорректности данных
        this.props.result = [];  // очищаем массив результатов
        this.props.message = "Ни одной метрики не найдено. Проверьте корректность данных";  // выводим сообщение
        d3.select(this.$el.querySelector('.dash-graph')).selectAll('svg').remove(); // и еще график очищаем, чтобы не мешался
        return false  // завершаем создание графика
      }

             
      let x = null;
      let maxX = 0,minX =0;
      if (time) {
        x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return  new Date(d[xMetric]*secondTransf) }))
          .range([ 0, width ]);
      } else {
        maxX = data.reduce(function(last, next) {   // находим максимальное значение по оси x
          if (next[xMetric] > last){
            return next[xMetric]
          } else {
            return last
          }
        }, 0);
        minX = data.reduce(function(last, next) {   // находим минимальное значение по оси y
          if (next[xMetric] < last){
            return next[xMetric]
          } else {
            return last
          }
        }, maxX);
        x = d3.scaleLinear()
          .domain([minX,maxX])
          .range([ 0, width ]);
        secondTransf = 1;
      }

      let max = metricsName.map( (item,i) => { // получаем массив с максимальным значением каждой метрики, кроме временной
        return   d3.max(data, function(d) {  return +d[metricsName[i]]; })
      })

      let min = metricsName.map( (item,i) => { // получаем массив с максимальным значением каждой метрики, кроме временной
        return   d3.min(data, function(d) {  return d[metricsName[i]]; })
      })


      // добовляем svg элемент на страницу
      let svg = d3.select(this.$el.querySelector('.dash-multi'))
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.attr("data-id",props.id)
        .attr('class',"graph-svg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
      // добовляем ось x                
      let xAxis = null;

      //  настраиваем шаги на оси икс в зависимости от ширины элемента

      let deliter = 2;
      if ((width+ margin.left + margin.right) < 500) {
        deliter = 3;
      } 
      if ((width+ margin.left + margin.right) < 400) {
        deliter = 4;
      } 
      if ((width+ margin.left + margin.right) < 300) {
        deliter = 5;
      } 
      if ((width+ margin.left + margin.right) < 250) {
        deliter = 6;
      } 

      let annotation = Object.keys(data[0]).filter( item => {
        if (item.indexOf('annotation') != -1) {
          return item
        }
      })


      if (time) {
        xAxis = svg.append("g")
          .attr("class","xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat('%d-%m-%Y '))
            .tickValues(
              x.ticks().filter( (item,i) => {
                if (i%deliter == 0) {
                  return item
                }
              })
            )
            //.ticks(5)
                  
          );
      
      } else {
        xAxis = svg.append("g")
          .attr("class","xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      }


      // отрисуем сетку сперва для горизотнальных тиков
      svg.selectAll("g.xAxis g.tick")
        .append("line") // добавляем линию
        .attr("class","grid-line-x") // добавляем класс
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", - (height-20))
        .attr("stroke", colors[1])
        .style("opacity", "0.3");

      // создаем область графика, все-что вне этой области не будет отрисованно
      let clip = svg.append("defs").append("svg:clipPath")
        .attr("id", `clip-${that.id}`)
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);


      let line,brush,y,AllLinesWithBreak;

      d3.select(this.$el.querySelector('.dash-multi')).selectAll('.tooltip-separeted').remove();
      d3.select(this.$el.querySelector('.dash-multi')).selectAll('.tooltip').remove();

      if (united){


        max = max.reduce(function(last, next) {   // находим максимальное значение среди всех метрик
          if (next > last){
            return next
          } else {
            return last
          }
        }, 0);

        let otstupProcent = (10*max)/100;

        y = d3.scaleLinear()
          .domain([0, max+otstupProcent])
          .range([ height, 20 ]);

        // добавляем ось Y
        svg.append("g")
          .attr("class","yAxis")
          .call(d3.axisLeft(y).ticks(y.ticks().length/2));


        // отрисуем сетку сперва для вертикальных тиков
        svg.selectAll("g.yAxis g.tick")
          .append("line")
          .attr("class","grid-line-y")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", width)
          .attr("y2", 0)
          .attr("stroke", colors[1])
          .style("opacity", "0.3");

        // создаем tooltip

        let tooltip = d3.select(this.$el.querySelector('.dash-multi'))
          .append("div")
          .attr("class", "tooltip")
          .style("color",colors[1])
          .style("background",this.color.backElement)
          .style('border-color',colors[1])
          .style('z-index','2')
          .text('');

        let toolTopBlock = tooltip.nodes()[0];

        // создаем дополнительную линию при наведении на точку
        let lineDot = svg.append("g") 
          .append("line")
          .attr('class','line-dot')
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1",20)
          .attr("y2", height)
          .attr("stroke", that.colorFrom.text)
          .style("stroke-dasharray", "3 3") 
          .attr("opacity", "0");

        // создаем область выделения
        brush = d3.brushX()                   // область выделения
          .extent( [ [0,0], [width,height] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
          .on("end", updateData)               // каждый раз как область выделения изменится вызовется функция
                       
        // строим основную линию

        line =  svg.append('g')  // основная линия графика
          .attr("clip-path", `url(#clip-${that.id})`);

                   

                                    
        AllLinesWithBreak = [];

        let mustSee = [];
        
        metricsName.forEach( (item,i) => {

          let nullValue = -1;
          let dotDate = null;
          let linesWithBreak = [];
          let onelinesWithBreak = [];
          let allDotHover = [];
          if (extraDot.length > 0) {
            extraDot.forEach( (item,j) => {
              if (metricsName[i] == item.column) {
                nullValue = j
              }
            })
          }
          if(nullValue == -1) {

            data.forEach( line => {
              if (!Number(line[metricsName[i]]) && line[metricsName[i]] != 0) { 
                onelinesWithBreak.length == 1 ? mustSee.push(onelinesWithBreak[0]) : false;
                linesWithBreak.push(onelinesWithBreak);
                onelinesWithBreak = [];
              } else {
                onelinesWithBreak.push(line);
              }
            })

                                    
            onelinesWithBreak.length == 1 ? mustSee.push(onelinesWithBreak[0]) : false;
            linesWithBreak.push(onelinesWithBreak);
            AllLinesWithBreak.push(linesWithBreak);
            linesWithBreak.forEach( (lineItself,j) => {
              // Добовляем линию
              line.append("path")
                .datum(lineItself)
                .attr("class", `line-${i}-${j}`)  // добовляем свой класс
                .attr("fill", "none")
                .attr("stroke", colorLine[i])
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                  .x(function(d) {return x(d[xMetric]*secondTransf) })
                  .y(function(d) {return y(d[metricsName[i]]) })
                )
            })
                                
                                
            dotDate = data;

          } else {
            dotDate = [extraDot[nullValue]];
          }

                            
          svg
            .append("g")
            .selectAll('dot')
            .data(dotDate)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d[xMetric]*secondTransf) } )
            .attr("cy", function(d) {  return y(d[metricsName[i]])  } )
            .attr("r", 5)
            .attr('metric',metricsName[i])
            .attr("fill",colorLine[i])
            .style("opacity",function(d,j) {
              let opacity = 0;
              if (nullValue != -1) {
                opacity =  1
              }
              mustSee.forEach( item => {
                if (item[metricsName[i]] == d[metricsName[i]]) {
                  opacity =  1
                }
              })
              if (lastDot) {
                if (j == data.length-1) { // если это последняя точка, то
                  opacity = 1;  // и постоянно ее отображаем
                  putLabelDot('data-last-dote','last-dot-text',d,y(d[metricsName[i]])-10,metricsName[i],this,that);
                }
              }
              if (d[`_${metricsName[i]}_caption`] && !this.getAttribute("data-last-dote")) {
                opacity = 1;  // и постоянно ее отображаем
                putLabelDot('data-with-caption','caption-dot-text',d,y(d[metricsName[i]])-10,`_${metricsName[i]}_caption`,this,that);
              }

              if (annotation.length != 0) {
                annotation.forEach( (item,i) => {
                  if (d[item]) {
                    verticalLine(d,item,metricsName.length+1+i,tooltip);
                    
                  }

                })
              }
              // if (j == data.length-1) { // если это последняя точка, то
              //   opacity = 1;  // и постоянно ее отображаем
              //   this.setAttribute('data-last-dote','true');  // так же зададим атрибут сосбтвенный, чтобы потом понимать с какой точки мышка ушла
              //   svg.append('text')   // текст легенды (название метрики)
              //     .attr('class','last-dot-text')
              //     .attr('transform', `translate(${x(d[xMetric]*secondTransf)},${y(d[metricsName[i]])-10})`) 
              //     .attr('font-size', `0.7em`)
              //     .attr('text-anchor','end')
              //     .style('fill', that.colorFrom.text)
              //     .text(d[metricsName[i]]);
                
              // }
              return opacity
            })
            .attr("class",`dot dot-${i}`)
            .on('click', function(d) {return that.setClick({x: d[xMetric],y: d[metricsName[i]]},'click')})
            .on("mouseover", function(d) {
              let xVal = d[xMetric]; 
              if (time) {
                xVal = new Date( d[xMetric]*secondTransf );
                xVal = `${xVal.getDate()}-${xVal.getMonth()+1}-${xVal.getFullYear()}`;
              }
              let text =  '';
              Object.keys(d).forEach( key => {
                if (key == xMetric) {
                  text += `<p><span>${key}</span> : ${xVal}</p>`;
                } else {
                  if (key.indexOf('annotation') == -1) {
                    text += `<p><span>${key}</span> : ${d[key]}</p>`;
                  }
                  
                }
              })
              tooltip
                .style("opacity","1")
                .style("visibility","visible")
                .html(text)
                .style("top", (event.layerY-40)+"px")
                .style("right","auto")
                .style("left",(event.layerX+15)+"px");
              if ((event.layerX+100) > width){
                tooltip
                  .style("left","auto")
                  .style("right",(width - event.layerX+100)+"px");
              }
              if(event.layerY-40+toolTopBlock.offsetHeight > height) {
                tooltip
                  .style("top", (event.layerY-10-toolTopBlock.offsetHeight)+"px")
              }

              lineDot
                .attr("opacity","0.7")
                .attr("x1",  x(d[xMetric]*secondTransf) )
                .attr("x2", x(d[xMetric]*secondTransf) )

              allDotHover = svg.selectAll('circle').nodes().filter( dot => {
                if(dot.classList.contains('dot')){
                  if (dot.getAttribute('cx') == x(d[xMetric]*secondTransf) && dot['__data__'][dot.getAttribute('metric')] != null ) {
                    dot.style="opacity:1";
                    return dot
                  }
                      
                }
              });
                                        


              this.style="opacity:1"

            })  // при наведении мышки точка появляется
            .on("mouseout", function(d) {
              let opacity = 1;
              if (!this.getAttribute("data-last-dote")) {
                if (nullValue == -1) {
                  opacity = 0;
                }

                allDotHover.forEach( dot => {
                  //console.log(dot['__data__'])
                  if (extraDot.indexOf(dot['__data__']) == -1) {
                    dot.style=`opacity:0`;
                  }
                  if (dot.getAttribute("data-with-caption")) {
                    dot.style=`opacity:1`;
                  }
                })
              }

              if (this.getAttribute("data-with-caption")) { 
                opacity = 1;
              }

              mustSee.forEach( item => {
                if (item[metricsName[i]] == d[metricsName[i]]) {
                  opacity =  1
                }
              })
              this.style=`opacity:${opacity}`;
              tooltip
                .style("opacity","0")
                .style("visibility","hidden")

              lineDot
                .attr("opacity","0")                                 

            })  // при уводе мышки исчезает, только если это не точка выходящяя порог
         
        })

                  
        // добовляем область выделения 
        line
          .append("g")
          .attr("class", "brush")
          .call(brush);

      } else {

            
        let step = ((height-20)/metricsName.length).toFixed(5);
        let startY = 20;
        let otstupProcent;
        y = [];
        line = [];
        AllLinesWithBreak = [];



        // создаем tooltip
        let tooltip = 
            d3.select(this.$el.querySelector('.dash-multi'))
              .append("div")
              .attr("class", `tooltip-separeted`)
              .style("color",colors[1])
              .style("background",this.color.backElement)
              .style('border-color',colors[1])
              .style('z-index','2')
              .text('');

        let toolTopBlock = tooltip.nodes()[0];

                         
        // создаем дополнительную линию при наведении на точку
        let lineDot = svg.append("g") 
          .append("line")
          .attr('class','line-dot')
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1",20)
          .attr("y2", height)
          .attr("stroke", that.colorFrom.text)
          .style("stroke-dasharray", "3 3") 
          .attr("opacity", "0");

        // создаем вертикальные линии

        if (annotation.length != 0) {
          annotation.forEach( (item,i) => {
            data.forEach( d => {
              if (d[item]) {
                verticalLine(d,item,metricsName.length+1+i,tooltip);
              }
            })
            
          })
        }



        // линии отделяющие графики друг от друга
        metricsName.forEach( (metric,i) => {



          if (i != 0) {
            svg.append("g") 
              .append("line")
              .attr("x1", 0)
              .attr("x2", width)
              .attr("y1",((step*i)+20))
              .attr("y2", ((step*i)+20))
              .style("stroke", colors[1]) 
              .attr("opacity", "0.3");
          }


          otstupProcent = (10*max[i])/100;

          

          let metricOPt = {};
          if (metricsOpt.length != 0) {

            metricsOpt.forEach( item => {
              if (item.name == metric) {
                metricOPt = {...{},...item};
              }
            })

          }
          let minY, maxY;
          if (Object.keys(metricOPt).length == 0) {
            minY = min[i];
            maxY = max[i];
          } else {
            if (metricOPt.manual) {
              minY = min[i];
              maxY = max[i];
            } else {
              minY = parseFloat(metricOPt.lowborder);
              maxY = parseFloat(metricOPt.upborder);
            }
          }

          // svg.append("defs").append("svg:clipPath")
          //   .attr("id", `clip-${that.id}-${i}`)
          //   .append("svg:rect")
          //   .attr("width", width )
          //   .attr("height", parseFloat(step)+20)
          //   .attr("x", 0)
          //   .attr("y", startY);


          if (i == 0 ) {

            y.push(d3.scaleLinear()
              .domain([minY, maxY+otstupProcent])
              .range([parseFloat(step)+20,startY  ]));

            

            // добавляем ось Y
            svg.append("g")
              .call(d3.axisLeft(y[i]).tickValues([maxY]));

            
            if (Object.keys(metricOPt).length == 0 || metricOPt.type == 'Line chart') {
              
              // создаем область выделения
              brush = d3.brushX()                   // область выделения
                .extent( [ [0,startY], [width,parseFloat(step)+20] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
                .on("end", updateData )               // каждый раз как область выделения изменится вызовется функция
              brush.id = i;

            }
            

            startY = parseFloat(step)+20;
            
          } else {
            
            y.push(d3.scaleLinear()
              .domain([minY, maxY+otstupProcent])
              .range([ parseFloat(step*(i+1))+20, startY ]));

            // добавляем ось Y
            svg.append("g")
              .call(d3.axisLeft(y[i]).tickValues([maxY]));

            if (Object.keys(metricOPt).length == 0 || metricOPt.type == 'Line chart') {
              
              // создаем область выделения
              // brush = d3.brushX()                   // область выделения
              //   .extent( [ [0,startY], [width, parseFloat(step*(i+1))+20] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
              //   .on("end", updateData)               // каждый раз как область выделения изменится вызовется функция
              // brush.id = i;

              brush = d3.brushX()                   // область выделения
                .extent( [ [0,startY], [width, parseFloat(step*(i+1))+20] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
                .on("end", updateData)               // каждый раз как область выделения изменится вызовется функция
              brush.id = i;

              

              
            }
            //console.log(brush)

            startY = parseFloat(step*(i+1))+20;


          }

          // let cutData = data.filter( item => {
          //     if (item[metric] >= minY && item[metric] <= maxY) {
          //       return item
          //     }
          //   })


          if (Object.keys(metricOPt).length == 0 || metricOPt.type == 'Line chart') {

            // строим основную линию

            line.push(svg.append('g')  // основная линия графика
              .attr("clip-path", `url(#clip-${that.id})`));


            let nullValue = -1;
            let dotDate = null;
            let linesWithBreak = [];
            let onelinesWithBreak = [];
            let mustSee = [];
            let allDotHover = [];
            if (extraDot.length > 0) {
              extraDot.forEach( (item,j) => {
                if (metric == item.column) {
                  nullValue = j
                }
              })
            }

            let cutData = data.filter( item => {
              if (item[metric] >= minY && item[metric] <= maxY) {
                return item
              }
            })
            //console.log(cutData)

                        

            if(nullValue == -1) {

              cutData.forEach( line => {
                if (!Number(line[metric]) && line[metric] != 0) { 
                  onelinesWithBreak.length == 1 ? mustSee.push(onelinesWithBreak[0]) : false;
                  linesWithBreak.push(onelinesWithBreak);
                  onelinesWithBreak = [];
                } else {
                  onelinesWithBreak.push(line);
                }
              })
              onelinesWithBreak.length == 1 ? mustSee.push(onelinesWithBreak[0]) : false;
              linesWithBreak.push(onelinesWithBreak);
              AllLinesWithBreak[i] = (linesWithBreak);
              linesWithBreak.forEach( (lineItself,j) => {
                    
                // Добовляем линию
                line[i].append("path")
                  .datum(lineItself)
                  .attr("class", `line-${i}-${j}`)  // добовляем свой класс
                  .attr("fill", "none")
                  .attr("stroke", colorLine[i])
                  .attr("stroke-width", 1.5)
                  .attr("d", d3.line()
                    .x(function(d) {return x(d[xMetric]*secondTransf) })
                    .y(function(d) {return y[i](d[metric]) })
                  )
              })
                                  
                                  
              dotDate = cutData;

            } else {
              dotDate = [extraDot[nullValue]];
            }

                          

            svg
              .append("g")
              .selectAll('dot')
              .data(dotDate)
              .enter()
              .append("circle")
              .attr("cx", function(d) { return x(d[xMetric]*secondTransf) } )
              .attr("cy", function(d) {  return y[i](d[metric])  } )
              .attr("r", 5)
              .attr("fill",colorLine[i])
              .attr('metric',metric)
              .style("opacity",function(d,j) {
                let opacity = 0;
                if (nullValue != -1) {
                  opacity =  1;
                }
                mustSee.forEach( item => {
                  if (item[metric] == d[metric]) {
                    opacity =  1;
                  }
                })
                if (lastDot) {
                  if (j == data.length-1) { // если это последняя точка, то
                    opacity = 1;  // и постоянно ее отображаем
                    putLabelDot('data-last-dote','last-dot-text',d,y[i](d[metric])-10,metric,this,that);
                  }
                }
                if (d[`_${metric}_caption`] && !this.getAttribute("data-last-dote")) {
                  opacity = 1;  // и постоянно ее отображаем
                  putLabelDot('data-with-caption','caption-dot-text',d,y[i](d[metric])-10,`_${metric}_caption`,this,that);
                }
                return opacity
              })
              .attr("class",`dot dot-${i}`)
              .on('click', function(d) {return that.setClick({x: d[xMetric],y: d[metric]},'click')})
              .on("mouseover", function(d) {
                let xVal = d[xMetric]; 
                if (time) {
                  xVal = new Date( d[xMetric]*secondTransf );
                  xVal = `${xVal.getDate()}-${xVal.getMonth()+1}-${xVal.getFullYear()}`;
                }
                let text =  '';
                that.props.metrics.forEach( key => {
                  if (key == xMetric) {
                    text += `<p><span>${key}</span> : ${xVal}</p>`;
                  } else {
                    text += `<p><span>${key}</span> : ${d[key]}</p>`;
                  }
                })
                tooltip
                  .style("opacity","1")
                  .style("visibility","visible")
                  .html(text)
                  .style("top", (event.layerY-40)+"px")
                  .style("right","auto")
                  .style("left",(event.layerX+15)+"px");
                if ((event.layerX+100) > width){
                  tooltip
                    .style("left","auto")
                    .style("right",(width - event.layerX+100)+"px");
                }
                if(event.layerY-40+toolTopBlock.offsetHeight > height) {
                  tooltip
                    .style("top", (event.layerY-10-toolTopBlock.offsetHeight)+"px")
                }
                lineDot
                  .attr("opacity","0.7")
                  .attr("x1",  x(d[xMetric]*secondTransf) )
                  .attr("x2", x(d[xMetric]*secondTransf) )

                allDotHover = svg.selectAll('circle').nodes().filter( dot => {
                  if(dot.classList.contains('dot')){
                    if (dot.getAttribute('cx') == x(d[xMetric]*secondTransf) && dot['__data__'][dot.getAttribute('metric')] != null ) {
                      dot.style="opacity:1";
                      return dot
                    }
                    
                  }
                });
                
                this.style="opacity:1"

              })  // при наведении мышки точка появляется
              .on("mouseout", function(d) {
                let opacity = 1;
                if (!this.getAttribute("data-last-dote") ) {
                  if (nullValue == -1) {
                    opacity = 0;
                  }
                  allDotHover.forEach( dot => {
                    
                    if (extraDot.indexOf(dot['__data__']) == -1) {
                      dot.style=`opacity:0`;
                    }
                    if (dot.getAttribute("data-with-caption")) {
                      dot.style=`opacity:1`;
                    }
                  })
                }
                if (this.getAttribute("data-with-caption")) { 
                  opacity = 1;
                }



              
                mustSee.forEach( item => {
                  if (item[metric] == d[metric]) {
                    opacity =  1;
                  }
                })
                
                this.style=`opacity:${opacity}`;
                // }
                tooltip
                  .style("opacity","0")
                  .style("visibility","hidden")

                lineDot
                  .attr("opacity","0")


              })  // при уводе мышки исчезает, только если это не точка выходящяя порог


                          
            // добовляем область выделения 
            line[i]
              .append("g")
              .attr("class", `brush-${i}`)
              .call(brush);

          } else if (Object.keys(metricOPt).length != 0 || metricOPt.type == 'Bar chart') {
            //line.push('Bar chart');  // добовляем в массив заглушку, чтобы собюсти порядок следования линий для линейных графиков
            let allDotHover = [];
            line.push(svg.append('g')  // основная линия графика
              .attr("clip-path", `url(#clip-${that.id})`)
            );
                
            // добавляем ось X 
            let x = d3.scaleBand()
              .range([ 0, width ])
              .domain(data.map(function(d) {return d[xMetric]; }));
              //.padding(0.2);
                                            
            //let ticks = data;

            // if (data.length > 10) {
            //   ticks = data.filter( (item,i) => {
            //     if (i == 0 || i == data.length-1 || (i % (Math.round(data.length/9)) == 0)) {
            //       return item
            //     }
            //   });
            // }

            svg.append("g")
              .attr("transform", "translate(0," + startY + ")")
              .call(d3.axisBottom(x))
              .style('opacity','0');

            // // добавляем ось Y
            // let y = d3.scaleLinear()
            //   .domain([0, max])
            //   .range([ height, 0]);
            // svg.append("g")
            //   .call(d3.axisLeft(y));

            let cutData = data.filter( item => {
              if (item[metricOPt.name] >= minY && item[metricOPt.name] <= maxY) {
                return item
              }
            })

      

            // добовляем сами столбики
            line[i].selectAll(`bar-${i}`)
              .data(cutData)
              .enter()
              .append("rect")
              .attr("x", function(d) { return x(d[xMetric]); })
              .attr("y", function(d) { return y[i](d[metricOPt.name]); })
              .attr("width", x.bandwidth())
              .attr("height", function(d,j) { 
                if (lastDot) {
                  if (j == cutData.length - 1) {
                    putLabelDot('data-last-bar','last-bar-text',d,y[i](d[metricOPt.name])-5,metricOPt.name,this,that,);
                  }
                }
                if (d[`_${metricOPt.name}_caption`]) {
                  putLabelDot('data-with-caption','caption-bar-text',d,y[i](d[metricOPt.name])-5,`_${metricOPt.name}_caption`,this,that,);
                }
                
                return startY - y[i](d[metricOPt.name]); 
                
              })
              .attr("fill", this.colorLegends[i])
              .on('click', function(d) {return that.setClick({x: d[xMetric],y: d[metricOPt.name]},'click')})
              .on("mouseover", function(d) {
                let xVal = d[xMetric]; 
                if (time) {
                  xVal = new Date( d[xMetric]*secondTransf );
                  xVal = `${xVal.getDate()}-${xVal.getMonth()+1}-${xVal.getFullYear()}`;
                }
                let text =  '';
                that.props.metrics.forEach( key => {
                  if (key == xMetric) {
                    text += `<p><span>${key}</span> : ${xVal}</p>`;
                  } else {
                    text += `<p><span>${key}</span> : ${d[key]}</p>`;
                  }
                })
                tooltip
                  .style("opacity","1")
                  .style("visibility","visible")
                  .html(text)
                  .style("top", (event.layerY-40)+"px")
                  .style("right","auto")
                  .style("left",(event.layerX+15)+"px");
                if ((event.layerX+100) > width){
                  tooltip
                    .style("left","auto")
                    .style("right",(width - event.layerX+100)+"px");
                }
                if(event.layerY-40+toolTopBlock.offsetHeight > height) {
                  tooltip
                    .style("top", (event.layerY-10-toolTopBlock.offsetHeight)+"px")
                }
                lineDot
                  .attr("opacity","0.7")
                  .attr("x1",  x(d[xMetric]*secondTransf))
                  .attr("x2", x(d[xMetric]*secondTransf))

                allDotHover = svg.selectAll('circle').nodes().filter( dot => {
                  if(dot.classList.contains('dot')){
                    if (dot['__data__'][xMetric] == d[xMetric]*secondTransf && dot['__data__'][dot.getAttribute('metric')] != null ) {
                      dot.style="opacity:1";
                      return dot
                    }
                    
                  }
                });

              })  // при наведении мышки точка появляется
              .on("mouseout", function() {
                if (!this.getAttribute("data-last-bar") ) {
                  allDotHover.forEach( dot => {
                    if (extraDot.indexOf(dot['__data__']) == -1) {
                      dot.style=`opacity:0`;
                    }
                    if (dot.getAttribute("data-with-caption")) {
                      dot.style=`opacity:1`;
                    }
                  })
                }
              
                // mustSee.forEach( item => {
                //   if (item[metric] == d[metric]) {
                //     opacity =  1;
                //   }
                // })
                
                //this.style=`opacity:${opacity}`;
                // }
                tooltip
                  .style("opacity","0")
                  .style("visibility","hidden")

                lineDot
                  .attr("opacity","0")


              })  // при уводе мышки исчезает, только если это не точка выходящяя порог


          }



        })






                         
      }

                    
      // function checkName(name) {  // функция которая проверяет не слишком ли длинное название и сокращает его
      //   if (name.length > 10) {  // если там больше 10 символов
      //     name = name.substring(0,10) + '...'; // обрезаем и добовляем троеточие
      //   }
      //   return name 
      // }

      function verticalLine(d,item,i,tooltip) {
        let group = svg
          .append("g")
          .attr("class","vetical-line-group");
        

        group
          .append("line")
          .attr("class","vetical-line")
          .attr("x1", x(d[xMetric]*secondTransf))
          .attr("y1", 20)
          .attr("x2", x(d[xMetric]*secondTransf))
          .attr("y2", height)
          .attr("stroke", colors[i])
          .style("opacity", "0.7")

        group
          .append("circle")
          .attr("cx",  x(d[xMetric]*secondTransf) )
          .attr("cy", 20)
          .attr("r", 5)
          .attr("opacity", "0.7")
          .attr("fill", colors[i])
          .attr("class","dot-vertical")
          .on("mouseover", function() {
            tooltip
              .style("opacity","1")
              .style("visibility","visible")
              .html(`<p>${d[item]}</p>`)
              .style("top", (event.layerY-30)+"px")
              .style("right","auto")
              .style("left",(event.layerX+20)+"px");
            if ((event.layerX+100) > width){
              tooltip
                .style("left","auto")
                .style("right",(width - event.layerX+110)+"px");
            }
          })  // при наведении мышки точка появляется
          .on("mouseout", function() {
            tooltip
              .style("opacity","0")
              .style("visibility","hidden")
          }) 
      }

      function putLabelDot (attr,classText,d,y,metricText,dot,that) {
        dot.setAttribute(attr,'true');  // так же зададим атрибут сосбтвенный, чтобы потом понимать с какой точки мышка ушла
        svg.append('text')   // текст легенды (название метрики)
          .attr('class',classText)
          .attr('transform', `translate(${x(d[xMetric]*secondTransf)},${y})`) 
          .attr('font-size', `0.7em`)
          .attr('text-anchor','end')
          .style('fill', that.colorFrom.text)
          .text(d[metricText]);
      }

                 
      function updateData () {  // функция которая вызывается каждый раз, когда происходит выделение области (brush)

        let extent = d3.event.selection;  // значения выделенной области

        if(extent){  // если область выделена всё-таки

          let diapason = [];
          if (time){
            diapason = [parseInt(new Date(x.invert(extent[0])).getTime()/1000),parseInt(new Date(x.invert(extent[1])).getTime()/1000)];  // получаем эти значения в нужном нам виде
          } else {
            diapason = [parseFloat(x.invert(extent[0]).toFixed(5)),parseFloat(x.invert(extent[1]).toFixed(5))];
          }
            
          //console.log(diapason);
          //that.$store.commit('setDiapasonDash', {diapason: diapason, id: props.id});  // заносим в хранилище
        
          that.setClick(diapason, 'select');  // вызываем функцию создающию токены

          if (d3.event.target.id != undefined) {
            zoom(extent,d3.event.target.id);  // делаем зумирование  графика
          } else {
            zoom(extent);  // делаем зумирование  графика
          }

                                
                                  
        }
        
      }

      function zoom(extent,id) {  // функция делающяя зумирование графика
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);  // меняем значения оси х на основе нашего выделенного диапазона
        
        if (id != undefined) {
          line[id].select(`.brush-${id}`).call(brush.move, null);  // убираем область выделения
        } else {
          line.select(`.brush`).call(brush.move, null);  // убираем область выделения
        }

        if (time) {
          xAxis.transition().duration(secondTransf)
            .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat('%d-%m-%Y '))
              .tickValues(
                x.ticks().filter( (item,i) => {
                  if (i%2 == 0) {
                    return item
                  }
                })
              )
              .ticks(5)
            );  // растягиваем плавно ось x
        } else {
          xAxis.transition().duration(1000).call(d3.axisBottom(x));
        }
        if (id == undefined) {
          metricsName.forEach( (item,i) => {
            changeZoom(1000,i);   // вызываем функцию которая перересует все линии и точки как надо
          })
        } else {
          changeZoom(1000,id);   // вызываем функцию которая перересует все линии и точки как надо
        }


        svg.on("dblclick",function(){  // если дважды щелкнуть по любому месту 

          if (time) {
            x.domain(d3.extent(data, function(d) {   return  new Date(d[xMetric]*secondTransf) })); // то вернем ось х в исходное состояние
            xAxis.transition().duration(secondTransf)
              .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%d-%m-%Y '))
                .tickValues(
                  x.ticks().filter( (item,i) => {
                    if (i%2 == 0) {
                      return item
                    }
                  })
                )
                .ticks(5)
              );
          } else {
            x.domain([minX, maxX])
            xAxis.transition().duration(1000).call(d3.axisBottom(x));
          }

          metricsName.forEach( (item,i) => {
            changeZoom(300,i);    // вызываем функцию которая перересует все линии и точки как надо
          })
          if (id == undefined) {
            metricsName.forEach( (item,i) => {
              changeZoom(300,i);   // вызываем функцию которая перересует все линии и точки как надо
            })
          } else {
            changeZoom(300,id);   // вызываем функцию которая перересует все линии и точки как надо
          }
          // changeZoom(300);  // и вернем все линии  в исходное состояние

        });

                      

        function changeZoom(dauration,i) {  // функция которая перерисовывает все линии
          let lineChange;
          if (united) {
            lineChange = line;
          } else {
            lineChange = line[i];
          }
          

          if (AllLinesWithBreak[i]) {

            AllLinesWithBreak[i].forEach( (lineItself,j) => {
              lineChange  // основная линия
                .select(`.line-${i}-${j}`)
                .transition()
                .duration(dauration)
                .attr("d", d3.line()
                  .x(function(d) { return x(d[xMetric]*secondTransf) })
                  .y(function(d) { if (united) { return y(d[metricsName[i]]) } else { return y[i](d[metricsName[i]]) } })
                )
            })
          }
                        
          svg  // все точки на графике
            .selectAll(`.dot-${i}`)
            .transition()
            .duration(dauration)
            .attr("cx", function(d) { return x(d[xMetric]*secondTransf) } )
            .attr("cy", function(d) { if (united) { return y(d[metricsName[i]]) } else { return y[i](d[metricsName[i]]) } }  )
        
        }

      }

      function checkExtraDot(data) {
        let nullArr = [];
        let value = [];
        let count = {};
        Object.values(data).forEach( item => {
          Object.keys(item).forEach( (key,i) => {
            if (i !=0) {
                
              if (!Number(item[key]) && item[key] != 0) {
                if (!nullArr.includes(key)) {
                  nullArr.push(key)
                }
              } else {
                if (!count[key]) {
                  count[key] = 1;
                } else {
                  count[key] = count[key]+1;
                }  
              }
            }
          })
        })
                       
                        
        nullArr = nullArr.filter( item => {
          if (count[item] == 1) {
            return item
          }
        })
                        
        if(nullArr.length > 0) {
          nullArr.forEach( key=> {
              
            Object.values(data).filter( item => {
                
              if (Number(item[key]) || Number(item[key]) == 0) {
                value.push({...item,...{column: key}});
              }
            });
          })
        }
        return value
      }
        
                    
    }, 
    createLegends: function(metricsName){
      let colorLine = this.colorLegends;
      
      this.props.legends = [];
      metricsName.forEach( (item,i) => {
        this.props.legends.push({color: colorLine[i],label: metricsName[i]})
      })
      

                     
      let  readyLegends = setTimeout( function tick()  {
        if (this.$refs && this.props.legends.length > 0){
          clearTimeout(readyLegends);
        } else {
          readyLegends = setTimeout(tick.bind(this), 100); 
        }
      }.bind(this),0); 
                

    },
    setClick: function(point, action) {
      
      let tockens = this.$store.getters.getTockens(this.idDash);
      let tocken = {};
      
      let setTocken = (value) => {
        this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: value, store: this.$store });


      }
                            
      Object.keys(tockens).forEach( i =>{
        tocken = {
          name: tockens[i].name,
          action: tockens[i].action,
          capture: tockens[i].capture,
        }
        if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'pointX') {
          setTocken(point.x);
          
        } else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'pointY') {
          setTocken(point.y);
        } else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'start') {
          setTocken(point[0]);
        } else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'end') {
          setTocken(point[1]);
        } 
      })



      let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: 'point'});
      
      if (events.length != 0) {
        events.forEach( item => {
          if(item.action == 'set'){
            this.$store.commit('letEventSet', {events: events, idDash: this.idDash,  });
          } else if (item.action == 'go') {
            if (action != 'select') {
              this.$store.commit('letEventGo', {event: item, idDash: this.idDash });
              this.$router.push(`/dashboards/${item.target.toLowerCase()}`);
            }
          }
        })
      }

    },
       
  },
  mounted() {
    this.$store.commit('setActions', {actions: this.props.actions, idDash: this.idDash, id: this.id });
    this.$refs.lineChart.parentElement.style.overflow = 'hidden';
  },
}


</script>

<style lang="sass" > 
  
     @import '../../sass/dashMultiLine.sass'
    
</style>