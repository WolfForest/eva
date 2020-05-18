<!-- Модальное окно для выбора ИС -->

<template>
    <v-dialog  :value="active"  width="600" persistent @keydown="checkEsc($event)">
      <v-card :style="{background:colorDeliver.backElement}" class="shedule-modal">
        <div class="schedule-block">
            <div class="zagolovok" :style="{color:colorDeliver.text}">
                Расписание для запроса <b>{{sid}}</b>
            </div>
             <div class="tab-block">
                     <v-tabs  :color="colorDeliver.controls"  :background-color="colorDeliver.backElement">
                        <v-tabs-slider ></v-tabs-slider>
                        <v-tab  :style="{color:colorDeliver.text}">Периодичность</v-tab>
                        <v-tab-item :style="{color:colorDeliver.text, background:colorDeliver.backElement}">
                            <div class="every">
                                <p>Каждые</p>
                                <v-text-field :color="colorDeliver.text" :style="{color: colorDeliver.text, border: `1px solid ${colorDeliver.text}`}" class="textarea-item" outlined :disabled="disabledEvery"  v-model="every" hide-details></v-text-field>
                                <div class="choose-time">
                                    <v-chip :color='colorDeliver[color.hour]' class="time" @click="setTime('hour','every')">Часов</v-chip>
                                    <v-chip :color='colorDeliver[color.minute]' class="time" @click="setTime('minute','every')"> Минут</v-chip>
                                    <v-chip :color='colorDeliver[color.second]' class="time" @click="setTime('second','every')">Секунд</v-chip>
                                </div>
                            </div>
                            <!-- <p class="time-select">Интервал</p>
                            <v-divider></v-divider>
                            <div class="range">
                                <p>Получать данные с </p>
                                <v-text-field class="picker-text" v-model="range.start" readonly @click="picker.start = true"></v-text-field>
                                <p>по</p>
                                <v-text-field class="picker-text" v-model="range.end" readonly @click="picker.end = true"></v-text-field>
                            </div> -->
                            <p class="time-select" :style="{color:colorDeliver.text, opacity:'0.5'}">Получать данные за последние</p>
                            <v-divider :style="{borderColor:colorDeliver.border, opacity:'0.5'}"></v-divider>
                            <div class="last">
                                <v-text-field :color="colorDeliver.text" :style="{color: colorDeliver.text, border: `1px solid ${colorDeliver.text}`}" class="textarea-item" outlined :disabled="disabledEvery"  v-model="everyLast" hide-details></v-text-field>
                                <div class="choose-time">
                                    <v-chip :color='colorDeliver[colorLast.hour]' class="time" @click="setTime('hour','last')">Часов</v-chip>
                                    <v-chip :color='colorDeliver[colorLast.minute]' class="time" @click="setTime('minute','last')"> Минут</v-chip>
                                    <v-chip :color='colorDeliver[colorLast.second]' class="time" @click="setTime('second','last')">Секунд</v-chip>
                                </div>
                            </div>
                        </v-tab-item>
                        <v-tab :style="{color:colorDeliver.text}">Планирование</v-tab>
                         <v-tab-item >
                            
                      
                        </v-tab-item>
                    </v-tabs>
                
            </div>
            <!-- <v-time-picker  class="picker-time" color="teal" v-if="picker.start" v-model="range.start" full-width  format="24hr" use-seconds @click:second="picker.start=false"></v-time-picker>
            <v-time-picker  class="picker-time" color="teal" v-if="picker.end" v-model="range.end" full-width  format="24hr" use-seconds @click:second="picker.end=false"></v-time-picker> -->
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small :color="colorDeliver.controlsActive" class="delete-btn" :class="{disable:disabledStop}" @click="cancelSchedule">{{msg}}</v-btn>
          <v-btn small :color="colorDeliver.controlsSystem" class="delete-btn" :disabled="disabledStart" @click="startSchedule">Подтвердить</v-btn>
          <v-btn small :color="colorDeliver.controlsActive" class="delete-btn" @click="cancel">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>


