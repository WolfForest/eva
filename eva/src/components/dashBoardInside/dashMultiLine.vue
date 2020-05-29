<template>
      <div class="multiLine-block" ref="lineChart">
          <div class="nodata" v-if="props.nodata"> {{ props.message }}</div>
          <div  :class="props.class" class="dash-multi" v-show="!dataLoading" :data-status="getDataStart"> </div>
          <div class="loading" v-show="dataLoading">
            <div class="preloader">
                <div class="stable"></div>
                <div class="dynamic"></div>
            </div>
            <p> Загружаю данные... </p>
        </div>
        <div class="legend-block" ref="legends">
            <div class="legend-line" v-for="item in props.legends" :key="item.label">
                <div class="circle" :style="{backgroundColor:item.color}"></div>
                <div class="text" :style="{color:color.text}">{{item.label}}</div>    
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
                   name:'click',
                   capture: ['pointX','pointY']
                   },
                   {
                   name:'select',
                   capture: ['start','end']
                   },
               ],
               legends: [],
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
           // console.log('yep')
            this.props.legends = [];
            return this.dataRestFrom
        },
        color: function() {
            return this.colorFrom
        },
        colorLegends: function() {
            return [this.colorFrom.controls,this.colorFrom.controlsActive,'#660099','#3366FF','#e5194a','#fbbe18','#26295a','#228B22'];
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
        // otstupTop: function() {
        //     if (this.dataRest.length > 0 && this.props.legends.length == 0) {
        //         this.createLegends();
        //     }
        //     return this.$refs.legends.getBoundingClientRect().height
        // },
        getDataStart: function() {

                 let sizeLine = {'width':0,'height':0};  // получаем размеры от родителя
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
                                        if (this.props.legends.length == 0) {
                                            let metricsName = Object.keys(this.props.result[0]).filter( (item,i) => {
                                                if (i != 0) {
                                                    return item
                                                }
                                            });
                                            if (metricsName.length > 0) {

                                                this.createLegends(metricsName);
                                                let timeOut = setTimeout( function tick() {
                                                        if (this.$refs && this.$refs.legends.getBoundingClientRect().height > 0 ) {
                                                            
                                                            clearTimeout(timeOut);
                                                            this.createLineChart(this.props,this,sizeLine,time,united);
                                                        }  else {
                                                            timeOut = setTimeout(tick, 100); 
                                                        }
                                                }.bind(this), 0);

                                            } else {
                                                this.props.message = 'Данные не подходят для построения графика';
                                                this.props.nodata = true; 
                                            }

                                                                               
                                    //     if (this.props.legends.length == 0) {
                                    //         let legends = new Promise((resolve, reject) => {
                                    //             this.createLegends(resolve);
                                    //         });
                                    //         legends
                                    //             .then(
                                    //                 result => {
                                    //                     this.createLineChart(this.props,this,sizeLine,time,united); // и собственно создаем график
                                    //                 },
                                    //             );
                                        } else {
                                            this.createLineChart(this.props,this,sizeLine,time,united);
                                        }
                                        
                                        
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
         createLineChart: function (props,that,sizeLine,time,united) {  // создает график

             let colors = [this.color.controls,this.color.text,this.color.controlsActive]; // основные используемые цвета
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

                let metricsName = [];  // массив из всех метрик что доступны на графике и в нужном нам порядке

                metricsName = Object.keys(data[0]).filter( (item,i) => {
                    if (i != 0) {
                        return item
                    }
                });          

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

                // настраиваем шаги на оси икс в зависимости от ширины элемента

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


                if (time) {
                    xAxis = svg.append("g")
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
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));
                }

                // создаем область графика, все-что вне этой области не будет отрисованно
                    let clip = svg.append("defs").append("svg:clipPath")
                        .attr("id", `clip-${that.id}`)
                        .append("svg:rect")
                        .attr("width", width )
                        .attr("height", height )
                        .attr("x", 0)
                        .attr("y", 0);

                //  let legend =  svg
                //         .append('g')  // доволяем легенду
                //         .attr('class', 'legend')
                //         .attr('transform', `translate(${-100},0)`); 

                // metricsName.forEach( (item,i) => {
                //     legend.append("circle")  // кружок легенды
                //             .style("fill", colorLine[i])
                //             .style('stroke', colorLine[i])
                //             .attr('r', 5)
                //             .attr('transform', `translate(${width-(i*130)},0)`);
                //     legend.append('text')   // текст легенды (название метрики)
                //             .attr('transform', `translate(${width-(i*130)+15},5)`)
                //             .attr('data-name', metricsName[i])  
                //             .style('fill', colors[1])
                //             .text(checkName(metricsName[i]));  // здесь вызываем функцию которая проверяет не слишком ли длинное название и сокращает его
                // });


                


                
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

                    y = d3.scaleLinear()
                            .domain([0, max])
                            .range([ height, 20 ]);

                    // добавляем ось Y
                        svg.append("g")
                            .call(d3.axisLeft(y).ticks(y.ticks().length/2));

                

                    

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
                            .attr("stroke", 'black')
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
                                                    .y(function(d,j) {return y(d[metricsName[i]]) })
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
                                    .style("opacity",function(d) {
                                        let opacity = 0;
                                        if (nullValue != -1) {
                                            opacity =  1
                                        };
                                        mustSee.forEach( item => {
                                            if (item[metricsName[i]] == d[metricsName[i]]) {
                                                opacity =  1
                                            }
                                        })
                                        return opacity
                                    })
                                    .attr("class",`dot dot-${i}`)
                                    .on('click', function(d) {return that.setClick({x:d[xMetric],y:d[metricsName[i]]},'click')})
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
                                        //if (!this.getAttribute("data-anomaly")){
                                            let opacity = 1;
                                            if (nullValue == -1) {
                                                opacity = 0;
                                            }
                                          //  console.log(extraDot)

                                            allDotHover.forEach( dot => {
                                                //console.log(dot['__data__'])
                                                if (extraDot.indexOf(dot['__data__']) == -1) {
                                                    dot.style=`opacity:0`;
                                                }
                                            })
                                             mustSee.forEach( item => {
                                                if (item[metricsName[i]] == d[metricsName[i]]) {
                                                    opacity =  1
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
         

                    })

                  

                    // добовляем область выделения 
                    line
                        .append("g")
                            .attr("class", "brush")
                        // .on("click",clearMethods)
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
                                .attr("stroke", 'black')
                                .style("stroke-dasharray", "3 3") 
                                .attr("opacity", "0");



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


                            if (i == 0 ) {

                                y.push(d3.scaleLinear()
                                    .domain([0, max[i]+otstupProcent])
                                    .range([parseFloat(step)+20,startY  ]));

                                    // добавляем ось Y
                                    svg.append("g")
                                        .call(d3.axisLeft(y[i]).tickValues([max[i]]));

                                     // создаем область выделения
                                    brush = d3.brushX()                   // область выделения
                                        .extent( [ [0,startY], [width,parseFloat(step)+20] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
                                        .on("end", updateData )               // каждый раз как область выделения изменится вызовется функция
                                    brush.id = i;
                                    

                                    startY = parseFloat(step)+20;
                                
                            } else {
                                y.push(d3.scaleLinear()
                                    .domain([0, max[i]+otstupProcent])
                                    .range([ parseFloat(step*(i+1))+20, startY ]));

                                    // добавляем ось Y
                                    svg.append("g")
                                        .call(d3.axisLeft(y[i]).tickValues([max[i]]));

                                     // создаем область выделения
                                    brush = d3.brushX()                   // область выделения
                                        .extent( [ [0,startY], [width, parseFloat(step*(i+1))+20] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
                                        .on("end", updateData)               // каждый раз как область выделения изменится вызовется функция
                                    brush.id = i;
                                    startY = parseFloat(step*(i+1))+20;


                            }

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

                       

                            if(nullValue == -1) {

                                    data.forEach( line => {
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
                                     AllLinesWithBreak.push(linesWithBreak);
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
                                                    .y(function(d,j) {return y[i](d[metric]) })
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
                                    .attr("cy", function(d) {  return y[i](d[metric])  } )
                                    .attr("r", 5)
                                    .attr("fill",colorLine[i])
                                    .attr('metric',metric)
                                    .style("opacity",function(d) {
                                        let opacity = 0;
                                        if (nullValue != -1) {
                                            opacity =  1
                                        };
                                        mustSee.forEach( item => {
                                            if (item[metric] == d[metric]) {
                                                opacity =  1
                                            }
                                        })
                                        return opacity
                                    })
                                    .attr("class",`dot dot-${i}`)
                                    .on('click', function(d) {return that.setClick({x:d[xMetric],y:d[metric]},'click')})
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
                                        //if (!this.getAttribute("data-anomaly")){
                                            let opacity = 1;
                                            if (nullValue == -1) {
                                                opacity = 0;
                                            }
                                            allDotHover.forEach( dot => {
                                                if (extraDot.indexOf(dot['__data__']) == -1) {
                                                    dot.style=`opacity:0`;
                                                }
                                            })

                                            mustSee.forEach( item => {
                                                if (item[metric] == d[metric]) {
                                                    opacity =  1
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
                                // .on("click",clearMethods)
                                    .call(brush);


                        })


                         
                    }

                    
                    function checkName(name) {  // функция которая проверяет не слишком ли длинное название и сокращает его
                       if (name.length > 10) {  // если там больше 10 символов
                         name = name.substring(0,10) + '...'; // обрезаем и добовляем троеточие
                     }
                     return name 
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

                                
                                  
                            } else {
                              // that.$store.commit('setDiapasonDash', {diapason: ['null','null'], id: props.id}); 
                              // clearMethods();
                               
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
                                      value.push({...item,...{column:key}});
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
                   // this.props.legends = [{color: 'black',label:'12131231231231231231313'},{color: 'black',label:'1213123121231231231313'},{color: 'black',label:'1211231231231231231313'}];


                    let  readyLegends = setTimeout( function tick()  {
                        
                        if (this.$refs && this.$refs.legends.offsetHeight > 0){
                            clearTimeout(readyLegends);
                            //resolve('done')
                        } else {
                            readyLegends = setTimeout(tick, 100); 
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
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'pointX') {
                        setTocken(point.x);
                       // this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: point.x });
                    } 
                     else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'pointY') {
                         setTocken(point.y);
                       // this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: point.y });
                    } else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'start') {
                        setTocken(point[0]);
                      //  this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: point[0] });
                    } else if (tockens[i].elem == this.id && tockens[i].action == action && tockens[i].capture == 'end') {
                        setTocken(point[1]);
                        // this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: point[1] });
                    } 
                })



            let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: 'point'});
            
            if (events.length != 0) {
                events.forEach( item => {
                    if(item.action == 'set'){
                        this.$store.commit('letEventSet', {events: events, idDash: this.idDash,  });
                    } else if (item.action == 'go') {
                        if (action != 'select') {
                            
                              //  console.log(tockens);
                           // this.$store.commit('letEventGo', {events: events, idDash: this.idDash  });
                            // events.events.forEach(item => {

                            this.$store.commit('letEventGo', {event: item, idDash: this.idDash });
                            this.$router.push(`/dashboards/${item.target.toLowerCase()}`);
                         //   this.$router.go(`/dashboards/${item.target.toLowerCase()}`);
                        }
                    }
                })
            }

          
            

            //  if (this.$store.getters.getMethods({id: this.props.id}).status) {
            //         this.$store.commit('setMethod', { id: this.props.id, data: point});
            //  }
         },
       
    },
     mounted() {
        // console.log('mount',this.elem);
       // this.props.id = this.$parent.props.id;
       this.$store.commit('setActions', {actions: this.props.actions, idDash: this.idDash, id: this.id });
       this.$refs.lineChart.parentElement.style.overflow = 'hidden';
        
         
     },
}


</script>

<style lang="sass" > 
  
     @import '../../sass/dashMultiLine.sass'
    
</style>