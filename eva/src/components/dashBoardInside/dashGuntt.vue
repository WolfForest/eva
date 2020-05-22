<template >
     <div class="dash-guntt" :data-change="colorChange">
        <div class="legend-block">
             <div class="legends-itself" v-for="i in legends.length" :key="i">
                 <div class="circle" :style={backgroundColor:colors[i-1]}></div>
                 <div class="text">{{legends[i-1]}}</div>
             </div>
        </div>
        <div class="guntt-block"></div>
        <div class="tooltipGuntt" :style="{backgroundColor:colorFrom.backElement, border: `1px solid ${colorFrom.text}`}" ref ="tooltip"></div>
        <div class="errormsg" v-show="noMsg">{{msgText}}</div>
    </div> 
</template>


<script>

import * as d3 from "d3"

export default {
    props: {  // переменные полученные от родителя
        idFrom: null,  // id элемнета (table, graph-2)
        idDashFrom: null, // id дашборда 
        dataRestFrom: null, // данные полученые после выполнения запроса
        colorFrom: null,  // цветовые переменные
        widthFrom: null, // ширина родительского компонента
        heightFrom: null, // высота родительского компонента
        timeFormatFrom: null, // настройки родительского компонента
    },
    data () {
        return {
            actions: [
                   {name:'click',
                   capture: []
                   },
                ],
            msgText: 'Нет данных для отображения',
            noMsg: true,
            // chartData: [
            //     ['id','phase','tooltip', 'start_date', 'end_date'],
            //     ['Насос 1', 'first','hello', new Date(2014, 1, 22), new Date(2014, 4, 20)],
            //     ['Насос 1', 'second','hello', new Date(2014, 4, 30), new Date(2014, 6, 30)],
            //     ['Насос 1', 'third','hello', new Date(2014, 7, 1), new Date(2015, 6, 10)],
            //     ['Насос 2', 'first','hello', new Date(2014, 5, 3), new Date(2014, 8, 10)],
            //     ['Насос 2', 'second','hello', new Date(2014, 8, 20), new Date(2015, 6, 1)],
            //     ['Насос 3', 'unique','hello', new Date(2014, 4, 20), new Date(2015, 3, 1)]
            // ],
            // chartOptions: {
            //     width: null,
            //     height: null,
            //     colors: null,
            // },
            colors: ['teal','#FF6D70','#660099','#3366FF'],
            legends: [],
            firstTime: true // определяем первый ли раз зашли на страницу, ничего лучше не придумал
        } 
    },
     computed: {  // осоновные параметры, которые чатсо меняются и которы следует отслеживать
         id: function() { 
               return this.idFrom
        },
        idDash: function() { 
               return this.idDashFrom
        },
        colorChange: function() {
            if (!this.firstTime) {
                let dataRest = this.dataRestFrom;
                if(dataRest.length > 0) {
                    if (dataRest[0].start_date && dataRest[0].end_date) {

                        this.prepareChart(dataRest);
                        
                    } else {
                        this.msgText = 'Данные не подходят для построения диаграммы гантта',
                        this.noMsg = true;
                    } 
                } else {
                        this.msgText = 'Нет данных для отображения',
                        this.noMsg = true;
                } 
                
            } else {
                this.firstTime = false;
            }
            
            return this.colorFrom.change
        }
     }, 
     watch: {
        dataRestFrom: function(dataRest) {
            
             if(dataRest.length > 0) {
                 if (dataRest[0].start_date && dataRest[0].end_date) {

                    this.prepareChart(dataRest);
                    
                    
                } else {
                    this.msgText = 'Данные не подходят для построения диаграммы гантта',
                    this.noMsg = true;
                } 
             }else {
                    this.msgText = 'Нет данных  для отображения',
                    this.noMsg = true;
                } 
        },
        timeFormatFrom: function(timeFormat) {
             let dataRest = this.dataRestFrom;
             if(dataRest.length > 0) {
                 if (dataRest[0].start_date && dataRest[0].end_date) {
                    this.prepareChart(dataRest);
                } else {
                    this.msgText = 'Данные не подходят для построения диаграммы гантта',
                    this.noMsg = true;
                } 
            }else {
                    this.msgText = 'Нет данных для отображения',
                    this.noMsg = true;
            } 
        },
        widthFrom: function(width) {
            let dataRest = this.dataRestFrom;
             if(dataRest.length > 0) {
                 if (dataRest[0].start_date && dataRest[0].end_date) {
                    this.prepareChart(dataRest);
                } 
            }
        },
         heightFrom: function(width) {
            let dataRest = this.dataRestFrom;
             if(dataRest.length > 0) {
                 if (dataRest[0].start_date && dataRest[0].end_date) {
                    this.prepareChart(dataRest);
                } 
            }
        }
     }, 
     methods: {
         prepareChart: function(dataRest) {
                let sizeChart = {'width':0,'height':0};  // получаем размеры от родителя
                sizeChart['width'] = this.widthFrom;
                sizeChart['height'] = this.heightFrom;
                this.actions[0].capture = Object.keys(dataRest[0]);
                this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
                this.createChart(sizeChart,this,dataRest);
         },
         createChart: function(sizeChart,that,dataRest) {

                let otstupBot = 30;
                if (screen.width <= 1600) {
                    otstupBot = 10;
                }


                let margin = {top: 20, right: 20, bottom: otstupBot, left: 20},
                    width = sizeChart.width - margin.left - margin.right,
                    height = sizeChart.height - margin.top - margin.bottom,
                    otstupLeft = 70,
                    otstupRight = 80;


                if (screen.width > 1920) {
                    otstupLeft = 90;
                }

                let data = [];
                dataRest.forEach( (item) => {
                    data.push({...{},...item})
                })
               // colors = ['teal','#FF6D70','#660099','#3366FF'];
               // console.log(d3);
           

                let graphics = d3.select(this.$el.querySelector('.guntt-block')).selectAll('svg').nodes(); // получаем область в которой будем рисовтаь график 
                

                if(graphics.length != 0){  // если график уже есть
                     graphics[0].remove();;  // удаляем его
                }

                let svg = d3.select(this.$el.querySelector('.guntt-block'))
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("class", "guntt-svg");


              //  console.log(data[0].start_date)
                // удалить потом
               
                data.forEach( (item,i) => {
                    let newDate = new Date(item.start_date*1000);
                    data[i].start_date = `${newDate.getFullYear()}-${checkZero(newDate.getMonth()+1)}-${checkZero(newDate.getDate())} ${checkZero(newDate.getHours())}:${checkZero(newDate.getMinutes())}:${checkZero(newDate.getSeconds())}`;
                    newDate = new Date(item.end_date*1000);
                    data[i].end_date = `${newDate.getFullYear()}-${checkZero(newDate.getMonth()+1)}-${checkZero(newDate.getDate())} ${checkZero(newDate.getHours())}:${checkZero(newDate.getMinutes())}:${checkZero(newDate.getSeconds())}`;

                //    let res = item.start_date.split(' ');
                //     let date = res[0].split('-');
                //     date = date.reverse().join('-');
                //     res = date+' '+res[1];
                //     data[i].start_date = res;
                //     res = item.end_date.split(' ');
                //     date = res[0].split('-'); 
                //     date = date.reverse().join('-');
                //     res = date+' '+res[1];
                //     data[i].end_date = res;
                })

                // console.log(data)
                
                
                
                let dateFormat = `%Y-%m-%d %H:%M:%S`;
                if (that.timeFormatFrom != '') {
                    dateFormat = that.timeFormatFrom;
                }
                
               

                let x = d3.scaleTime()
                        .domain([d3.min(data, function(d) {return new Date(d.start_date)}),
                                 d3.max(data, function(d) {return  new Date(d.end_date)})])
                        .range([otstupLeft,width-otstupRight]);

          


                // рассчитываем набор фаз (состояний)
                let phases = [];
                let ids = [];
                data.forEach( ph => {
                    if (ph.phase){
                        if (!phases.includes(ph.phase)) {
                            phases.push(ph.phase)
                        }
                    }
                    if (!ids.includes(ph.id)) {
                            ids.push(ph.id)
                    }
                    
                })
                if (phases.length > 0) {
                    this.legends = phases;
                }

                let otstupBottom =50;

                if (screen.width > 1920) {
                    otstupBottom =60;
                }

                let barHeight = Math.round((height-otstupBottom)/ids.length);
                      
                        let ticks = x.ticks();
                                        
                        if (screen.width < 1920) {
                            ticks = x.ticks().filter( (item,i) => {
                                if (i == 0, i == x.ticks().length-1, i%2 == 0) {
                                    return item
                                }
                            })
                        } 

                    let otstupX = 0;

                    if (screen.width < 1400) {
                        otstupX = -10;
                    }

                    let many = 2;
                 // добавляем ось X     
                    let xAxis = svg.append("g")
                        .attr("transform", `translate(0,${height-otstupBottom})`)
                        .call(d3.axisBottom(x)
                                   .tickFormat(d3.timeFormat(dateFormat))
                                   .tickValues(
                                         x.ticks().filter( (item,i) => {
                                            if (x.ticks().length> 9) {
                                                if (screen.width <= 1600) {
                                                    many = 3;
                                                }
                                                if (i%many == 0) {
                                                    return item
                                                }
                                            } else {
                                                return item
                                            }
                                        })
                                    )
                                     
                                
                        )
                        .call(wrap)

                    let otstupY = 10;

                    if (screen.width > 1920) {
                        otstupY = 15;
                    }

                     xAxis 
                        .selectAll("line")
                            .attr("y2", `-${height}`)
                            .attr("opacity", "0.3");
                    xAxis 
                        .selectAll("text")
                            .attr('class','text-x')
                           // .attr("transform", `translate(${otstupX},${otstupY}) rotate(-30)`)
                            .attr("transform", `translate(${otstupX},${otstupY})`)
                            .style("color",this.colorFrom.text)
                            .style("text-anchor", "center");

                
              

                //горизонатьные значения (id)
                let subjects = svg.append("g")
                                .selectAll("rect")
                                .data(ids)
                                .enter()
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", function(d, i){
                                    return i*barHeight;
                                })
                                .attr("width", function(d){
                                    return width;
                                })
                                .attr("height", barHeight)
                                .attr("fill",'none')
                                .attr("stroke", "none")
                                .attr("opacity", 0.2);

                // сами строки данных относителньо времени
                let bars =svg.append('g')
                    .selectAll("rect")
                    .data(data)
                    .enter();
                
                let lines = bars.append("rect")
                                    .attr("rx", 3)
                                    .attr("ry", 3)
                                    .attr("x", function(d){
                                    return x(Date.parse(d.start_date));
                                    })
                                    .attr("y", function(d, i){
                                            let j = -1;
                                            ids.forEach( (item,i) => {
                                                if (item == d.id) {
                                                    j = i;
                                                }
                                            })
                                            return j*barHeight
                                    })
                                    .attr("width", function(d){
                                        return (x(Date.parse(d.end_date))-x(Date.parse(d.start_date)));
                                    })
                                    .attr("height", barHeight)
                                    .attr("stroke", "none")
                                    .style("cursor",'pointer')
                                    .attr("fill", (d) => {
                                        let j = -1;
                                        phases.forEach( (item,i) => {
                                            if (item == d.phase) {
                                                j = i;
                                            }
                                        })
                                        return this.colors[j]
                                    });
                                    

                // Tooltip

                let tooltipBlock = this.$refs.tooltip;

               

                lines.on('mouseover', function(event) {

                                let tooltip = '';

                                if (data[0].description) { 
                                    tooltip = transformDescription(event.description)
                                } else {
                                    Object.keys(event).forEach( key => {
                                        tooltip += `<p class="row-toolrip"><span>${key}</span>: ${event[key]}</p>`;
                                    })
                                }

                                
                                //let x = (this.x.animVal.value + this.width.animVal.value/2)  + "px";
                               // let y = this.y.animVal.value -10 + "px";
                                moveTooltip();

                                 tooltipBlock.innerHTML = tooltip;
                                 tooltipBlock.style.opacity = '0.9';
                                 tooltipBlock.style.visibility = 'visible';
                                // tooltipBlock.style.display = "block";
                            }).on('mousemove', function() {
                                moveTooltip();

                            }).on('mouseout', function() {
                                tooltipBlock.style.opacity = '0';
                                tooltipBlock.style.visibility = 'hidden';
                                // var output = document.getElementById("tag");
                                // output.style.display = "none";

                            }).on('click', function (d)  { 
                                return that.setClick(d)
                            });

                
                        
                // let otsupText = 0;

                // if (screen.width < 1920){
                //     otsupText = 5;
                // }

                let texts =  bars.append("text")
                                .text(function(d){
                                    if (d.phase) {
                                        if((x(Date.parse(d.end_date))-x(Date.parse(d.start_date))) > d.phase.length*8) {
                                            return d.phase;
                                        }
                                    }
                                    return '';
                                })
                                .attr("x", function(d){
                                    return ( x(Date.parse(d.start_date))+(x(Date.parse(d.end_date))-x(Date.parse(d.start_date)))/2 );
                                    })
                                .attr("y", function(d, i){
                                    let j = -1;
                                        ids.forEach( (item,i) => {
                                            if (item == d.id) {
                                                j = i;
                                            }
                                        })
                                    return j*barHeight+barHeight/2+3
                                })
                                .attr('class','text-bar')
                                .attr("font-size", 11)
                                .attr("text-anchor", "middle")
                                .style("cursor",'pointer')
                                .attr("fill", "#fff");

                texts.on('mouseover', function(event) {

                                 tooltipBlock.style.opacity = '0.9';
                                 tooltipBlock.style.visibility = 'visible';
                            }).on('mousemove', function() {
                                moveTooltip();
                            }).on('mouseout', function() {
                                 tooltipBlock.style.opacity = '0';
                                 tooltipBlock.style.visibility = 'hidden';

                            }).on('click', function (d)  {
                                return that.setClick(d)
                            });;

            


            // подписи слева

            let currentPos = 0;

            let idsCaption = svg.append("g")
                .selectAll("text")
                .data(ids)
                .enter();



            idsCaption.append("text")
                .text(function(d){
                    return checkCaption(d);
                })
                .attr("x", 10)
                .attr("y", function(d, i){
                    if (i == 0){
                        currentPos = barHeight/2+2;
                    } else{
                         currentPos += barHeight+2;
                    }
                    return currentPos
                })
                .attr('class','ids-caption')
                .attr("font-size", 11)
                .attr("text-anchor", "start")
                .style("opacity","0.8")
                .attr("fill", this.colorFrom.text);

            

            currentPos = 0
            
            idsCaption.append("line")
                    .attr("x1", 0)
                    .attr("x2", width-otstupRight)
                    .attr("y1",function(d, i){
                        let curPos = 0;
                        if (i != ids.length-1) {
                            curPos = currentPos + barHeight;
                            currentPos += barHeight;
                        } else {
                            curPos = currentPos + barHeight;
                            currentPos = 0;
                        }
                        return  curPos;
                    })
                    .attr("y2", function(d, i){
                            let curPos = 0;
                            curPos = currentPos + barHeight;
                            currentPos += barHeight;
                        return  curPos;
                    })
                    .style("stroke", this.colorFrom.text) 
                    .attr("opacity", "0.3");

            
                
            // линия отделяющяя подписи (ids) от блока данных

            svg.append("g") 
                .append("line")
                    .attr("x1", otstupLeft)
                    .attr("x2", otstupLeft)
                    .attr("y1",0)
                    .attr("y2", height-50)
                    .style("stroke", "black") 
                    .attr("opacity", "0.3");

            // линия отделяющяя блоки данных от легенды

            svg.append("g") 
                .append("line")
                    .attr("x1", width-otstupRight)
                    .attr("x2", width-otstupRight)
                    .attr("y1",0)
                    .attr("y2", height-50)
                    .style("stroke", "black") 
                    .attr("opacity", "0.3");

            // легенда


            function moveTooltip() {
                let x = d3.event.layerX + 10;
                let y = d3.event.layerY -10 - tooltipBlock.offsetHeight;
                if (y < 0) {
                    y = 0;
                    x += 5;
                }
                if(x-20+tooltipBlock.offsetWidth>width-otstupRight) {
                    x = d3.event.layerX - 10 - tooltipBlock.offsetWidth;
                }
            
                tooltipBlock.style.top = y+'px';
                tooltipBlock.style.left = x+'px';
            }

            function transformDescription(text) {
                let rows = text.split('\\n');
                rows = rows.map( item => {
                    return `<p class="row-toolrip">${item}</p>`
                })
                //rows = '<div class = "tooltip-guntt">' + rows.join('') + '</div>';
                return rows.join('')  
            }

            function checkCaption(name) {
                if (name.length > 6) {  // если там больше 10 символов
                         name = name.substring(0,6) + '...'; // обрезаем и добовляем троеточие
                     }
                return name 
            }

            function checkZero(item) {
                if (item < 10) {  // если там больше 10 символов
                        item = `0${item}`;
                     }
                return item 
            }

            function wrap(text) {
                    text.each(function() {
                        let text = d3.select(this);
                        let row = [];
                        text.node().querySelectorAll('text').forEach( item => {
                            row = item.innerHTML.split(' ').filter( rowItem => {
                                if  (rowItem != '') {
                                    return rowItem
                                }
                                });
                            if (row[1]) {
                                row[0] = `<tspan x=0 y=10>${row[0]}</tspan>`;
                                row[1] = `<tspan x=0 y=30>${row[1]}</tspan>`;
                                item.innerHTML = row.join('');
                            }
                        })




                    // let wordsTXT = text.text();
                    // let wordsHTML = text.html();
                    // let oldWords = wordsTXT.split(' ');
                    // oldWords.splice(oldWords.length-1,1);
                    // let newWords = oldWords.map( (item,i) => {
                    //      if (i % 2 == 0) {
                    //          return `<tspan x=0 y=10>${item}</tspan>`
                    //      } else {
                    //          return `<tspan x=0 y=30>${item}</tspan>`
                    //      }
                    // })
                    // oldWords = unique(oldWords);
                    // newWords = unique(newWords);
                    // oldWords.forEach( (item,i) => {
                    //         let regexp = RegExp(item, "g");
                    //         wordsHTML = wordsHTML.replace(regexp,newWords[i])
                    // })
                    // text.html(wordsHTML)
                     
                    })

                    // function unique(arr) {
                    //     let unique = [];
                    //     arr.forEach( item => {
                    //         if (!unique.includes(item)) {
                    //             unique.push(item);
                    //         }
                    //     })
                    //     return unique;
                    // }
            }


         },
      
        setClick: function(item) {

             
               let tockens = this.$store.getters.getTockens(this.idDash);
               let tocken = {};
     
                Object.keys(tockens).forEach( i =>{
                    tocken = {
                        name: tockens[i].name,
                        action: tockens[i].action,
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == 'click') {
                        this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: item[tockens[i].capture], store: this.$store });
                    } 
                })

         },
         
        // transformDate: function(string) {
        //     let result;
        //     result = string.split(' ');
        //     let date = result[0].split('-');
        //     let time = result[1].split(':');
        //     return new Date(date[2],date[1]-1,date[0],time[0],time[1],time[2])
        // },
    },
    mounted() {
    } 
}


</script>

<style lang="sass" > 

    @import '../../sass/dashGuntt.sass';

</style>