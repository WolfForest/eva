<!-- Модальное окно для настройки дашборда -->

<template>
  <v-dialog  
    v-model="active"  
    width="1140"  
    persistent 
    @keydown="checkEsc($event)"
  > 
    <div class="settings-modal-block">
      <v-card :style="{background:color.backElement}">
        <v-card-text class="headline">
          <div 
            class="settings-title" 
            :style="{color:color.text,borderColor:color.text}"
          >
            Настройки 
            <p>{{ element }}</p> 
          </div>
        </v-card-text>
        <div 
          ref="options" 
          class="options-block" 
        >
          <div class="option-item">
            <div 
              class="name-option main item" 
              :style="{color:color.text, borderBottom: `1px solid ${color.text}`}"
            >
              Название
            </div>
            <div 
              class="discribe-option main item" 
              :style="{color:color.text, borderBottom: `1px solid ${color.text}`}"
            >
              Описание
            </div>
            <div 
              class="status-option main item" 
              :style="{color:color.text, borderBottom: `1px solid ${color.text}`}"
            >
              Статус
            </div>
          </div>
          <div 
            v-if="checkOptions('visible')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}" 
            >
              visible
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Показывает / скрывает элемент
            </div>
            <div class="status-option item">
              <v-switch   
                v-model="options.visible"  
                class="switch" 
                :color="color.controls" 
                :style="{color:color.text}" 
                :label="String(options.visible)" 
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('level')"
            class="option-item"
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}" 
            >
              level
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Установить слой отображения элемента
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.level"
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber"  
                hide-details
              />  
            </div>
          </div>
          <div 
            v-if="checkOptions('boxShadow')"
            class="option-item"
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              boxShadow
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Добавляет / удаляет тень
            </div>
            <div class="status-option item">
              <v-switch  
                v-model="options.boxShadow"    
                class="switch" 
                :color="color.controls" 
                :style="{color:color.text,}"
                :label="String(options.boxShadow)" 
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('subnumber')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              subnumber
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выводит дополнительную надпись под числом
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.subnumber"   
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber"  
                hide-details
              />  
            </div>
          </div>
          <div 
            v-if="checkOptions('rowcolor')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              rowcolor
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать цвет которым подсветится нужная строка
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.rowcolor"  
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber"  
                hide-details
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('columncolor')"
            class="option-item"
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              columncolor
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать цвет которым подсветится нужная строка
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.columncolor" 
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}"
                outlined 
                class="subnumber"  
                hide-details
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('cellcolor')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              cellcolor
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать цвет которым подсветится нужная строка
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.cellcolor" 
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber" 
                hide-details
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('color')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              color
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать цвет значения
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.color" 
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber"  
                hide-details
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('backgroundcolor')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              backgroundcolor
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать цвет фона
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.backgroundcolor"
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber"  
                hide-details
              />
            </div>
          </div>
          <div 
            v-if="checkOptions('name')"
            class="option-item" 
          >
            <div 
              class="name-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              name
            </div>
            <div 
              class="discribe-option item" 
              :style="{color:color.text, borderColor:color.text}"
            >
              Выбрать название кнопки
            </div>
            <div class="status-option item">
              <v-text-field 
                v-model="options.name"  
                clearable  
                :color="color.text" 
                :style="{color:color.text, background: 'transparent', borderColor: color.text}" 
                outlined 
                class="subnumber" 
                hide-details
              />
            </div>
          </div>
                    <div class="option-item" v-if="checkOptions('timeFormat')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">timeFormat</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Выбрать формат даты и времени</div>
                        <div class="status-option item">
                              <v-text-field clearable  placeholder="%Y-%m-%d %H:%M:%S"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="subnumber"  v-model="options.timeFormat"   hide-details></v-text-field>
                        </div>
                    </div>
                    <div class="option-item" v-if="checkOptions('widthTile')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">widthTile</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Введите ширину плитки</div>
                        <div class="status-option item">
                              <v-text-field clearable  placeholder="100"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="subnumber"  v-model="options.widthTile"   hide-details></v-text-field>
                        </div>
                    </div>
                    <div class="option-item" v-if="checkOptions('heightTile')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">heightTile</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Введите высоту плитки</div>
                        <div class="status-option item">
                              <v-text-field clearable  placeholder="100"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="subnumber"  v-model="options.heightTile"   hide-details></v-text-field>
                        </div>
                    </div>
                    <div class="option-item" v-if="checkOptions('fontSize')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">fontSize</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Выбрать размер шрифта</div>
                        <div class="status-option item">
                              <v-text-field clearable  placeholder="30"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="subnumber"  v-model="options.fontSize"   hide-details></v-text-field>
                        </div>
                    </div>
                    <div class="option-item" v-if="checkOptions('united')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">united</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Отображать ли все метрики на одной плоскости координат</div>
                        <div class="status-option item">
                            <v-switch   class="switch" :color="color.controls" :style="{color:color.text,}" v-model="options.united"   :label="String(options.united)" ></v-switch>
                        </div>
                    </div>
                     <div class="option-item" v-if="checkOptions('multiple')">
                        <div class="name-option item" :style="{color:color.text, borderColor:color.text}">multiple</div>
                        <div class="discribe-option item" :style="{color:color.text, borderColor:color.text}">Возможность выбора нескольких значений</div>
                        <div class="status-option item">
                            <v-switch   class="switch" :color="color.controls" :style="{color:color.text,}" v-model="options.multiple"   :label="String(options.multiple)" ></v-switch>
                        </div>
                    </div>
            </div>
            <v-card-text class="headline " v-if="tooltipSettingShow"><div class="settings-title" :style="{color:color.text,borderColor:color.text}">Настройки tooltip </div></v-card-text>
            <div class="options-block" ref="options" v-if="tooltipSettingShow">
                <div class="divider-tooltip-setting" :style="{color:color.text}" ><p>Текст</p><div :style="{backgroundColor:color.text}" class="divider-line"></div></div>  
                <v-icon class="icon-plus" :color="color.controls" v-if="tooltip.texts.length==0"  @click="addIntoTooltip('text')">{{plus_icon}}</v-icon>
                <div class="options-item-tooltip"  v-for="i in tooltip.texts.length" :key="i+'text'">
                    <v-text-field clearable  placeholder="Введите текст tooltip"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="item-text"  v-model="tooltip.texts[i-1]"   hide-details></v-text-field>
                    <v-icon class="icon-inside" :color="color.controls"  @click="addIntoTooltip('text')">{{plus_icon}}</v-icon>
                    <v-icon class="icon-inside" :color="color.controls"  @click="deleteFromTooltip('text',i-1)">{{minus_icon}}</v-icon>
                </div>
                <div class="divider-tooltip-setting" :style="{color:color.text}"><p>Ссылка</p><div :style="{backgroundColor:color.text}" class="divider-line"></div></div>  
                <v-icon class="icon-plus" :color="color.controls" v-if="tooltip.links.length==0"  @click="addIntoTooltip('link')">{{plus_icon}}</v-icon>
                <div class="options-item-tooltip"  v-for="i in tooltip.links.length" :key="i+'links'">
                    <v-text-field clearable  placeholder="Введите название ссылки"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="item-link"  v-model="tooltip.links[i-1].name"   hide-details></v-text-field>
                    <v-text-field clearable  placeholder="Введите текст ссылки"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="item-link"  v-model="tooltip.links[i-1].url"   hide-details></v-text-field>
                    <v-icon class="icon-inside" :color="color.controls"  @click="addIntoTooltip('link')">{{plus_icon}}</v-icon>
                    <v-icon class="icon-inside" :color="color.controls"  @click="deleteFromTooltip('link',i-1)">{{minus_icon}}</v-icon>
                </div>
                <div class="divider-tooltip-setting" :style="{color:color.text}"><p>Кнопка</p><div :style="{backgroundColor:color.text}" class="divider-line"></div></div>  
                <v-icon class="icon-plus" :color="color.controls" v-if="tooltip.buttons.length==0"  @click="addIntoTooltip('button')">{{plus_icon}}</v-icon>
                <div class="options-item-tooltip"  v-for="i in tooltip.buttons.length" :key="i+'button'">
                     <v-text-field clearable  placeholder="Введите название кнопки"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="item-button"  v-model="tooltip.buttons[i-1].name"   hide-details></v-text-field>
                    <v-text-field clearable  placeholder="Введите id кнопки"  :color="color.text" :style="{color:color.text, background: 'transparent', borderColor: color.text}" outlined class="item-button"  v-model="tooltip.buttons[i-1].id"   hide-details></v-text-field>  
                    <v-icon class="icon-inside" :color="color.controls"  @click="addIntoTooltip('button')">{{plus_icon}}</v-icon>
                    <v-icon class="icon-inside" :color="color.controls"  @click="deleteFromTooltip('button',i-1)">{{minus_icon}}</v-icon>
                </div>
                   
            </div>
            <v-card-actions class="actions-settings">
            <v-spacer></v-spacer>
            <v-btn small :color="color.controlsSystem" class="create-btn" @click="setOptions">Подтвердить</v-btn>
            <v-btn small :color="color.controlsActive" class="create-btn" @click="cancelModal">Отмена</v-btn>
            </v-card-actions>
        </v-card>
        </div>
    </v-dialog>
