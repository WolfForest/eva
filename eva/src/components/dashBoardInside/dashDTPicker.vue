<template >
    <div class="dash-picker"  >
        <div class="DTpicker" :class="{show_picker_elem:show_picker_elem}">
            <div class="DTPicker-btn" :style="{background:colorSet.controls}" @click="openHidden">
                <p>Выберите время и дату</p>
                <v-icon class=" picker-arrow " >{{arrow.elem}}</v-icon>
            </div>
            <div class="DTPicker-elem" :style="{boxShadow : `0 5px 5px -3px ${colorSet.border},0 8px 10px 1px ${colorSet.border},0 3px 14px 2px ${colorSet.border}`, background : colorSet.back, color : colorSet.text, border : `1px solid ${colorSet.border}`}">
                <div class="name-of-picker" :style="{color:colorSet.controls}"> Выбор времени</div>
                <!-- <hr :style="{color:colorSet.text}"> -->
                    <div class="choose-period">
                    <p :style="{color:colorSet.text}">Последние</p>
                    <v-text-field  class="textarea-item" outlined  @input="setLast($event)" :color="colorSet.text" :style="{color:colorSet.text}" v-model="last.every" hide-details></v-text-field>
                    </div>
                    <div class="choose-time">
                        <v-chip :color='colorSet[color.hour]' class="time" @click="setTime('hour')">Часов</v-chip>
                        <v-chip :color='colorSet[color.minute]' class="time" @click="setTime('minute')"> Минут</v-chip>
                        <v-chip :color='colorSet[color.second]' class="time" @click="setTime('second')">Секунд</v-chip>
                    </div>
                <div class="name-of-picker" :style="{color:colorSet.controls}"> Выбор времени и даты</div>
                <!-- <hr :style="{color:colorSet.text}"> -->
                <DTPicker v-model="start" label="Начальная дата и время" format="YYYY-MM-DD HH:mm"   :color="colorSet.controlsActive" :button-color="colorSet.controls" class="dtpicker" @validate="setTocken('dt')"></DTPicker>
                <DTPicker v-model="end" label="Конечная дата и время" format="YYYY-MM-DD HH:mm"  :color="colorSet.controlsActive" :button-color="colorSet.controls" class="dtpicker" @validate="setTocken('dt')"></DTPicker>
                <div class="name-of-picker" :style="{color:colorSet.controls}"> Диапазон даты</div>
                <!-- <hr :style="{color:colorSet.text}"> -->
                <DTPicker v-model="range" range  label="Диапазон дат" format="YYYY-MM-DD"  color="#FF6D70" button-color="teal" class="dtpicker range-picker" @validate="setTocken('range')"></DTPicker>
                <div class="name-of-picker" :style="{color:colorSet.controls}">Ввод даты и времени вручную</div>
                <!-- <hr :style="{color:colorSet.text}"> -->
                <v-text-field  label="Начальная дата" counter="500" clearable :append-icon="check" :color="colorSet[start_custom.color]" @blur="start_custom.color='controlsActive'" v-model="start_custom.value" hide-details  outlined  class="dtpicker custom-picker" @click:append="customDate('begin')"></v-text-field>
                <v-text-field  label="Конечная дата" counter="500" clearable :append-icon="check" :color="colorSet[end_custom.color]" @blur="end_custom.color='controlsActive'" v-model="end_custom.value" hide-details  outlined  class="dtpicker custom-picker"  @click:append="customDate('end')"></v-text-field>
                <div class="set-btn-block">
                    <v-btn small :color="colorFrom.controlsSystem" class="set-btn" @click="setDate">Установить</v-btn>
                </div>
                
            </div>
        </div>
        <div class="current-date" :class="{show_curent:show_curent}" >{{curDate}}</div>
       
        
    </div>
</template>


<script>

import {  mdiChevronDown, mdiChevronUp, mdiCheckBold} from '@mdi/js'

