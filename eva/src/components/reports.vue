<template >
    <v-app class="reports-app-main" :style="{background: color.back}">
       <header-top @setUsername="setUsername($event)"></header-top>
       <v-content>
           <v-container  class="main-container container-report" >
               <div class="report-block" ref="report" >
                     <v-card   class="static-block" :style="{background: color.backElement, color: color.text}">
                        <v-card-title  class="static-title">
                            <p>Статистика</p>
                            <div :style="{background:color.controls}" class="static-divider"></div>
                        </v-card-title>
                        <v-card-text class="static-overflow-block" :style="{color:color.text}"  >
                             <div class="static-row" v-for="item in rows" :key="item.id" @click="openStatistic(item)" v-html="item.text"></div>
                         </v-card-text>
                     </v-card>
                     <v-card class="search-block" :style="{background: color.backElement, color: color.text}">
                        <v-card-text class="search-card-block" :style="{background: color.backElement, color: color.text}">
                            <div  class="loading-divider" :class="{loading:loading}" ><div class="loading-bar " ></div></div>
                            <v-textarea ref="search" solo spellcheck="false" flat no-resize hide-details  :rows="rowsCount"  :style="{background: color.backElement, color: color.text}"  placeholder="Введите запрос" v-model="search.original_spl"></v-textarea>
                             <v-tooltip bottom :color="color.controlsActive" >
                                <template v-slot:activator="{ on }" >
                                   <v-btn
                                        :color="color.controls"
                                        fab
                                        dark 
                                        small
                                        absolute
                                        class="play-btn"
                                        top
                                        right
                                        v-on="on"
                                        @click="launchSearch"
                                    >
                                    <v-icon>{{play}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>Запустить</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive"  >
                                <template v-slot:activator="{ on }">
                                   <v-btn
                                        :color="color.controls"
                                        fab
                                        dark
                                        small
                                        absolute
                                        top
                                        right
                                        v-on="on"
                                        @click="openSettings"
                                    >
                                    <v-icon>{{gear}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>Настройки</span>
                            </v-tooltip>
                        </v-card-text>
                    </v-card>
                    <v-card class="static-vis" ref="vis"  :style="{background: color.backElement, color: color.text}">
                        <v-card-text :style="{color: color.text}">
                              <v-card-title class="title-vis">
                                  <v-tooltip bottom :color="color.controlsActive" v-for="i in elements" :key="aboutElem[i].key" @click="changeTab(i)" >
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="title-icon" :color="aboutElem[i].color"  v-on="on" @click="changeTab(i)">{{aboutElem[i].icon}}</v-icon>
                                        </template>
                                        <span>{{aboutElem[i].tooltip}}</span>
                                    </v-tooltip>
                                    <div class="divider-tab" :style="{background: color.border}"></div>
                              </v-card-title>
                             <v-card-text v-for="i in elements" :key="i" v-show="aboutElem[i].show" :is="`dash-${i}`"   :idFrom="i" :colorFrom="color"  idDashFrom="reports" :widthFrom="size.width" :heightFrom="size.height" :timeFormatFrom="''" :sizeTileFrom="''" :searchRep="true" :tooltipFrom="tooltipSvg"    :dataRestFrom="data"    > </v-card-text>
                            <v-tooltip bottom :color="color.controlsActive">
                                <template v-slot:activator="{ on }">
                                        <v-icon class="title-icon merge" :color="unitedData.color" v-show="unitedShow" v-on="on"  @click="changeUnited">{{merge}}</v-icon>
                                </template>
                                <span>Режим отображения</span>
                            </v-tooltip>
                            
                        </v-card-text>
                     </v-card>
                    <v-card class="statistic-block" :style={backgroundColor:color.controlsActive} :class="{showStatistic:showStatistic}">
                        <v-card-text >
                            <v-data-table 
                                :style={backgroundColor:color.controlsActive}
                                disable-pagination
                                hide-default-footer
                                :headers="[{ text: 'value', value: 'value' },{ text: 'count', value: 'count' },{ text: '%', value: '%' }]"
                                :items="statistic"
                            ></v-data-table>
                        </v-card-text>
                    </v-card>
               </div>
           </v-container> 
        </v-content>
        <footer-bottom></footer-bottom>
        <modal-report @cancelModal="cancelModal" @setSearch="setSearch($event)" :colorFrom="color" :modalFrom="modal" :searchFrom="search"></modal-report>
    </v-app>
</template>


<script>

import { mdiPlay, mdiSettings, mdiMerge } from '@mdi/js'
import  settings  from '../js/componentsSettings.js';

export default {

    data () {
        return {
            search: {
                parametrs:{}
            },
            play: mdiPlay,
            gear: mdiSettings,
            merge: mdiMerge,
            modal: false,
            loading: false,
            rows: [],
            data: {},
            statistic: [],
            showStatistic: false,
            statisticKey: null,
            curTab: null,
            size: {
                width: 0,
                height: 0,
            },
            aboutElem: {},
            rowsCount: 9,
            shema: {},
            unitedShow: false,
            unitedData: {
                color: '',
                united: false
            },
             color: { 
                back: '#060606',
                backElement: '#191919',
                text: '#DADADA',
                controls: '#6e96c5',
                controlsSystem: '#004799',
                controlsActive: '#41C4FF',
                controlsInsideDash: '#DADADA',
                panel: '#0D0D0D',
                border: '#DADADA',
            },
            tooltipSvg: {
                'texts': [],
                'links': [],
                'buttons': []
            }
        } 
    },
    asyncComputed: {
       async static_rows() {
             if (this.shouldGet) {
                // console.log(this.search.sid)
                 this.data =  await this.getData(`reports-${this.search.sid}`);
                 let statistic = '';
                 this.rows = [];
                 if (this.data.data.length != 0) {
                    this.shema = this.data.shema;
                    this.data = this.data.data;
                    let text = '';
                    Object.keys(this.shema).forEach( (item,i) => {
                        statistic = this.createStatistic(item);
                        text = `${item}&nbsp;&nbsp;&nbsp;[${this.shema[item]}]`;
                        this.rows.push({'id':i,'text': text,'static':statistic});
                    })
                 }
                 
                this.$store.commit('setShould', { idDash: 'reports',  id: 'table', status: false}); 
                
                return true
            } 
            
        }, 
    },
     computed: { 
        shouldGet:  function() {  // понимаем нужно ли запрашивтаь данные с реста
            return this.$store.getters.getShouldGet({id:'table', idDash: 'reports'})
        },
        // color: function() {
        //     return this.$store.getters.getColor
        // },
        elements: function() {
           
            this.$store.getters.getReportElement.forEach( (item,i) => {
                this.$set(this.aboutElem,item,{});
                
                if (i == 0) {
                    this.$set(this.aboutElem[item],'show',true);
                    this.$set(this.aboutElem[item],'color',this.color.controls);
                } else {
                    this.$set(this.aboutElem[item],'show',false);
                    this.$set(this.aboutElem[item],'color',this.color.text);
                }

                this.$set(this.aboutElem[item],'tooltip',settings.reports[item].tooltip);
                this.$set(this.aboutElem[item],'icon',settings.reports[item].icon);

                // switch (item){
                //     case 'table':
                //         this.$set(this.aboutElem[item],'tooltip','Таблица');
                //         this.$set(this.aboutElem[item],'icon',this.table);
                //     break

                //     case 'lineChart':
                //         this.$set(this.aboutElem[item],'tooltip','Линейный график');
                //         this.$set(this.aboutElem[item],'icon',this.lineChart);
                //     break

                //     case 'multiLine':
                //         this.$set(this.aboutElem[item],'tooltip','Мультилинейный график');
                //         this.$set(this.aboutElem[item],'icon',this.multiLine);
                //     break

                //     case 'barchart':
                //         this.$set(this.aboutElem[item],'tooltip','Столбцовая диаграмма');
                //         this.$set(this.aboutElem[item],'icon',this.barchart);
                //     break

                //     case 'graph':
                //         this.$set(this.aboutElem[item],'tooltip','Граф');
                //         this.$set(this.aboutElem[item],'icon',this.graph);
                //     break

                //     case 'guntt':
                //         this.$set(this.aboutElem[item],'tooltip','Диаграмма Гантта');
                //         this.$set(this.aboutElem[item],'icon',this.guntt);
                //     break

                //     case 'tile':
                //         this.$set(this.aboutElem[item],'tooltip','Плитка');
                //         this.$set(this.aboutElem[item],'icon',this.tile);
                //     break
                // }
                 this.$set(this.aboutElem[item],'key',i);
            })
            return this.$store.getters.getReportElement
        },
     },  
     methods: {
         launchSearch: async function() {

               
                this.search.sid = this.hashCode(this.search.original_spl);
                
                this.$store.auth.getters.putLog(`Запущен запрос  ${this.search.sid}`);

                this.loading = true;
                let response = await this.$store.getters.getDataApi({search: this.search, idDash: 'reports'});
                // вызывая метод в хранилище  

                if (!response.data || response.data.length == 0) {  // если что-то пошло не так 
                    this.loading = false;
                    this.$store.commit('setErrorLogs',true);
                    this.data = [];
                    this.rows = [];
                } else {  // если все нормально
                    
                      let responseDB = this.$store.getters.putIntoDB(response, this.search.sid, 'reports');
                      responseDB
                        .then(
                            result => {
                               let refresh =  this.$store.getters.refreshElements('reports', this.search.sid, );
                               this.loading = false;
                               this.$store.commit('setReportSearch',this.search);
                            },
                        );
                    
                }
         },
         setUsername: function(event) {
            this.search.parametrs.username = event;
         },
         hashCode: function(spl) {
            return spl.split('').reduce((prevHash, currVal) =>
                (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
         },
          getData:  function(searсhID) {   // асинхронная функция для получения даных с реста
              
             let db = null;
             let result = null;

             let request = indexedDB.open("EVA",1);  


                request.onerror = function(event) {
                    console.log("error: ",event);
                };

                 request.onupgradeneeded = event => {
                            console.log('create');
                            db = event.target.result;
                            if (!db.objectStoreNames.contains('searches')) { // if there's no "books" store
                                db.createObjectStore('searches'); // create it
                            }

                                request.onsuccess = event => {
                                    db = request.result;
                                   // this.alreadyDB = request.result;
                                    console.log("successEvent: " + db);


                            };

                }


                let promise = new Promise((resolve, reject) => {


                        request.onsuccess =  event => {

                            db = request.result;
                            
                          //  console.log("success: " + db);


                            let transaction = db.transaction("searches"); // (1)

                            // получить хранилище объектов для работы с ним
                            let searches = transaction.objectStore("searches"); // (2)


                            let query = searches.get(String(searсhID)); // (3) return store.get('Ire Aderinokun');


                            query.onsuccess = event => { // (4)
                            if (query.result) {
                                
                                resolve(query.result);
                            } else {
                                resolve([]);
                            }
                        //    console.log("Сёрч получен", query.result);
                            };

                            query.onerror = function() {
                            console.log("Ошибка", query.error);
                            };
    

                        };    

                });

                return promise
         },
         openSettings: function() {
            this.modal = true;
         },
         cancelModal: function() {
             this.modal = false;
         },
         changeTab: function(elem) {
             if (elem == 'multiLine'){
                this.unitedShow = true;
             } else {
                this.unitedShow = false;
             }
             Object.keys(this.aboutElem).forEach( item => {
                 if (item != elem) {
                     this.$set(this.aboutElem[item],'show',false);
                     this.$set(this.aboutElem[item],'color',this.color.text);
                 } else {
                     this.$set(this.aboutElem[item],'show',true);
                     this.$set(this.aboutElem[item],'color',this.color.controls);
                 }
             })
         },
         changeUnited: function() {
             if (!this.unitedData.united) {
                 this.unitedData.united = true;
                 this.unitedData.color = this.color.controlsActive;
             } else {
                 this.unitedData.united = false;
                 this.unitedData.color = this.color.controls;
             }
             this.$store.commit('setOptions',  { idDash: 'reports', id: 'multiLine', options: {united: this.unitedData.united} });
         },
         createStatistic: function(key) {
            // if (typeof this.data[0][key] == 'number'){
                // let how_much = this.data.map( item => {
                //     return item[key]
                // });
                let how_much = {};
                let result = [];
                let length = this.data.length;
                this.data.forEach( item => {
                    if (how_much[item[key]]) {
                        how_much[item[key]]++;
                    } else {
                       how_much[item[key]] = 1 
                    }
                })
                Object.keys(how_much).forEach( item => {
                    
                    result.push(
                        {
                            'value': item,
                            'count': how_much[item],
                            '%' : Math.round((how_much[item]*100)/length)
                        }
                    );
                })
               
                return result
            // }
             

         },
         setSearch: function(search) {
             this.search = Object.assign({},search);
             this.modal = false;
         },
         openStatistic: function(statistic) {
             if (this.statisticKey == statistic.text) {
                this.showStatistic = !this.showStatistic;
             } else {
                this.showStatistic = true;
                this.statisticKey = statistic.text;
                this.statistic = statistic.static;
             } 
         },
         calcSize: function() {
             let size = this.$refs.vis.$el.getBoundingClientRect();
             this.size.width = Math.round(size.width) - 16;
             this.size.height = Math.round(size.height) - 66;
         },

    },
    mounted() {
        this.search = this.$store.getters.getReportSearch;
        if (this.search.original_spl != '') {
            this.$store.commit('setShould', { idDash: 'reports',  id: 'table', status: true});
        }
        this.calcSize();
        //| makeresults count=20
        // | streamstats count as id
        // | eval number = round(id/6)
        this.$refs.search.$el.addEventListener ("keypress", event =>{
            if (event.ctrlKey && event.keyCode == 13) {
                this.launchSearch();
            }
        });
        this.$refs.report.addEventListener('click', event => {
            if(!event.target.classList.contains('static-row')) {
                this.showStatistic = false;
            }
        })

        if (screen.width > 1920) {
            this.rowsCount = 14;
        } else if (screen.width <= 1440) {
            this.rowsCount = 6;
        }
        this.unitedData.color=  this.color.controls;

    } 
}


</script>

<style lang="sass" > 
  
   @import '../sass/reports.sass'
   
</style>