export default {
    props: {
        idDashFrom: null,
        modalFrom: null,
        dataSidFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            every: 0,
            time: '',
            everyLast: 0,
            timeLast: '',
            color: {
                hour: 'controls',
                minute: 'controls',
                second: 'controls',
            },
            colorLast: {
                hour: 'controls',
                minute: 'controls',
                second: 'controls',
            },
            disabledStop: true,
            disabledStart: false,
            disabledEvery: false,
            msg: "Не запущен",
            timers: {},
            picker: {
                start: false,
                end: false
            }
        }
    },
      computed: { 
          
          idDash: function() {  // получаем название элемента от родителя
            return this.idDashFrom
          },
           active: function() {  // получаем статус открытия или нет окна модального
                   if (this.modalFrom)  {
                       if(this.schedulers.length != 0){
                          if (this.schedulers[this.sid]) { // отображаем цвета и доступность кнопок исходя из того запущен ли планировщик
                                this.every = this.schedulers[this.sid].every;
                                this.time = this.schedulers[this.sid].time;
                                this.everyLast = this.schedulers[this.sid].everyLast;
                                this.timeLast = this.schedulers[this.sid].timeLast;
                                this.color[this.time] = "controlsActive";
                                this.colorLast[this.timeLast] = "controlsActive";
                                this.disabledStop = false;
                                this.disabledStart = true;
                                this.disabledEvery = true;
                                this.msg = "Остановить";
                          } else {
                                this.every = 0;
                                this.time = '';
                                this.everyLast = 0;
                                this.timeLast = '';
                                Object.keys(this.color).forEach( item => {
                                    this.color[item] = 'controls';
                                    this.colorLast[item] = 'controls';
                                })
                                this.disabledStop = true;
                                this.disabledStart = false;
                                this.disabledEvery = false;
                                this.msg = "Не запущен";
                          }
                       } 
                   }
                  
                   return this.modalFrom
           },
           sid: function() {
               return this.dataSidFrom
           },
           schedulers: function() {
               return this.$store.getters.getSchedulers(this.idDash)
           },
           searches: function() {
               return this.$store.getters.getSearches(this.idDash)
           },
           colorDeliver: function() {
               return this.colorFrom
           },
     },
      methods: {
          cancel: function() {  // закрываем окно
              this.$emit("cancel");
          },
          checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancel();
              }
          },
          setTime: function(time,tense) {  // выставляем время и меняем цвета у кнопок 
              if (!this.disabledEvery) {
                if (tense == 'every') {
                            this.time = time;
                            Object.keys(this.color).forEach( item => {
                                this.color[item] = 'controls';
                            })
                            if (this.color[time] == 'controls') {
                                this.color[time] = 'controlsActive';
                            } else {
                                this.color[time] = 'controls';
                            }
                        
                } else if (tense == 'last') {
                            this.timeLast = time;
                            Object.keys(this.colorLast).forEach( item => {
                                this.colorLast[item] = 'controls';
                            })
                            if (this.colorLast[time] == 'controls') {
                                this.colorLast[time] = 'controlsActive';
                            } else {
                                this.colorLast[time] = 'controls';
                            }
                }
              }
              
          },
          countTime(time,every) {  // переводим строковые значения времени в числовые
                let period = 0;
                        switch(time) {
                            case 'second':
                                period = Number(every) 
                                break
                            
                            case 'minute':
                                period = Number(every)   *60
                                break

                            case 'hour':
                                period = Number(every)  *3600
                                break
                        
                        }
                        return period
          },
          executeSearch:  function(searches,sid,shedule) {  // выполняем серч меняя его временны рамки
                let curTimeLast = 0;
                let tws = 0; 
                let twf = 0;
                if (shedule.everyLast != 0) {
                    curTimeLast = this.countTime(shedule.timeLast, shedule.everyLast);
                    tws = Math.floor(new Date().getTime()/1000-curTimeLast);
                    twf = Math.floor(new Date().getTime()/1000); 
                  //  console.log(tws,twf);
                }
               searches.forEach( async item => {
                            if (item.sid  ==  sid ) {  
                                item.parametrs.tws = tws;
                                item.parametrs.twf = twf;
                                this.$store.commit('setSearch', {search: item, idDash: this.idDash, reload: true });
                                this.$store.commit('setLoading', {search: item.sid, idDash: this.idDash, should: true, error: false });   
                                let response = await this.$store.getters.getDataApi({search: item, idDash: this.idDash});
                                 
                                if ( response.status == 200) {
                                    let responseDB = this.$store.getters.putIntoDB(response.result, sid, this.idDash);
                                    responseDB
                                        .then(
                                            result => {
                                            let refresh =  this.$store.getters.refreshElements(this.idDash, sid, );
                                            this.$store.commit('setLoading', {search: item.sid, idDash: this.idDash, should: false, error: false });  
                                            },
                                        );
                                } else {
                                    this.$store.commit('setLoading', {search: item.sid, idDash: this.idDash, should: false, error: true });  
                                }
                            }
                }); 
          },
          startSchedule: function() {  // запускаем планировщик

                let shedule = {
                    time: this.time,
                    every: this.every,
                    timeLast: this.timeLast,
                    everyLast: this.everyLast,
                };
                let sid = this.sid;



            //   let time_start, time_end;

            //   if (this.range.start != null &&  this.range.end != null) {
            //       console.log(this.range.start, this.range.end);
            //   }



              this.$store.commit('setSchedule', {idDash: this.idDash, sid: this.sid, every: this.every, time: this.time, everyLast: this.everyLast, timeLast: this.timeLast}); 
              let searches = this.$store.getters.getSearches(this.idDash);
              let curTime = this.countTime(shedule.time, shedule.every)*1000;
                this.executeSearch(searches,sid,shedule); // сперва первый раз просто выполняем серч
                this.timers[sid] = setInterval( () => { 
                       // console.log(sid);
                        this.executeSearch(searches,sid,shedule);  // а затем уже выполняем его в цикле
                        
                },curTime) 
              this.cancel();
          },
          cancelSchedule: function() {  // отменить планировщик
                this.$store.commit('deleteSchedule', {idDash: this.idDash, sid: this.sid});
                this.every = 0;
                this.color[this.time] = "teal";
                this.time = '';
                this.disabledStop = true;
                this.disabledStart = false;
                this.disabledEvery = false;
                this.msg = "Не запущен";
                clearInterval(this.timers[this.sid]);
                delete this.timers[this.sid];
          },
          
         
       
    },
    mounted() {
       // this.$store.commit('setModalSearch', { id: this.idDash, status: false });  // при создании окна на странице выключаем все открытые ранее окна
        let schedulers = this.schedulers;
        let searches = this.$store.getters.getSearches(this.idDash);
        let shedule = {};
        let curTime = {};
        
       if (Object.keys(schedulers).length != 0) {  // при обновлении страницы нужно понять  есть ли уже планировщики и снова их запустить 
           Object.keys(schedulers).forEach( items => {   // пробегаемся по всем планировщикам
               shedule = {  // создаем объект на основе настроек планировщика
                    time: schedulers[items].time,
                    every: schedulers[items].every,
                    timeLast: schedulers[items].timeLast,
                    everyLast: schedulers[items].everyLast,
                };
                curTime = this.countTime(shedule.time, shedule.every)*1000; // переводим в правильный формат время
                this.executeSearch(searches,items,shedule);  // выоплняем серч один раз
                this.timers[items] = setInterval( () => {  // и запускаем в цикле
                    this.executeSearch(searches,items,shedule);
                },curTime)
                
           });
       }

      

     
    },
 
}
</script>


<style lang="sass"> 
  
    @import '../sass/modalScheduler.sass'
   
  
</style>

