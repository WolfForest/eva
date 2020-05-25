<template>
      <div class="graph-block" ref="lineChart">
          <div class="nodata" v-if="props.nodata"> {{ props.message }}</div>
          <div  :class="props.class" class="dash-graph" v-show="!dataLoading" :data-status="getDataStart"> </div>
          <div class="loading" v-show="dataLoading">
            <div class="preloader">
                <div class="stable"></div>
                <div class="dynamic"></div>
            </div>
            <p> Загружаю данные... </p>
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
            return this.dataRestFrom
        },
        color: function() {
            return this.colorFrom
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

                 let sizeLine = {'width':0,'height':0};  // получаем размеры от родителя
                 sizeLine['width'] = this.width;
                 sizeLine['height'] = this.height;

                 

                 if (sizeLine.width != 0 && sizeLine.height != 0) {  // если размеры получены выше нуля
                 
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
                                        this.createLineChart(this.props,this,sizeLine,time); // и собственно создаем график
                                    } else {  // если первое значение первого элемнета (подразумеваем что это time не число)
                                        this.props.nodata = true;  // показываем сообщение о некорректности данных
                                        this.props.result = [];  // очищаем массив результатов
                                        this.props.message = "К сожалению данные не подходят к линейному графику";  // выводим сообщение
                                        d3.select(this.$el.querySelector('.dash-graph')).selectAll('svg').remove(); // и еще график очищаем, чтобы не мешался
                                    }
                            }
                        }
                 }         
                return 'done'
    
         }

    },
     methods: {
         createLineChart: function (props,that,sizeLine,time) {  // создает график

             let colors = [this.color.controls,this.color.text,this.color.controlsActive]; // основные используемые цвета
          
             let otstupBottom = 60;
             if (screen.width <= 1600) {
                 otstupBottom = 40;
             }
             // устанавливаем размер и отступы графика 
             let margin = {top: 10, right: 20, bottom: 20, left: 60},
                            width = sizeLine.width - margin.left - margin.right - 20,
                            height = sizeLine.height - margin.top - margin.bottom - otstupBottom;
           

                let graphics = d3.select(this.$el.querySelector('.dash-graph')).selectAll('svg').nodes(); // получаем область в которой будем рисовтаь график 
                
                if(graphics.length != 0){  // если график уже есть
                    graphics[0].remove(); // удаляем его
                }

                // полготавливаем данные

                let data = props.result;

                let secondTransf = 1000;


              //  console.log(data);

              //  let xMetric = Object.keys(data[0])[0];  // в эту переменную кладем временную метрику (подразумеваем, что она первая по счету)
                let xMetric = Object.keys(data[0])[0];  // в эту переменную кладем временную метрику (подразумеваем, что она первая по счету)

                let metricsName = [];  // массив из всех метрик что доступны на графике и в нужном нам порядке

                for (let i =0; i<5; i ++) {  // предполагаем что наших метрик всегда максимум пять не считая временной
                    Object.keys(data[0]).forEach( (item,j) => {  // пробегаемся по первому элементу, на основе него и будем делать выводы о метриках
                        switch(i) { 
                            case 0:   // в первый элемнет массива нам надо занести основную метрику которая рисует основную линию
                                j != 0 && item.indexOf("lowerbound") == -1 && item.indexOf("upperbound") == -1 && item.indexOf("upperthreshold") == -1 && item.indexOf("lowerthreshold") == -1 ? metricsName.push(item) : false;
                                break
                            case 1:   // во второй заносим верхнию границу коридора
                                item.indexOf("upperbound") != -1 ? metricsName.push(item) : false;
                                break
                            case 2:  // нижняя граница коридора
                                item.indexOf("lowerbound") != -1 ? metricsName.push(item) : false;
                                break
                            case 3:  // верхняя граница порога
                                 item.indexOf("upperthreshold") != -1 ? metricsName.push(item) : false;
                                break  
                            case 4:  // нижняя
                                  item.indexOf("lowerthreshold") != -1 ? metricsName.push(item) : false;
                                break 
                        }
                    });
                }

                if(metricsName.length == 0){ // если метрик вообще не найдено
                    this.props.nodata = true;  // показываем сообщение о некорректности данных
                    this.props.result = [];  // очищаем массив результатов
                    this.props.message = "Ни одной метрики не найдено. Проверьте корректность данных";  // выводим сообщение
                    d3.select(this.$el.querySelector('.dash-graph')).selectAll('svg').remove(); // и еще график очищаем, чтобы не мешался
                    return false  // завершаем создание графика
                }


               // console.log(data)
               let x = null;
               let maxX = 0,minX =0;
                if (time) {
                    x = d3.scaleTime()
                        .domain(d3.extent(data, function(d) { return  new Date(d[xMetric]*secondTransf) }))
                        .range([ 0, width ]);
                } else {
                    maxX = data.reduce(function(last, next) {   // находим максимальное значение среди всех метрик
                        if (next[xMetric] > last){
                            return next[xMetric]
                        } else {
                            return last
                        }
                    }, 0);
                    minX = data.reduce(function(last, next) {   // находим максимальное значение среди всех метрик
                        if (next[xMetric] < last){
                            return next[xMetric]
                        } else {
                            return last
                        }
                    }, maxX);
                    x = d3.scaleLinear()
                        .domain([minX, maxX])
                        .range([ 0, width ]);
                    secondTransf = 1;
                }

                let max = metricsName.map( (item,i) => { // получаем массив с максимальным значением каждой метрики, кроме временной
                    return   d3.max(data, function(d) {  return +d[metricsName[i]]; })
                })


                max = max.reduce(function(last, next) {   // находим максимальное значение среди всех метрик
                    if (next > last){
                        return next
                    } else {
                        return last
                    }
                }, 0);

                let y = d3.scaleLinear()
                        .domain([0, max])
                        .range([ height, 20 ]);



             // добовляем svg элемент на страницу
                let svg = d3.select(this.$el.querySelector('.dash-graph'))
                            .append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .attr("data-id",props.id)
                                .attr('class',"graph-svg")
                            .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                           
                let deliter = 2;

                if ((width+ margin.left + margin.right) < 550) {
                    deliter = 3;
                } 
                if ((width+ margin.left + margin.right) < 400) {
                    deliter = 4;
                } 
                if ((width+ margin.left + margin.right) < 350) {
                    deliter = 5;
                } 
                if ((width+ margin.left + margin.right) < 300) {
                    deliter = 6;
                }          



                 // добавляем ось X     
                    let xAxis = null;
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
                                    .ticks(5)
                                
                            );
                    } else {
                       xAxis = svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x)); 
                    }
                    

                 // добавляем ось Y
                    svg.append("g")
                        .call(d3.axisLeft(y).ticks(y.ticks().length/2));

                // создаем область графика, все-что вне этой области не будет отрисованно
                    let clip = svg.append("defs").append("svg:clipPath")
                        .attr("id", "clip")
                        .append("svg:rect")
                        .attr("width", width )
                        .attr("height", height )
                        .attr("x", 0)
                        .attr("y", 0);

                        // создаем tooltip
                    d3.select(this.$el.querySelector('.dash-graph')).selectAll('.tooltip').remove();

                    let tooltip = d3.select(this.$el.querySelector('.dash-graph'))
                        .append("div")
                            .attr("class", "tooltip")
                            .style("color",colors[1])
                            .style("background",this.color.back)
                            .style('border-color',colors[1])
                            .text('');
                       

                    // создаем область выделения
                    let brush = d3.brushX()                   // область выделения
                        .extent( [ [0,0], [width,height] ] )  // инициализируем область выделения на весь граф от начала до width, heigh
                        .on("end", updateData)               // каждый раз как область выделения изменится вызовется функция


              
                    let lineName = ['general','upbound','lowbound'];  // массив в котором будем хранить наши линии, основную, и коридор, сейчас названия произвольные выставлены
              
                  


                // строим коридор метрики

                    let areaData = [];  // массив с точками для области закрашивания

                    

                    if (metricsName[1]  &&  metricsName[2] ) {  //  если коридор вообще есть (может быть и просто линейный график)

                        addHall(1);  // функция строящая линию коридора
                        addHall(2);

                    }
                       
                        //  добовляем область заливки
                        //  Add the area
                            svg.append("path")
                            .datum(areaData)
                            .attr("fill", colors[1])
                            .attr("class", "area")  // добовляем свой класс
                            .style("opacity",0.05)
                            .attr("clip-path", "url(#clip)")
                            .attr("d", d3.area()
                                .x(function(d) { return d.above.x })
                                .y0(function(d) {  return d.below.y })
                                .y1(function(d) {  return d.above.y })
                                );


                    
                       


                    // подготавливаем данные для порога 

                    
                    let treshold = {};  // здесь будет объект с границами порога

                    if (metricsName[3] && metricsName[4]) {  // если порог вообще есть (может быть просто линия ведь графика)
                        treshold[metricsName[3]] = [];  // сперва создаем объекты верхнего и нижнего порога во избежании ошибок
                        treshold[metricsName[4]] = [];
                    
                   
                        data.forEach( (item,i) => {  // пробегаемся пов сем данным
                                treshold[metricsName[3]].push(item[metricsName[3]]);  // изаносим в нужном нам виде порог
                                treshold[metricsName[4]].push(item[metricsName[4]]);
                        });

                    }
              

                  // строим основную линию

                    lineName[0]= svg.append('g')  // основная линия графика
                            .attr("clip-path", "url(#clip)");

 
                            // Добовляем линию
                            lineName[0].append("path")
                                    .datum(data)
                                    .attr("class", "line")  // добовляем свой класс
                                    .attr("fill", "none")
                                    .attr("stroke", colors[0])
                                    .attr("stroke-width", 1.5)
                                    .attr("d", d3.line()
                                        .x(function(d) { return x(d[xMetric]*secondTransf) })
                                        .y(function(d) { return y(d[metricsName[0]]) })
                                        )
                                    // Добовляем точки
                                svg
                                .append("g")
                                .selectAll("dot")
                                .data(data)
                                .enter()
                                .append("circle")
                                    .attr("cx", function(d) { return x(d[xMetric]*secondTransf) } )
                                    .attr("cy", function(d,i) {   // нам нужно понять какие точки выходят за значение порога и их мы окрасим в другой цвет
                                        this.setAttribute('fill',colors[0]);  // поэтому сперва по умолчанию красив в цвет графика
                                        this.style="opacity:0"  // и делаем точки прозрачными
                                        if (Object.keys(treshold).length == 2) {  // затем если вообще есть порог
                                            if (treshold[metricsName[3]][i] < d[metricsName[0]]|| treshold[metricsName[4]][i] > d[metricsName[0]]) {  // смотрим если значение  выходят за верхний или нижний порог
                                                    this.setAttribute('fill',colors[2]); // красим точку в другой цвет
                                                    this.style="opacity:1"  // и постоянно ее отображаем
                                                    this.setAttribute('data-anomaly','true');  // так же зададим атрибут сосбтвенный, чтобы потом понимать с какой точки мышка ушла
                                            } 
                                        }
                                        return y(d[metricsName[0]]) 
                                        } 
                                        )
                                    .attr("r", 5)
                                    .attr("class","dot")
                                    .on('click', function(d) {return that.setClick({x:d[xMetric],y:d[metricsName[0]]},'click')})
                                    .on("mouseover", function(d) {
                                        
                                        let x = d[xMetric]; 
                                        if (time) {
                                            x = new Date( d[xMetric]*secondTransf );
                                            x = `${x.getDate()}-${x.getMonth()+1}-${x.getFullYear()}`;
                                        }
                                        tooltip
                                            .style("opacity","1")
                                            .style("visibility","visible")
                                            .html(`<p><span>${xMetric}</span> : ${x}</p> 
                                            <p><span>${metricsName[0]}</span> : ${d[metricsName[0]]}</p>`)
                                            .style("top", (event.layerY-30)+"px")
                                            .style("right","auto")
                                            .style("left",(event.layerX+20)+"px");
                                        if ((event.layerX+100) > width){
                                             tooltip
                                                .style("left","auto")
                                                .style("right",(width - event.layerX+110)+"px");
                                        }
                                        this.style="opacity:1"})  // при наведении мышки точка появляется
                                    .on("mouseout", function(d) {
                                        if (!this.getAttribute("data-anomaly")){
                                            this.style="opacity:0"
                                        }
                                        tooltip
                                            .style("opacity","0")
                                            .style("visibility","hidden")
                                            })  // при уводе мышки исчезает, только если это не точка выходящяя порог


                        let legend =  svg.append('g')  // доволяем легенду
                                        .attr('class', 'legend')
                                        .attr('transform', `translate(${-100},0)`);    

                                legend.append("circle")  // кружок легенды
                                        .style("fill", colors[0])
                                        .style('stroke', colors[0])
                                        .attr('r', 5)
                                        .attr('transform', `translate(${width-15},0)`);
                                legend.append('text')   // текст легенды (название метрики)
                                        .attr('transform', `translate(${width-5},5)`)
                                        .attr('data-name', metricsName[0])  
                                        .style('fill', colors[1])
                                        .text(checkName(metricsName[0]));  // здесь вызываем функцию которая проверяет не слишком ли длинное название и сокращает его

                  

                    // добовляем область выделения 
                    lineName[0]
                        .append("g")
                            .attr("class", "brush")
                        // .on("click",clearMethods)
                            .call(brush);

                    
                    function checkName(name) {  // функция которая проверяет не слишком ли длинное название и сокращает его
                       if (name.length > 10) {  // если там больше 10 символов
                         name = name.substring(0,10) + '...'; // обрезаем и добовляем троеточие
                     }
                     return name 
                    }

                    function addHall(j) {  // функция создающяя линию коридора 
                          
                                lineName[j] = svg.append('g')  // добовляем объект для линии коридора, верхней или нижней
                                    .attr("clip-path", "url(#clip)");

                         // console.log(lineName[0]);
                            // Добовляем  саму линию
                                lineName[j].append("path")
                                    .datum(data)
                                    .attr("class", "lineHall")  // добовляем свой класс
                                    .attr("fill", "none")
                                    .attr("stroke", colors[0])
                                    .style("stroke-dasharray", "3 3")
                                    .attr("stroke-width", 1.5)
                                    .attr("d", d3.line()
                                        .x(function(d,i) { addToArea(x(d[xMetric]*secondTransf),i,'x',metricsName[j]); return x(d[xMetric]*secondTransf) })  // тут вызываем функцию которая еще и правлиьно формирует точки 
                                                                                                                                            // для области закрашивания между линиями коридора
                                        .y(function(d,i) { addToArea(y(d[metricsName[j]]),i,'y',metricsName[j]); return y(d[metricsName[j]]) })
                                        )
 
                    }

                    function addToArea(item,i,point,name) {  // функция которая создает правильный массив точек для области закрашивания коридора
                       
                        if (!areaData[i]) { // если элемнета массива еще нет
                            areaData[i] = { // то создаем его нужным нам образом
                                above: {x: null,y:null},
                                below: {x: null,y:null}
                            };
                        }
                        name.indexOf('upperbound') !=-1 ? areaData[i].above[point] = item : areaData[i].below[point] = item; // и наполняем его значениями
                        
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
                               
                                //that.$store.commit('setDiapasonDash', {diapason: diapason, id: props.id});  // заносим в хранилище
                            
                                that.setClick(diapason, 'select');  // вызываем функцию создающию токены

                                zoom(extent);  // делаем зумирование  графика
                                  
                            } else {
                              // that.$store.commit('setDiapasonDash', {diapason: ['null','null'], id: props.id}); 
                              // clearMethods();
                               
                            }

                           
                      }

                    function zoom(extent) {  // функция делающяя зумирование графика

                            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);  // меняем значения оси х на основе нашего выделенного диапазона
                            lineName[0].select(".brush").call(brush.move, null);  // убираем область выделения

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
                           

                           changeZoom(1000);   // вызываем функцию которая перересует все линии и точки как надо


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
                                 

                                changeZoom(300);  // и вернем все линии  в исходное состояние

                            });

                      

                        function changeZoom(dauration) {  // функция которая перерисовывает все линии
                            lineName[0]  // основная линия
                                .select('.line')
                                .transition()
                                .duration(dauration)
                                .attr("d", d3.line()
                                    .x(function(d) { return x(d[xMetric]*secondTransf) })
                                    .y(function(d) { return y(d[metricsName[0]]) })
                                )

                             svg  // все точки на графике
                                .selectAll(".dot")
                                .transition()
                                .duration(dauration)
                                .attr("cx", function(d) { return x(d[xMetric]*secondTransf) } )
                                .attr("cy", function(d) {  return y(d[metricsName[0]])  }  )
                            
                            if (metricsName[1]  &&  metricsName[2] ) {   // проверяем если коридор есть

                                addHallBrush(1,dauration);  // его тоже перерисовываем
                                addHallBrush(2,dauration);


                                svg  // и закрашиваем
                                    .select('.area')
                                    .transition()
                                    .duration(dauration)
                                    .attr("d", d3.area()
                                        .x(function(d) { return d.above.x })
                                        .y0(function(d) {  return d.below.y })
                                        .y1(function(d) {  return d.above.y })
                                        );

                            }

                            function addHallBrush(j,duration) {  // функция которая перерисовывает коридор
 
                            // Добовляем линию
                                lineName[j]  // линии кордиора - нижняя и верхняя
                                    .select('.lineHall')
                                    .transition()
                                    .duration(duration)
                                    .attr("d", d3.line()
                                        .x(function(d,i) { addToArea(x(d[xMetric]*secondTransf),i,'x',metricsName[j]); return x(d[xMetric]*secondTransf) }) // приходиться пересчитывать массив с точками для коридора снова
                                        .y(function(d,i) { addToArea(y(d[metricsName[j]]),i,'y',metricsName[j]); return y(d[metricsName[j]]) })
                                    )
                            }
                            
                        }
                        

                    }
        
                    
         }, 
         setClick: function(point, action) {
             
              let tockens = this.$store.getters.getTockens(this.idDash);
              let tocken = {};
              
              let setTocken = (value) => {
                  this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: value, store: this.$store });

                //   let searches = this.$store.getters.getSearches(this.idDash);
                //   let response = {};

                //     searches.forEach( async item => {
                //         if (item.original_spl.indexOf(`$${tocken.name}`) != -1  ) {  // если в тексте запроса есть наш токен

                //                 response = await this.$store.getters.getDataApi({search: item, idDash: this.idDash});
                //                 if ( response.status == 200) {
                //                         let responseDB = this.$store.getters.putIntoDB(response.result, item.sid, this.idDash);
                //                         responseDB
                //                             .then(
                //                                 result => {
                //                                 let refresh =  this.$store.getters.refreshElements(this.idDash, item.sid, );
                //                                 },
                //                             );
                //                     }
                //             }
                //     });

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
  
     @import '../../sass/dashLineChart.sass'
    
</style>