export default {
    props: {
        idFrom: null,
        idDashFrom: null,
        dataRestFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            actions: [
                   {name:'select',
                   capture: ['start','end']
                   },
                ],
            start: null,
            end: null,
            range: null,
            last: {
                every: 0,
                time: ''
            },
            color: {
                hour: 'controls',
                minute: 'controls',
                second: 'controls',
            },
            start_custom: {
                value: null,
                color: 'controlsActive'
            },
            end_custom: {
                value: null,
                color: 'controlsActive'
            },
            up: mdiChevronUp,
            down: mdiChevronDown,
            check: mdiCheckBold,
            arrow: {
                direct: 'down',
                elem: mdiChevronDown
            },
            show_picker_elem: false,
            // arrow: {
            //     dt: {
            //         direct: 'down',
            //         elem: mdiChevronDown
            //     },
            //     range: {
            //         direct: 'down',
            //         elem: mdiChevronDown
            //     },
            //     custom: {
            //         direct: 'down',
            //         elem: mdiChevronDown
            //     }
            // },
            //  show_picker_elem: {
            //     dt: false,
            //     range: false,
            //     custom: false,
            //   },
            show_curent: false,
            date: {},
            curDate: '',
            startForStore: '',
            endForStore: '',
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
        colorSet: function() {
            return this.colorFrom
        },
        // getPickerDate: function(){
        //     return this.$store.getters.getChangeDate({idDash: this.idDash, id: this.id})
        // },
        // currentDate: function() { 
            
        //       this.curDate = calcCurrentDate();
        // },
     },  
     methods: {
        // arrows: function(elem) {
        //         return this.arrow[elem].elem
        // },
        // showElem: function(elem) {
        //     return this.show_picker_elem[elem]
        // },
         calcCurrentDate: function() { 
             let data = this.$store.getters.getPickerDate({idDash: this.idDash, id: this.id});
             let current = '';  
            
            if (data.start != null) {
                   current = `${data.start} - `;
                   this.start = data.start;
                    if (data.end != null) {
                        current += data.end;
                        this.end = data.end;
                    } else {
                        current += '...';
                    }
              } else {
                if (data.end != null) {
                    current = `... - ${data.end}`;
                } 
              }

              if (data.range != null) {
                  current = `${data.range.start} - ${data.range.end}`;
                  this.range = data.range;
              }
              
             if (data.startCus != null) {
                   current = `${data.startCus} - `;
                   this.start_custom.value = data.startCus;
                    if (data.endCus != null) {
                        current += data.endCus;
                        this.end_custom.value = data.endCus;
                    } else {
                        current += '...';
                    }
              } else {
                if (data.endCus != null) {
                    current = `... - ${data.endCus}`;
                } 
              }
                if (data.last != null){
                    if (data.last.every != 0 && data.last.time != '') {
                        let time = '...';
                        switch (data.last.time){
                            case 'second':
                                time = 'секунд'
                                break
                            case 'minute':
                                time = 'минут'
                                break
                            case 'hour':
                                time = 'часов'
                                break

                        }
                        current = `Последние  ${data.last.every} ${time}`;
                    }
                }

             if (current != '') {
                 
                 this.show_curent = true
             } else {
                 this.show_curent = false
             }
              return current
        },
        openHidden: function(elem) {
            this.show_picker_elem = !this.show_picker_elem;
            if( this.arrow.direct == 'down') {
                this.arrow.direct = 'up';
                this.arrow.elem = this.up;
                this.show_curent = false;
                this.setColor();
            } else {
                this.changeDate = !this.changeDate;
                this.arrow.direct = 'down';
                this.arrow.elem = this.down;
                this.showCurrent();
                this.curDate = this.calcCurrentDate();

            }

        },
        setColor: function() {
            let elem = document.querySelector('.DTPicker-elem');
            elem.querySelectorAll('.field-input').forEach( item => {
                    item.style.background = this.colorSet.back;
                    item.style.color = this.colorSet.text;
                    item.style.boxShadow = `0 0px 2px 0px ${this.colorSet.border},0 0px 2px 0px ${this.colorSet.border},0 0px 2px 0px ${this.colorSet.border}`;
            });
            elem.querySelectorAll('.datepicker').forEach( item => {
                item.style.background = this.colorSet.back;
                item.style.color = this.colorSet.text;
                item.style.fill = this.colorSet.text;
                item.style.borderColor = this.colorSet.text;
                item.style.boxShadow = `0 0px 2px 0px ${this.colorSet.border},0 0px 2px 0px ${this.colorSet.border},0 0px 2px 0px ${this.colorSet.border}`;

               // item.querySelector('.datepicker-today').style = `background:${this.colorSet.back};border: 1px solid ${this.colorSet.text}`;
            })
        },
        customDate: function(elem) {
           elem == 'begin' ? this.start_custom.color = 'controls': this.end_custom.color = 'controls';
               this.setTocken('custom');
        },
        showCurrent: function() {
            this.$set(this.date,'start',this.start);
            this.$set(this.date,'end',this.end);
            this.$set(this.date,'range',this.range);
            this.$set(this.date,'startCus',this.start_custom.value);
            this.$set(this.date,'endCus',this.end_custom.value);
            this.$set(this.date,'last',this.last);
            this.$store.commit('setPickerDate', {date: this.date, idDash: this.idDash, id: this.id });
        },
        setLast: function(event) {
            this.last.every = event;
            this.setTocken('time');
        },
        setTime: function(time) {
                this.last.time = time;
                Object.keys(this.color).forEach( item => {
                    this.color[item] = 'controls';
                })
                if (this.color[time] == 'controls') {
                    this.color[time] = 'controlsActive';
                } else {
                    this.color[time] = 'controls';
                }
                this.setTocken('time');
        },
        setTocken: function(elem) {

           

            switch(elem) {
            case 'dt':  
                this.startForStore =  parseInt(new Date(this.start).getTime()/1000);
                this.endForStore = parseInt(new Date(this.end).getTime()/1000);
                this.range = null;
                this.start_custom.value = null;
                this.end_custom.value = null;
                this.last.time = '';
                this.last.every = 0;
                Object.keys(this.color).forEach( item => {
                    this.color[item] = 'controls';
                })
                break

            case 'range': 
                this.startForStore = parseInt(new Date(this.range.start).getTime()/1000);
                this.endForStore = parseInt(new Date(this.range.end).getTime()/1000);
                this.start = null;
                this.end = null;
                this.start_custom.value = null;
                this.end_custom.value = null;
                this.last.time = '';
                this.last.every = 0;
                Object.keys(this.color).forEach( item => {
                    this.color[item] = 'controls';
                })
                break

            case 'custom':
                this.startForStore =  this.start_custom.value;
                this.endForStore = this.end_custom.value;
                this.start = null;
                this.end = null;
                this.range = null;
                this.last.time = '';
                this.last.every = 0;
                Object.keys(this.color).forEach( item => {
                    this.color[item] = 'controls';
                })
                break
            case 'time':
                let period = 0;
                switch(this.last.time) {
                    case 'second':
                        period = Number(this.last.every) * 1000
                        break
                    
                    case 'minute':
                        period = Number(this.last.every) * 1000 *60
                        break

                    case 'hour':
                        period = Number(this.last.every) * 1000 *3600
                        break
                }
   
                this.startForStore =  Date.now()-period;
                this.endForStore = Date.now();
                this.start = null;
                this.end = null;
                this.range = null;
                this.start_custom.value = null;
                this.end_custom.value = null;
                break
            }
          
               
        },
        setDate: function() {
                let tockens = this.$store.getters.getTockens(this.idDash);
                let tocken = {};

                let setTocken = (value) => {
                  this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: value, store: this.$store});

                //   let searches = this.$store.getters.getSearches(this.idDash);
                //   let response = {};


                //      searches.forEach(async item => {
                //          if (typeof item.parametrs.twf != 'number'){
                //             if (item.parametrs.twf.indexOf(`$${tocken.name}`) != -1 || item.parametrs.tws.indexOf(`$${tocken.name}`) != -1 ) {

                //                     response = await this.$store.getters.getDataApi({search: item, idDash: this.idDash});
                                    
                //                     if ( response.status == 200) {
                //                         let responseDB = this.$store.getters.putIntoDB(response.result, sid, this.idDash);
                //                         responseDB
                //                             .then(
                //                                 result => {
                //                                 let refresh =  this.$store.getters.refreshElements(this.idDash, sid, );
                //                                 },
                //                             );
                //                     }
                //         //     if (item.original_spl.indexOf(`$${tocken.name}`) != -1  ) {  // если в тексте запроса есть наш токен
                //         //         response = this.$store.getters.getDataAPI({search: item, idDash: this.idDash});
                //                 }
                //          }
                //      });

                }
                
                Object.keys(tockens).forEach( i =>{
                     tocken = {
                        name: tockens[i].name,
                        action: tockens[i].action,
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == 'select' && tockens[i].capture == 'start') {
                        if (this.startForStore != null) {
                            setTocken(this.startForStore);
                            //this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: this.startForStore  });
                        }
                    } 
                    if (tockens[i].elem == this.id && tockens[i].action == 'select' && tockens[i].capture == 'end') {
                        if (this.endForStore != null) {
                            setTocken(this.endForStore);
                           // this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: this.endForStore });
                        }
                    }
                })  
                this.openHidden();
        },
    },
    mounted() {
        this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
       this.$emit('hideDS',this.id);
       this.$emit('setVissible',this.id);
       
    //    document.querySelectorAll('button.now').forEach(item => {
    //        item.addEventListener('click',() => {
    //              this.setTocken('dt');
    //         });
    //    });
       this.curDate = this.calcCurrentDate();

    } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashDTPicker.sass'

   
</style>