<template >  
        <div class="table-block" ref="tableBlock">
            <v-data-table
                    :headers="props.titles"
                    :items.sync="this.getDataStart"
                    :items-per-page="5"
                    class="dash-table"
                    :data-id="this.id"
                    v-model="props.input"
                    item-key ="none"
                    :height="height"
                    :ref="this.id"
                    fixed-header
                    @current-items="updatePage"
                    v-show="!props.nodata"
            ></v-data-table>
            <div class="no-data-table" v-show="props.nodata">{{props.message}}</div>
        </div>
</template>



<script>

import { setInterval } from 'timers';


export default {
     props: {
        dataRestFrom: null,
        colorFrom: null,
        idFrom: null,
        idDashFrom: null,
       // widthFrom: null,
        heightFrom: null
    },
    data () {
        return {
            props: {
               titles: [],
               superheroes: [],
               nodata: true,
               message: 'Нет данных для отображения',
               hash: 0,
               actions: [
                   {name:'click',
                   capture: []
                   },
                   {name:'mouseover',
                   capture:[]
                   },
                ],
               selected: {},
               justCreate: true
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
        // dataLoading: function() {
        //      return this.dataLoadingFrom
        // },
        color: function() {
            return this.colorFrom
        },
        height: function() {
            let otstup = 120;
            if (screen.width <= 1600) {
                otstup = 80;
            }
            if (screen.width <= 1400) {
                otstup = 70;
            }
            let height = this.heightFrom-otstup; // 120 это размер блока с пагинацией таблицы + шапка с настройками самого блока
            return height
        },
        createTable: function() { 
            let result = [];  
            
            if (Object.keys(this.dataRest).length != 0) {
                        if(this.dataRest.error) {
                            this.props.message = this.dataRest.error;
                            this.props.nodata = true;
                        } else {
                            result = this.dataRest;
                            this.createTitles(result);
                            this.createTockens(result);
                            this.setColors();
                            this.clearColor();
                            this.setEventColor();
                            if (this.props.justCreate) {
                                this.selectRow();
                                this.props.justCreate = false;
                            }
                            
                            this.props.nodata = false;
                        }
            } else {
                this.props.nodata = true;
            }
            return result
         },
         getDataStart: function() {
                 return  this.createTable;
         }

    },
     methods: {
        //  getData: async function() { 

        //      this.props.loading = true;

        //      let response = await this.$store.getters.getDataAPI({id:this.id, idDash: this.idDash});

        //      if ( response.status != 200) {
        //         this.props.superheroes = [];
        //         this.props.message = response.statusText
        //         this.props.loading = false;
        //         this.$store.commit('setShould', { idDash: this.idDash,  id: this.id, status: false});
        //      } else {
        //         this.createTitles(response.result);
        //         this.props.superheroes = response.result;
        //         this.props.loading = false;
        //         this.$store.commit('setShould', { idDash: this.idDash,  id: this.id, status: false});  
        //      }
            

        //  },
         createTitles: function(result) {

            let titles = Object.keys(result[0]).map( item => {
                 return {text: item, value: item}
             });

             this.props.titles = titles;

         },
         createTockens:  function(result) {
             let captures = Object.keys(result[0]);
             this.props.actions.forEach( (item,i) => {
                 this.$set(this.props.actions[i],'capture',captures);
             });
         },
         selectRow: function() {
             
                document.querySelector(`[data-id=${this.id}]`).addEventListener('click', event => {
                               
                            
                             if (event.target.tagName.toLowerCase() == "td") {
                                if (event.target.parentElement.classList.contains('selected')) {
                                    event.target.parentElement.classList.remove('selected');
                                } else {
                                    event.target.parentElement.parentElement.querySelectorAll('.selected').forEach( item => {
                                        item.classList.remove('selected');
                                        item.style =`background: transparent !important`;
                                    })
                                    event.target.parentElement.classList.add('selected');
                                }


                                let tockens = this.$store.getters.getTockens(this.idDash);
                                 
                                
                                  Object.keys(tockens).forEach( i =>{
                                        
                                        if (tockens[i].elem == this.id && tockens[i].action == 'click') {
                                            let row = [];
                                            let value = '';
                                            event.target.parentElement.childNodes.forEach( item => {
                                                row.push(item.textContent);
                                            })
                                            this.$refs[this.id].$el.querySelector('thead tr').childNodes.forEach( (item,j) => {
                                                if(item.textContent == tockens[i].capture){
                                                    value = row[j];
                                                }
                                            })

                                            this.$store.commit('setTocken', {tocken: tockens[i], idDash: this.idDash, value: value, store: this.$store });
                                        }

                                    })



                                let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: 'row'});
            
                                if (events.length != 0) {
                                    events.forEach( item => {
                                        if(item.action == 'set'){
                                            this.$store.commit('letEventSet', {events: events, idDash: this.idDash });
                                        } else if (item.action == 'go') {

                                                this.$store.commit('letEventGo', {event: item, idDash: this.idDash });
                                                this.$router.push(`/dashboards/${item.target.toLowerCase()}`);

                                        }

                                    });

                                }

                            //     let children = event.target.parentElement.childNodes;
                            //     let result = {};

                            //         if (this.props.titles.length != 0) {
                                
                            //             children.forEach( (item,i) => {
                            //                 result[this.props.titles[i].text] = item.innerText;
                            //             })

                            //             let tockens = this.$store.getters.getTockens(this.idDashFrom);
                            //             let tocken = {};
                                    
                            //             Object.keys(tockens).forEach( i =>{
                            //                 tocken = {
                            //                     name: tockens[i].name,
                            //                     action: tockens[i].action,
                            //                     capture : tockens[i].capture,
                            //                 }
                            //                 if (tockens[i].elem == this.idFrom && tockens[i].action == 'click') {
                            //                     this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDashFrom, value: result[tockens[i].capture] });
                            //                         let searches = this.$store.getters.getSearches(this.idDashFrom);
                            //                         let response = {};

                            //                             searches.forEach( async item => {
                            //                                 if (item.original_spl.indexOf(`$${tocken.name}`) != -1  ) {  // если в тексте запроса есть наш токен
                            //                                     response = await this.$store.getters.getDataApi({search: item, idDash: this.idDashFrom});
                                    
                            //                                     if ( response.status == 200) {
                            //                                         let responseDB = this.$store.getters.putIntoDB(response.result, item.sid, this.idDashFrom);
                            //                                         responseDB
                            //                                             .then(
                            //                                                 result => {
                            //                                                 let refresh =  this.$store.getters.refreshElements(this.idDashFrom, item.sid, );
                            //                                                 },
                            //                                             );
                            //                                     }
                                                             
                            //                                     }
                            //                             });
                            //                 } 
                            //             })

                            //         }
                             }

                })

                // document.querySelectorAll('.dash-table').forEach( item =>  {
                    
                //         item.addEventListener('click', (event) => {
                           

                //             if (event.target.parentElement.classList.contains('selected')) {
                //                 event.target.parentElement.classList.remove('selected');
                //             } else {
                //                 event.target.parentElement.parentElement.querySelectorAll('.selected').forEach( item => {
                //                     item.classList.remove('selected');
                //                 })
                //                 event.target.parentElement.classList.add('selected');
                //             }
                //             let children = event.target.parentElement.childNodes;
                //             let result = {};
                //             children.forEach( (item,i) => {
                //                 result[this.props.titles[i].text] = item.innerText;
                //             })

                //             let tockens = this.$store.getters.getTockens(this.idDash);
                           
                //             Object.keys(tockens).forEach( i =>{
                //                     console.log(tockens[i].elem, this.id);
                //                 if (tockens[i].elem == this.id && tockens[i].action == 'click') {
                                    
                //                         console.log('yep');
                //                     // this.$store.commit('setTocken', {name: tockens[i].name, idDash: this.idDash, value: result[tockens[i].capture] });
                //                 } 
                //             })


                //         });
                    
                // });
         },
         setColors: function() {
            
             let table = document.querySelector(`[data-id=${this.id}]`);
             
             let zagolovok = table.querySelector('thead');
             if (zagolovok != null) {
                zagolovok.style.color = this.color.text; 
                zagolovok.querySelector('tr').style.borderBottom = `1px solid ${this.color.text}`;
             }
             table.addEventListener('mouseover', event => {
                 if(event.target.tagName.toLowerCase() == 'td' && !event.target.parentElement.classList.contains('event')) {
                        event.target.parentElement.style =`background: ${this.color.controlsActive} !important;color:${this.color.back}`;
                 }
             })
             table.addEventListener('mouseout', event => {
                 if(event.target.tagName.toLowerCase() == 'td') {
                    if (!event.target.parentElement.classList.contains('selected') && !event.target.parentElement.classList.contains('event')) {
                        event.target.parentElement.style =`background: transparent !important;color:${this.color.text}`;
                    }
                    
                 }
             })
             
            //  table.querySelectorAll('tr').forEach( item => {
            //         item.onmouseout = (event) => {
            //             if (!item.classList.contains('selected')) {
            //                 item.style = `background:transparent !important`;
            //             }
            //         };
            //         item.onmouseover = (event) => {
            //             item.style = `background: ${this.colorFrom.controlsActive} !important`;
            //         };
            //  })

            
             
            //  table.querySelector('thead').querySelectorAll('th').forEach( item => {
            //      item.style.borderBottom = `1px solid ${this.colorFrom.text}`;
            //  })
            //   table.querySelectorAll('td').forEach( item => {
            //      item.style.borderBottom = `1px solid ${this.colorFrom.text}`;
            //  })
         },
         clearColor: function() {
               let table = this.$refs[this.id].$el;
               table.querySelectorAll('tbody tr').forEach( itemRow => {
                    itemRow.classList.remove('selected');
                    itemRow.style.background = 'transparent';
                    itemRow.style.color = this.color.text;
                    itemRow.querySelectorAll('td').forEach( (itemTd,i) => { 
                       itemTd.style.background = 'transparent';
                       itemTd.style.color = 'inherit'; 
                    });
                    itemRow.classList.remove('event');
                })
         },
         setEventColor: function() {

               
         
               let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'OnDataCompare', element: this.id});
               let table,column;
              // console.log(events);
               let eventObj = {};

              events.forEach( (item,j) => {
                  eventObj[j] = {};
                  eventObj[j]['compare'] = item.compare;
                  eventObj[j]['column'] = item.column;
                  eventObj[j]['row'] = item.row;
                  eventObj[j]['color'] = item.value[0]; 
                  eventObj[j]['prop'] = item.prop[0];
                  table = this.$refs[this.id].$el;
                  
                  if (eventObj[j]['prop'] == 'rowcolor' || eventObj[j]['prop'] == 'columncolor' || eventObj[j]['prop'] == 'cellcolor') {
                  
                    let  readyTh = setTimeout( function tick()  {
                            if (table.querySelectorAll('thead th').length != 0){
                                    clearTimeout(readyTh);
                                    let sp = 0;
                                    table.querySelectorAll('thead span').forEach( (itemSpan) => {
                                            if(itemSpan.innerText != 0) {
                                                if (itemSpan.innerText == eventObj[j]['column']) {
                                                    column = sp;
                                                }
                                                sp ++;
                                            }  
                                        });
                                   

                                        table.querySelectorAll('tbody tr').forEach( itemRow => {
                                            itemRow.querySelectorAll('td').forEach( (itemTd,i) => {
                                                if (i == column){
                                                    let needItem = null,row,k = -1;
                                                     
                                                    switch(eventObj[j]['compare']) {
                                                        
                                                        case 'equals':  
                                                                
                                                                if (itemTd.innerText == eventObj[j]['row']) {
                                                                    needItem = itemRow;
                                                                }
                                                            
                                                        break

                                                        case 'over':  
                                                            if (itemTd.innerText > eventObj[j]['row']) {
                                                                needItem = itemRow;
                                                            }
                                                        break

                                                        case 'less':  
                                                            if (itemTd.innerText < eventObj[j]['row']) {
                                                                needItem = itemRow;
                                                            }
                                                        break

                                                        case 'in':  
                                                            

                                                             row = eventObj[j]['row'].replace(/\[|\]/g, '').split(',');
                                                             k = -1;
                                                             row.forEach( rowValue => {
                                                                if (itemTd.innerText == rowValue) {
                                                                    k = 0;
                                                                }
                                                             })
                                                             if(k != -1){
                                                                 needItem = itemRow;
                                                             }

                                                        break

                                                        case 'between': 

                                                            row = eventObj[j]['row'].replace(/\[|\]/g, '').split(','); 
                                                            if (itemTd.innerText > row[0] && itemTd.innerText < row[1]){
                                                                 needItem = itemRow;
                                                             }
                                                        break

                                                    }

                                                    console.log(needItem)
                                                
                                                    if(needItem != null){
                                                        needItem.classList.add('event');
                                                    }
  
                                                } 
                                            });
                                        });
                                        
                                        if (table.querySelectorAll('.event').length > 0) {
                                             if (item.prop[0] == 'rowcolor') {
                                                 

                                                table.querySelectorAll('.event').forEach( res => {
                                                    res.style.background = eventObj[j]['color'];
                                                    res.style.color = this.color.back;
                                                })

                                            }  else if (item.prop[0] == 'cellcolor') {
                                                table.querySelectorAll('.event').forEach( res => {
                                                     res.children[column].style.background = eventObj[j]['color'];
                                                     res.children[column].style.color = this.color.back;
                                                })
                                            } else if (item.prop[0] == 'columncolor') {
                                                table.querySelectorAll('tbody tr').forEach( itemRow => {
                                                    itemRow.children[column].style.background = eventObj[j]['color'];
                                                    itemRow.children[column].style.color = this.color.back;
                                                });
                                            } 
                                        } 
                                       
                            } else {
                                readyTh = setTimeout(tick, 100); 
                            }
                        }.bind(this),0); 
                        
                    }
                  
                   
              });

            
            // if (events.length != 0) {
         },
         updatePage: function() {
             if (this.$refs[this.id]){
                 this.clearColor();
                 this.setEventColor();
             }
         }

    },
    mounted() {
        this.$store.commit('setActions', {actions: this.props.actions, idDash: this.idDash, id: this.id });
        this.$refs.tableBlock.style.color = this.color.text;
        this.$refs.tableBlock.style.backgroundColor = this.color.backElement;
      //  this.selectRow();
       // this.setColors();

    }
}


</script>

<style lang="sass" > 
  
     @import '../../sass/dashTable.sass'

</style>