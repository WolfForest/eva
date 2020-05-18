<!-- Модальное окно для создания ИС -->

<template>
    <v-dialog  :value="active"  width="680" persistent :color="color.text" @keydown="checkEsc($event)"> 
        <v-card :style="{background: color.back, color: color.text}" class="card-search">
            <div class="textarea-block"  >
                    <v-text-field :color="color.text" class="textarea-item" outlined label="Имя ИД" placeholder="Sid"  v-model="search.sid" hide-details></v-text-field>
                    <v-textarea :color="color.text" outlined hide-details no-resize spellcheck="false" class="code-search" height="180px" rows="5"  placeholder="Origin spl" label="Текст ИД" v-model="search.original_spl"></v-textarea>
                    <div class="times-block">
                        <div class="time-block">
                            <v-text-field  :color="color.text" class="textarea-item" outlined label="Временной интервал: начало"  placeholder="0" v-model="search.parametrs.tws" hide-details></v-text-field>
                            <DTPicker v-model="tws"    :no-value-to-custom-elem="true"  format="YYYY-MM-DD HH:mm"     :color="color.controlsActive" :button-color="color.controls" class="dtpicker-search" >
                                <v-icon class="picker-search" :color="color.controls" >{{pickerIcon}}</v-icon> 
                            </DTPicker>
                        </div>
                        <div class="time-block">
                            <v-text-field  :color="color.text" class="textarea-item" outlined label="Временной интервал: конец" placeholder="0"  v-model="search.parametrs.twf" hide-details></v-text-field>
                            <DTPicker v-model="twf"   :no-value-to-custom-elem="true"  format="YYYY-MM-DD HH:mm"     :color="color.controlsActive" :button-color="color.controls" class="dtpicker-search" >
                                <v-icon class="picker-search" :color="color.controls" >{{pickerIcon}}</v-icon> 
                            </DTPicker>
                        </div>
                    </div>
                    <v-expansion-panels class="expansion-panels">
                        <v-expansion-panel>
                            <v-expansion-panel-header>Дополнительные параметры</v-expansion-panel-header>
                            <v-expansion-panel-content class='order-expansion'>
                                <v-text-field  color="teal"  class="textarea-item" outlined label="Timeout"  v-model="search.parametrs.timeout" hide-details></v-text-field>
                                <v-text-field  color="teal"  class="textarea-item" outlined label="Cache_ttl"  v-model="search.parametrs.cache_ttl" hide-details></v-text-field>
                                <v-text-field color="teal"   class="textarea-item" outlined label="Field_extraction"  v-model="search.parametrs.field_extraction" hide-details></v-text-field>
                                <v-text-field  color="teal"  class="textarea-item" outlined label="Preview"  v-model="search.parametrs.preview" hide-details></v-text-field>
                            </v-expansion-panel-content>
                        </v-expansion-panel>   
                    </v-expansion-panels> 

<!-- 


                    <v-text-field  :color="color.text"  class="textarea-item" outlined label="Username"  v-model="search.parametrs.username" hide-details></v-text-field>
                    <v-text-field  :color="color.text" class="textarea-item" outlined label="Timeout"  v-model="search.parametrs.timeout" hide-details></v-text-field>
                    <v-text-field  :color="color.text" class="textarea-item" outlined label="Preview"  v-model="search.parametrs.preview" hide-details></v-text-field>
                    <v-text-field  :color="color.text" class="textarea-item" outlined label="Field_extraction"  v-model="search.parametrs.field_extraction" hide-details></v-text-field>
                    <v-text-field  :color="color.text" class="textarea-item" outlined label="Cache_ttl"  v-model="search.parametrs.cache_ttl" hide-details></v-text-field>
            -->
            </div> 
            <v-card-actions class = "searchBtn">
            <div class="errorMsg" :style="{color:this.color.controlsActive}" :class="{errorMsgShow:errorMsgShow}">{{errorMsg}}</div>
            <v-btn small :color="color.controlsSystem" class="create-btn" @click="addSearch">{{createBtn}}</v-btn>
            <v-btn small :color="color.controlsActive" class="create-btn" @click="cancelModal">{{cancelBtn}}</v-btn>
            </v-card-actions>
             <!-- <div class="warning-block" :class="{show:show}" :style="{boxShadow : `0 3px 1px -2px ${this.color.border},0 2px 2px 0 ${this.color.border},0 1px 5px 0 ${this.color.border}`, background: color.back, color: color.text}">
                    <div class="warning-text" >Такой источник данных существует. Хотите заменить его?</div>
                    <div class="btn-warning"> 
                        <v-btn small :color="color.controls" class="warning-btn" @click="yesSearch">Да</v-btn>
                        <v-btn small :color="color.controlsActive" class="warning-btn" @click="noSearch">Нет</v-btn>
                    </div>
             </div> -->
        </v-card>
       
        
    </v-dialog>
