<template >
    <div class="dash-barchart-block" >
        <div class="dash-barchart" >
           <p v-if="nodata" class="nodata"> {{nodataText}} </p>
        </div>
    </div>
</template>


<script>

import * as d3 from "d3";


export default { 
    props: {  // переменные полученные от родителя
        idFrom: null,  // id элемнета (table, graph-2)
        idDashFrom: null, // id дашборда 
        dataRestFrom: null, // данные полученые после выполнения запроса
        colorFrom: null,  // цветовые переменные
        widthFrom: null,
        heightFrom: null,
    },
    data () {
        return {
            // actions: [
            //        {name:'click',
            //        capture: []
            //        },
            //        {name:'mouseover',
            //        capture:[]
            //        },
            //     ],
            nodata: true,
            nodataText: 'Ожидается поле _time и value',
            bar: [
                {
                    '_time': 'spider-man',
                    'value': 300
                },
                {
                    '_time': 'batman',
                    'value': 400
                },
                {
                    '_time': 'supermen',
                    'value': 500
                },
                {
                    '_time': 'doomsday',
                    'value': 600
                },
            ],
            bar2: [
                {
                    'group': 'mans',
                    'spider-man': 100,
                    'batman': 200,
                    'supermen': 300,
                },
                {
                    'group': 'womans',
                    'spider-man': 150,
                    'batman': 150,
                    'supermen': 300,
                },
                {
                    'group': 'heroes',
                    'spider-man': 450,
                    'batman': 75,
                    'supermen': 75,
                },
            ],
            stacked: false,
        } 
    },
     computed: {  // осоновные параметры, которые чатсо меняются и которы следует отслеживать
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
        width: function() {
            return this.widthFrom
        },
        height: function() {
            return this.heightFrom
        },
     },  
     watch: {
        dataRestFrom: function() {
            this.createBarChart();
        }
    },
     methods: {
        createBarChart: function() {
            let otstupBottom = 55;
             if (screen.width <= 1600) {
                 otstupBottom = 30;
             }
            let sizeLine = {'width':0,'height':0};  // получаем размеры от родителя
                sizeLine['width'] = this.width;
                sizeLine['height'] = this.height-otstupBottom;

            d3.select(this.$el.querySelector('.dash-barchart')).selectAll('svg').remove();
            if (sizeLine.width != 0 && sizeLine.height != 0) {  // если размеры получены выше нуля
                    if (this.dataRest.length > 0) {  // если данные от родителя тоже пришли
                                if(this.dataRest.error) {  // сомтрим если с ошибкой
                                    this.nodataText = this.dataRest.error; // то выводим сообщение о ошибке
                                    this.nodata = true;
                                } else {  // если нет

                                    let data = this.dataRest;
                                    if (data[0]['_time'] && data[0]['value']) {

                                        this.nodata = false;
                                      

                                        let max = 0;

                                        let otstupTop = 20;
                                        if (screen.width <= 1600) {
                                            otstupTop = 10;
                                        }

                                        // устанавливаем размер и отступы графика 
                                        let margin = {top: otstupTop, right: 20, bottom: 40, left: 30},
                                            width = sizeLine.width - margin.left - margin.right-40,
                                            height = sizeLine.height - margin.top - margin.bottom;

                                        // добовляем svg элемент на страницу
                                        let svg = d3.select(this.$el.querySelector('.dash-barchart'))
                                            .append("svg")
                                                .attr("width", width + margin.left + margin.right)
                                                .attr("height", height + margin.top + margin.bottom)
                                            .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                        if (!this.stacked) {
                                                

                                                max = data.reduce(function(prev, next) {
                                                        if (Math.round(next.value) > prev)  {
                                                            return Math.round(next.value)
                                                        } 
                                                        return prev
                                                    }, 0);

                                                // добавляем ось X 
                                                 let x = d3.scaleBand()
                                                        .range([ 0, width ])
                                                        .domain(data.map(function(d) {return d['_time']; }))
                                                        .padding(0.2);
                                                
                                                let ticks = data;

                                                if (data.length > 10) {
                                                     ticks = data.filter( (item,i) => {
                                                        if (i == 0 || i == data.length-1 || (i % (Math.round(data.length/9)) == 0)) {
                                                            return item
                                                        }
                                                    });
                                                }


                                                svg.append("g")
                                                    .attr("transform", "translate(0," + height + ")")
                                                    .call(d3.axisBottom(x).tickValues(ticks.map(function(d) {return d['_time']; })))
                                                    .selectAll("text")
                                                    .attr("transform", "translate(0,10) rotate(-20)")
                                                    .style("text-anchor", "center");
                                                        //.attr("transform", "translate(-10,0)rotate(-45)")
                                                        // .style("text-anchor", "end");

                                                // добавляем ось Y
                                                let y = d3.scaleLinear()
                                                    .domain([0, max])
                                                    .range([ height, 0]);
                                                svg.append("g")
                                                    .call(d3.axisLeft(y));

                                                // добовляем сами столбики
                                                svg.selectAll("bar")
                                                .data(data)
                                                .enter()
                                                .append("rect")
                                                    .attr("x", function(d) { return x(d['_time']); })
                                                    .attr("y", function(d) { return y(d.value); })
                                                    .attr("width", x.bandwidth())
                                                    .attr("height", function(d) { return height - y(d.value); })
                                                    .attr("fill", this.color.controls);
                                        } else {


                                            data = this.bar2;
                                            max = 0;

                                            // получаем все подгруппы
                                        let subgroups = Object.keys(data[0]).filter( item => {
                                                if (item != 'group') {
                                                    max += data[0][item];
                                                    return item
                                                }
                                                
                                            }); 

                                        let colorfull = [this.color.controls,this.color.controlsActive,this.color.text];

                                            // затем сами группы
                                        let groups = d3.map(data, function(d){return(d.group)}).keys();


                                        // добавляем ось X 
                                        let x = d3.scaleBand()
                                            .domain(groups)
                                            .range([0, width])
                                            .padding([0.2])
                                        svg.append("g")
                                            .attr("transform", "translate(0," + height + ")")
                                            .call(d3.axisBottom(x).tickSizeOuter(0));

                                        // добавляем ось Y
                                        let y = d3.scaleLinear()
                                            .domain([0, max])
                                            .range([ height, 0 ]);
                                        svg.append("g")
                                            .call(d3.axisLeft(y));

                                        // определяем цвета столбиков
                                        let color = d3.scaleOrdinal()
                                            .domain(subgroups)
                                            .range(colorfull)


                                        // стыкуем подгруппы?
                                        let stackedData = d3.stack()
                                            .keys(subgroups)
                                            (data)
                                        

                                        let legendData = stackedData.map( item=> {
                                            let name = '';
                                            if (item.key.length > 10) {
                                                name = item.key.slice(0,10) + '...';
                                            } else {
                                                name = item.key;
                                            }
                                            return {color: colorfull[item.index], name: name}
                                        });


                                        let legend =  svg.append('g')  // доволяем легенду
                                                    .attr('class', 'legend')
                                                    .attr('transform', 'translate(20,-30)'); 
                                        
                                        let otstup = 0;
                                                    
                                            legendData.forEach( leg => {

                                                legend.append("circle")  // кружок легенды
                                                    .style("fill", leg.color)
                                                    .style('stroke', leg.color)
                                                    .attr('r', 5)
                                                    .attr('transform', `translate(${otstup},-4)`);


                                                legend.append('text')   // текст легенды (название метрики)
                                                        .attr('transform', `translate(${otstup + 12},0)`)
                                                        //.attr('data-name', legendData[i].name)  
                                                        .style('fill', this.color.text)
                                                        .text(leg.name);  // здесь вызываем функцию которая проверяет не слишком ли длинное название и сокращает его

                                                otstup += 100;
                                            })




                                        // добовляем сами столбики
                                        svg.append("g")
                                            .selectAll("g")
                                            // Enter in the stack data = loop key per key = group per group
                                            .data(stackedData)
                                            .enter().append("g")
                                            .attr("fill", function(d) { return color(d.key); })
                                            .selectAll("rect")
                                            // enter a second time = loop subgroup per subgroup to add all rectangles
                                            .data(function(d) { return d; })
                                            .enter().append("rect")
                                                .attr("x", function(d) { return x(d.data.group); })
                                                .attr("y", function(d) { return y(d[1]); })
                                                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                                                .attr("width",x.bandwidth())



                                        }
                                    } else {
                                          this.nodataText = 'Ожидается поле _time и value'; // то выводим сообщение о ошибке
                                          this.nodata = true;
                                    }
                                }
                    }
            }
        
        }

                 
    },
    mounted() {
       // setTimeout( () => {
        //    this.stacked = false;
       //     this.createBarChart();
       // },500)
        
        //  В первый раз раскомментить чтобы создать события для элемнета, а затем лучше закоментить чтобы каждый раз не обращаться к store
      //  this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
    } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashBarChart.sass'

   
</style>