</template>

<script> 

import  settings  from '../js/componentsSettings.js'

import {    mdiPlusBox, mdiMinusBox  } from '@mdi/js'

export default {
    props: {
        idDashFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            element: '',
            options: {},
            optionsItems: [],
            tooltipSettingShow: false,
            plus_icon: mdiPlusBox,
            minus_icon: mdiMinusBox,
            tooltip : { 
                texts: [],                 
                links: [],
                buttons: [],
            }
        }
    },
      computed: { 
           active: function() {  // тут понимаем нужно ли открыть окно с созданием или нет 
                    
                   if (this.$store.getters.getModalSettings(this.idDash).status){ // если окно должно быть открыто
                    this.element = this.$store.getters.getModalSettings(this.idDash).element;  // получаем для каокго элемнета вывести настройки
                    if (this.element.indexOf('csvg') != -1) { 
                        this.tooltipSettingShow = true;
                    } else {   
                        this.tooltipSettingShow = false;
                    }
                    this.prepareOptions();  // и подготовливаем модалку на основе этого элемента
                   }
                   return this.$store.getters.getModalSettings(this.idDash).status;
           },
           idDash: function(){
               return this.idDashFrom
           },
           color: function() {
               return this.colorFrom
           },

     },
      methods: {  
          setOptions: function() {  // отправляем настройки в хранилище
          
            if(!this.options.level){
                this.options.level = 1;
            }
            
            if(typeof this.options.timeFormat != 'undefined' && this.options.timeFormat == null){
                this.options.timeFormat = '%Y-%m-%d %H:%M:%S';
            }
            if(typeof this.options.size != 'undefined') {
                if ( this.options.size == null){
                    this.options.size = '100px';
                } else if (String(this.options.size).indexOf('px') == -1) {
                    this.options.size = `${this.options.size}px`;
                } else {
                    this.options.size = this.options.size;
                }
            }
                 let options = {...{},...this.options};
            if (this.element.indexOf('csvg') != -1) {
                this.options.tooltip = this.tooltip;
                // this.options.tooltip.texts = JSON.parse(JSON.stringify(this.tooltip.texts));
                // this.options.tooltip.links = JSON.parse(JSON.stringify(this.tooltip.links));
                // this.options.tooltip.buttons = JSON.parse(JSON.stringify(this.tooltip.buttons));
            }

            this.$store.commit('setOptions',  { idDash: this.idDash, id: this.element, options: this.options });
            this.cancelModal();
          },
          cancelModal: function() {  // если нажали на отмену создания
                this.$store.commit('setModalSettings',  { idDash: this.idDash, status: false, id: '' } );
          },
          checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancelModal();
              }
          },
          checkOptions: function(option) { // проверяет есть ли такая опция уже в массиве с опциями
              return this.optionsItems.includes(option)
          },
          addIntoTooltip: function(item) {
              if (item == 'text') {
                  this.tooltip.texts.push('');
              } else if (item == 'link') {
                  this.tooltip.links.push({name:'',url:''});
              } else if (item == 'button') {
                  this.tooltip.buttons.push({name:'',id:''});
              }
          },
          deleteFromTooltip: function(item,i) {

              if (item == 'text') {
                  this.tooltip.texts.splice(i, 1);
              }  else if (item == 'link') {
                  this.tooltip.links.splice(i, 1);
              }  else if (item == 'button') {
                  this.tooltip.buttons.splice(i, 1);
              }
          },
          prepareOptions: function() {  //  понимает какие опции нужно вывести
              let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.element}); // получаем все опции 
             
              let elem = this.element.split('-')[0];  // понимаем какой тип элемента попал к нам


            //   switch (elem){  // и на основе элемнента выводи настройки для него
            //         case 'lineChart':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1,
            //             //         boxShadow: false
            //             //     }
            //             //     this.optionsItems =['visible','level','boxShadow'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //              this.optionsItems =['visible','level','boxShadow'];

            //             break;
            //         case 'table':
            //               //console.log(Object.keys(options).length);
            //             // if (Object.keys(options).length == 4) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         level: 1,
            //             //         boxShadow: false,
            //             //         change: false,
            //             //         rowcolor: '',
            //             //         columncolor: '',
            //             //         cellcolor: '',
            //             //     }
            //             //     this.optionsItems =['visible','level','boxShadow','rowcolor','columncolor','cellcolor'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     }) 
            //             // }
                            

            //             this.optionsItems =['visible','level','boxShadow','rowcolor','columncolor','cellcolor'];
                           

            //             break
            //         case 'select':

            //             this.optionsItems =['visible','level','boxShadow'];
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1,
            //             //         boxShadow: false
            //             //     }
            //             //     this.optionsItems =['visible','level','boxShadow'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

                      



            //             break;
            //         case 'picker':
            //             // if (Object.keys(options).length == 4) {

            //             //     this.optionsItems =['visible','level'];
                            
            //             //     Object.keys(options).forEach( item => {
            //             //         if (this.optionsItems.includes(item)) {
            //             //             this.options[item] = options[item];
            //             //         }
            //             //     })
                            
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //              this.optionsItems =['visible','level'];

            //             break;
            //         case 'graph':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1,
            //             //         boxShadow: false
            //             //     }
            //             //     this.optionsItems =['visible','level','boxShadow'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //             this.optionsItems =['visible','level','boxShadow'];

            //             break;
            //         case 'single':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1,
            //             //         subnumber: '',
            //             //         color: '',
            //             //         boxShadow: false
            //             //     } 
            //             //     this.optionsItems =['visible','level','subnumber','color','boxShadow'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //              this.optionsItems =['visible','level','subnumber','color','boxShadow'];

            //             break;

            //         case 'button':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1,
            //             //         color: '',
            //             //         backgroundcolor: '',
            //             //         name: '',
            //             //     } 
            //             //     this.optionsItems =['visible','level','color','backgroundcolor','name'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //              this.optionsItems =['visible','level','color','backgroundcolor','name'];

            //             break;

            //         case 'textarea':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1
            //             //     } 
            //             //     this.optionsItems =['visible','level'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //              this.optionsItems =['visible','level'];

            //             break;

            //         case 'guntt':
            //             // if (Object.keys(options).length == 3) {
            //             //     this.options = {
            //             //         visible: true,
            //             //         change: false,
            //             //         level: 1
            //             //     } 
            //             //     this.optionsItems =['visible','level'];
            //             // } else {
            //             //     this.optionsItems = [];
            //             //     Object.keys(options).forEach( item => {
            //             //         this.options[item] = options[item];
            //             //         this.optionsItems.push(item);
            //             //     })
                            
            //             // }

            //             this.optionsItems =['visible','level','timeFormat'];

            //             break;
            //   }
 
                        this.options = {}; 
                        this.optionsItems = settings.options[elem];

                         this.optionsItems.forEach( item => {
                                if (Object.keys(options).includes(item)) {
                                    if (item == 'tooltip') {
                                        this.tooltip = {};
                                        this.$set(this.tooltip,'texts', [...[],...options[item].texts]);
                                        this.$set(this.tooltip,'links', [...[],...options[item].links]);
                                        this.$set(this.tooltip,'buttons',[...[],...options[item].buttons]);
                                    } else {
                                        this.$set(this.options,item,options[item]);
                                    }
                                } else {
                                    this.$set(this.options,item,null);
                                    if (item == 'united') {
                                        this.$set(this.options,item,false);
                                    }
                                    if (item == 'multiple') {
                                        this.$set(this.options,item,false);
                                    }
                                }
                            })
                          if (!this.options.change) {
                               this.$set(this.options,'change',false);
                          }

                        
                        // if (Object.keys(options).length == 4) {
                            
                        //     this.optionsItems.forEach( item => {
                        //         if (Object.keys(options).includes(item)) {
                        //             this.options[item] = options[item];
                        //         } else {
                        //             this.options[item] = null;
                        //         }
                        //     })
                        //     this.$store.commit('setOptions',  { idDash: this.idDash, id: this.element, options: this.options });
                              
                            
                        // } else {
                        //     this.optionsItems = [];
                        //     Object.keys(options).forEach( item => {
                        //         this.options[item] = options[item];
                        //         this.optionsItems.push(item);
                        //     })
                        // }



          }
         
    },
    mounted() {
        this.$store.commit('setModalSettings',  { idDash: this.idDash, status: false, id: '' } );  
        
    },
}
</script>

<style lang="sass" > 


    @import '../sass/modalSettings.sass'  

    
</style>