</template>

<script> 

import { mdiCalendarMonth} from '@mdi/js'

export default {
    props: {
        idDashFrom: null,
        colorFrom: null,
        modalFrom: null,
        dataSearchFrom: null,
        createBtnFrom: null,
    },
    data () {
        return {
            search: {
                sid: null,
                original_spl: null,
                parametrs: {
                    tws: 0,
                    twf: 0,
                    username: 'admin',
                    timeout: 60,
                    preview: false,
                    field_extraction: false,
                    cache_ttl: 60,
                },
            },
            // show: false,
            createText: 'Создать',
            errorMsgShow: false,
            errorMsg: '',
            createBtn: 'Создать',
            cancelBtn: 'Отмена',
            tws : '',
            twf : '',
            pickerIcon: mdiCalendarMonth
        }
    },
      computed: {
           active: function() {  // тут понимаем нужно ли открыть окно с созданием или нет
       
                if (this.modalFrom) {
            //       //  this.setSearch();
                    
                    this.search = this.dataSearch; 
                    if (this.createBtnFrom == 'edit') {
                        this.createBtn =  'Редактировать';
                    } else {
                        this.createBtn =  'Создать';
                    }
                }
                
               return this.modalFrom
           },
            dataSearch: function() {
                return this.dataSearchFrom
            },
            idDash: function() {  // получаем id страницы переданного от родителя
                return this.idDashFrom
            },
            color: function() {
                return this.colorFrom
            },
            // createBtn: function() {
            //     this.search = this.dataSearch; 
            //     if (this.createBtnFrom == 'edit') {
            //         return 'Редактировать'
            //     } else {
            //         return 'Создать'
            //     }
            //     // btn == 'edit' ? this.createText = 'Редактировать' : this.createText = 'Создать'
            //     // return this.createBtnFrom
            // }
     },
     watch: {
        tws : function () {
            this.search.parametrs.tws = this.tws ;
        },
        twf : function () {
            this.search.parametrs.twf = this.twf;
        }
    },
      methods: {  
         cancelModal: function() {
             if (this.cancelBtn == 'Отмена') {
                this.$emit('cancelModal');
             } else {
                if (this.createBtnFrom == 'edit') {
                    this.createBtn =  'Редактировать';
                } else {
                    this.createBtn =  'Создать';
                }
                this.cancelBtn = 'Отмена';
                this.errorMsgShow =  false;
             }
         },
        //  setSearch: function(btn) {
        //      this.search = this.dataSearch; 
        //      console.log('zashol')
        //      btn == 'edit' ? this.createText = 'Редактировать' : this.createText = 'Создать'
        //  },
          checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancelModal();
              }
          },
         addSearch: function() {  // добовляем ИС

            if (this.search.sid && this.search.sid != '' ) {

 
             
                if (typeof this.search.parametrs.tws == 'string' && parseInt(new Date(this.search.parametrs.tws).getTime()/1000)) {
                    this.search.parametrs.tws = parseInt(new Date(this.search.parametrs.tws).getTime()/1000);
                } 
                if (typeof this.search.parametrs.twf == 'string' && parseInt(new Date(this.search.parametrs.twf).getTime()/1000)) {
                    this.search.parametrs.twf = parseInt(new Date(this.search.parametrs.twf).getTime()/1000);
                } 


                let searches  = this.$store.getters.getSearches(this.idDash);  // получаем все ИС
                let j = -1;

                searches.forEach( (item,i) => { // пробегаемся по всем ИС
                        if (item.sid == this.search.sid) {  // и если ИС с таким id уже есть
                            j = i;  // меняем переменную
                        }
                }) 


                if (j != -1) {  // если такой ИС уже есть вызовем сообщение с уточнением
                    if (this.cancelBtn == 'Отмена') {
                        this.errorMsg = 'Такой источник данных существует. Хотите заменить его?';
                        this.createBtn = 'Да';
                        this.cancelBtn = 'Нет';
                        this.errorMsgShow =  true;
                    } else {
                        this.$store.commit('setSearch', {search: this.search, idDash: this.idDash, reload: true });  // отправляем в хранилище для создания
                        this.$emit('startSearch',this.search);
                        this.cancelBtn = 'Отмена';
                        this.errorMsgShow =  false;
                        this.$emit('cancelModal'); // и скрываем окно редактирования ИС

                    }
                    
                } else {  // если нету
                    this.$emit('startSearch',this.search);
                    this.$store.commit('setSearch', {search: this.search, idDash: this.idDash, reload: false });  // отправляем в хранилище для создания
                    this.$emit('cancelModal'); // и скрываем окно редактирования ИС
                }


            } else {
                this.errorMsg = 'Sid источника данных не может быть пустым';
                this.errorMsgShow =  true;
                setTimeout( () => {
                    this.errorMsgShow =  false;
                },2000)
            }
                    

         },
        //  yesSearch: function() {  // кнопка согласия на обновления если ИС или токен уже существует
        //     // let elem = event.target.nodeName.toLowerCase() != 'button' ? event.target.parentElement : event.target;  // сперва берем родителя кнопки, и если не получилось поймать кнопку, то еще выше уровнеь берем
        //     // if (elem.getAttribute('tool') == 'search') {  // если это окно ИС
        //     //          this.$store.commit('setSearch', {search: this.newSearch, idDash: this.idDash, reload: true }); // то обновляем ИС
        //     //          this.$el.querySelector('.warning-block').style = ` opacity: 0`; // убираем окно с предпреждением
        //     //          this.openSearch();
        //     // } else if (elem.getAttribute('tool') == 'tocken') {  // если это токен - собственно тоже самое
        //     //        this.$store.commit('createTockens', {idDash: this.idDash, tocken: this.tempTocken});
        //     //        this.$el.querySelector('.warning-block').style = ` opacity: 0`;
        //     //        this.showSign = true;
        //     //        this.opennewtocken=false;
        //     // }
            
        //     this.$store.commit('setSearch', {search: this.search, idDash: this.idDash, reload: true });  // отправляем в хранилище для создания
        //     this.$emit('startSearch',this.search);
        //     this.show = false; // то просто убираем это окно
        //     this.$emit('cancelModal'); // и скрываем окно редактирования ИС
            
        //  },
        //  noSearch: function() { // если нажали на кнопку нет
        //     this.show = false; // то просто убираем это окно
        //  },
         changeColor: function() {
             document.querySelectorAll('.v-dialog').forEach( item => {
                 item.style.boxShadow = `0 3px 1px -2px ${this.color.border},0 2px 2px 0 ${this.color.border},0 1px 5px 0 ${this.color.border}`;
                 if (item.querySelectorAll('.textarea-item').length != 0) {
                      if(item.querySelectorAll('.textarea-item')){
                          item.querySelectorAll('.textarea-item').forEach( item2 => {
                              item2.querySelector('fieldset').style.borderColor = this.color.text;
                          })
                      }
                       if(item.querySelector('.code-search')){
                           item.querySelector('.code-search').querySelector('fieldset').style.borderColor = this.color.text;
                       }
                 }
             })
            
            //  document.querySelectorAll('fieldset').forEach( item => {
            //      item.style.borderColor = this.color.text;
            //  })
         },

      
      },
      updated() {
            this.changeColor();
      }
}
</script>

<style lang="sass" > 

     @import '../sass/modalCreateSearch.sass'
    
</style>