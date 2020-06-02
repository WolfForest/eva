<template>
   <div class="dash-layout" :options="String(options)" :class="{show_board:props.differentOptions.visible}" :style="{boxShadow:` 0 0 5px 5px ${props.optionsBoxShadow}`}" > 
       <v-card  class="dash-block"  :style="{background:color.backElement, boxShadow:`0 3px 1px -2px ${this.color.border},0 2px 2px 0 ${this.color.border},0 1px 5px 0 ${this.color.border}`}">   
           <v-card-title class="card-title open_title" v-show="props.disappear">
               <div class="name-dash" >
                    <v-icon class="icon chart" :color="color.controls" v-show="dataMode">{{props.icons[elemIcon]}}</v-icon>
                    <div class="dash-capture">
                        <div class="dash-title"  :style="{color:color.text}" v-if="props.edit" >{{props.name}}</div>
                        <div class="dash-block-id"  :style="{color:color.text}" v-if="props.edit" v-show="dataMode">[ {{element}} ]</div>
                        <div class="dash-block-sid"  :style="{color:color.text, borderColor:color.text}" v-if="props.edit" v-show="dataMode">{{props.sid}}</div>
                        <v-text-field clearable v-if="!props.edit" :color="color.text" :style="{color:color.text}" class="dash-edit-title" v-model="props.name"   hide-details v-show="dataMode"></v-text-field>             
                    </div>
               </div>
               <div class="settings-dash-block">
                    <div class="settings-dash" :class="{settings_move:props.open_gear}">
                             <v-tooltip bottom :color="color.controlsActive"> 
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" datasource" :color="color[setColorDS]" v-on="on" @click="switchDS(props)">{{props.mdiDatabase}}</v-icon>
                                </template>
                                <span>Источник данных</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive"  >
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" resize" :color="color[props.resize_arrow_coral]"  v-on="on" @click="resizeElem(props)">{{props.mdiArrowExpandAll}}</v-icon>
                                </template>
                                <span>Изменить размер</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive"  >
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" arrow-all"  :color="color[props.arrow_coral]"  v-on="on" @click="moveElem(props)">{{props.mdiArrowAll}}</v-icon>
                                </template>
                                <span>Переместить</span>
                            </v-tooltip>
                            <v-tooltip bottom  :color="color.controlsActive" v-if="props.edit_icon">
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" pencil" :color="color.controlsInsideDash" v-on="on" @click="() => {props.edit=false; props.edit_icon=false; }">{{props.mdiPencil}}</v-icon> 
                                </template>
                                <span>Переименовать</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive" v-if="!props.edit_icon">
                                <template v-slot:activator="{ on }">
                                   <v-icon class=" check"  v-on="on"  :color="color.controlsActive" @click="editName(props)">{{props.mdiCheckBold}}</v-icon>
                                </template>
                                <span>Переименовать</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive">
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" option"  :color="color[setColorOp]"  v-on="on" @click="switchOP()">{{props.mdiSettings}}</v-icon>
                                </template>
                                <span>Настройки</span>
                            </v-tooltip>
                            <v-tooltip bottom :color="color.controlsActive">
                                <template v-slot:activator="{ on }">
                                    <v-icon class=" delete" v-on="on" :color="color.controlsInsideDash"  @click="deleteDashBoard(props)">{{props.mdiTrashCanOutline}}</v-icon>
                                </template>
                                <span>Удалить</span>
                            </v-tooltip>
                    </div>
                    <!-- <div class="gear-move" >
                        <v-icon class=" gear" :class="{open_gear:props.open_gear}" @click="openSettings">{{props.mdiSettings}}</v-icon>
                    </div> -->
               </div>
               
           </v-card-title>
           <!-- <v-divider :style="{borderColor:color.text, opacity: '0.2'}"  v-show="props.disappear" class="divider" ><div class="loading-bar " :class="{loading:true}"></div></v-divider> -->
            <div class="loading-block" v-if="!props.hideLoad">
                <div :style="{borderColor:color.text, opacity: '0.2'}"   v-show="props.disappear" class="loading-divider" :class="{loading:loadingSearch,loading:props.loading,noBorder:!dataMode}" ><div class="loading-bar " :style="{background: color.controlsActive}" ></div></div>
            </div>
           <!-- <div class="divider" @click="openTitle" :class="{divider_open:props.open_title}"> 
                <v-icon class=" divider-icon "  >{{props.arrow.elem}}</v-icon>
           </div> -->
            <v-card-text class="card-text"  v-show="!showElement">
                <button class="selectDS" :style="{color: 'white', background: color.controls}" @click="chooseDS()">Выберите источник данных</button>
            </v-card-text>
             <!-- В этой строке подключается элемент визуализации -->
            <v-card-text class="card-text element-itself" :colorFrom="color" :is="currentElem" :style="{color:color.text, background:'transparent'}"  :idFrom="element"   :idDashFrom="idDash"   v-show="showElement" :dataRestFrom="props.dataRestFilter" :dataModeFrom="dataMode" :shouldFrom="shouldGet" :prepareFrom="prepareData"  @hideDS="hideDS($event)" @setVissible="setVissible($event)" @setLoading="setLoading($event)" @hideLoading="props.hideLoad = true" :timeFormatFrom="props.timeFormat"  :sizeTileFrom="props.sizeTile" :tooltipFrom="props.tooltip"  :widthFrom="width" :heightFrom="height"  > </v-card-text>
             <!-- ------------>
            <!-- <v-card-text class="card-text options" ref="option" :style="{background: color.backElement,color:color.text, border: `1px solid ${color.border}`}" :class="{open_options:!props.showOptions}" >
                 <div class="title-optios" :style="{color:color.text}">Настройки</div>
                 <v-divider :style="{borderColor:color.text, opacity: '0.2'}"></v-divider>
                 <div class="options-block">
                    <div class="option-item">
                        <div class="name-option main item" :style="{color:color.text, borderBottom: `1px solid ${color.text}`}">Название</div>
                        <div class="discribe-option main item" :style="{color:color.text, borderBottom: `1px solid ${color.text}`}">Описание</div>
                        <div class="status-option main item" :style="{color:color.text, borderBottom: `1px solid ${color.text}`}">Статус</div>
                    </div>
                     <div class="option-item">
                        <div class="name-option item">visible</div>
                        <div class="discribe-option item">Показывает / скрывает элемент</div>
                        <div class="status-option item">
                            <v-switch   class="switch" :color="color.controls" :style="{color:color.text}" v-model="props.options.visible" @change="setOption('visible')"  :label="String(props.options.visible)" ></v-switch>
                        </div>
                    </div>
                    <div class="option-item">
                        <div class="name-option item">boxShadow</div>
                        <div class="discribe-option item">Добавляет / удаляет тень</div>
                        <div class="status-option item">
                            <v-switch   class="switch" color="teal" v-model="props.options.boxShadow" @change="setOption('boxShadow')"  :label="String(props.options.boxShadow)" ></v-switch>
                        </div>
                    </div>

                            
                    
                 </div>
            </v-card-text> -->
           <!-- <dash-board-inside ref="inside_dash" :data-id="id" v-show="!search_code" ></dash-board-inside>
           <dash-search-code :data-id="id" v-show="search_code"></dash-search-code> -->
       </v-card>
       <!-- <dash-code :data-id="id" :width="width"  :class="{transition: props.transition}" ></dash-code> -->
    </div> 
</template>

<script>

import { mdiPencil,mdiCheckBold, mdiClose,  mdiArrowAll, mdiArrowExpandAll,  mdiCodeTags, mdiTrashCanOutline, mdiDatabase, mdiSettings, mdiChevronDown, mdiChevronUp } from '@mdi/js'

import  settings  from '../js/componentsSettings.js'

export default {
    props: {
        colorFrom: null,
        width: null,
        height: null,
        idDashFrom: null,
        dataElemFrom: null,
        dataModeFrom: null,
        dataPageFrom: null,
    },
    data () {
        return {
            props: {
                id: '', 
                sid: '', 
                name: '',
                mdiPencil: mdiPencil,
                mdiCheckBold : mdiCheckBold ,
                mdiClose: mdiClose,
                mdiArrowAll:  mdiArrowAll,
                mdiArrowExpandAll: mdiArrowExpandAll,
                mdiCodeTags:  mdiCodeTags,
                mdiTrashCanOutline: mdiTrashCanOutline,
                mdiDatabase: mdiDatabase,
                mdiSettings: mdiSettings,
                mdiChevronUp:  mdiChevronUp,
                mdiChevronDown: mdiChevronDown,
                icons: {

                },
                edit: true,
                edit_icon: true,
                move_elem: true,
                resize_elem: true,
                datasource_elem: true,
                showOptions: true,
                arrow_coral: 'controlsInsideDash',
                resize_arrow_coral: 'controlsInsideDash',
                code_coral: 'fill:teal',
                transition: true,
                element: '',
                page: '',
                dataRest: [],
                dataRestFilter: [],
                loading: false,
                open_gear: true,
                arrow: {
                    direct: 'down',
                    elem: mdiChevronDown
                },
                open_title: false,
            //     customdata: [
            //        {
            //             '_time': 1574260841,
            //             'line1': 1,
            //             'line2': 1.2,
            //             'line3': 1.5,
            //        },
            //        {
            //             '_time': 1574260842,
            //             'line1': 2,
            //             'line2': 2.3,
            //             'line3': 3.5,
            //        },
            //        {
            //             '_time': 1574260843,
            //             'line1': 2.2,
            //             'line2': 3.2,
            //             'line3': 3.7,
            //        },
            //        {
            //             '_time': 1574260844,
            //             'line1': 2.4,
            //             'line2': 3.6,
            //             'line3': 3.9,
            //        },
            //        {
            //             '_time': 1574260845,
            //             'line1': 3,
            //             'line2': 4.2,
            //             'line3': 4.5,
            //        },
            //    ],
               options: {
                   visible:  true,
                   change: false,
                   level: 1,
                   boxShadow: false,
               },
               optionsBoxShadow: 'transparent',
               differentOptions: {
                   visible: true,
               },
               disappear: true,
               timeFormat: '',
               sizeTile: {},
               hideLoad: false,
               tooltip: {},
            }
        }
    },
    asyncComputed: {
        async prepareData() {  // подготавливаем данные для отображения
               if (this.shouldGet) {
                    let searchId = this.$store.getters.getSearchID({idDash: this.idDash, id: this.element});
                    let searchName = `${this.idDash}-${searchId}`;
                    searchId == -1 ? this.props.sid = '': this.props.sid = searchId;

                    if (searchId != -1){
                        let result = await this.getData(searchName);
                        this.props.dataRest = result;
                       // this.props.dataRest.status = !this.props.dataRest.status;
                        this.$store.commit('setShould', { idDash: this.idDash,  id: this.element, status: false});
                       
                        return result
                    } else {
                       
                       this.$store.commit('setShould', { idDash: this.idDash,  id: this.element, status: false}); 
                    }
    
               }
               
               if (this.props.dataRest.length > 0) {
                    this.checkFilter();
               }
               
        },
    },
     computed: {
        idDash: function() { // получаем id страницы от родителя 
            return this.idDashFrom
        },
        element:  function() {  // получаем название элемента
        
            return this.dataElemFrom
        },
        dataMode: function() {
            this.changeOptions(this.dataModeFrom);
            if (!this.dataModeFrom) {
                if (this.element.split('-')[0] == 'button' || this.element.split('-')[0] == 'csvg' || this.element.split('-')[0] == 'tile') {
                    this.props.disappear = false;
                }
            } else {
                this.props.disappear = true;
            }
            return this.dataModeFrom
        },
        color: function() {
            return this.colorFrom
        },
        currentElem: function() { // создаем некий тег элемнета который хотим добавтиь чтобы он был вида типа dash-table
            if (this.element) {
                let element = this.element.split('-')[0];
                return `dash-${element}`
            }    
        },
        loadingSearch: function() {
            this.setLoading(this.$store.getters.getLoading( this.element, this.idDash));
            return this.$store.getters.getLoading( this.element, this.idDash);
        },
        elemIcon: function() {
            if (this.element) {
                return this.element.split('-')[0];
            }   
        },
        setColorDS: function() {  // переключаем цвет иконок
             if (!this.showElement){
                        return 'controlsActive';
                    } else {
                        return  'controlsInsideDash';
                    }
        },
        setColorOp: function() {  // переключаем цвет иконок
             if (!this.props.showOptions){
                        return 'controlsActive';
                    } else {
                        return  'controlsInsideDash';
                    }
        },
        showElement: function() {  // понимаем нужно ли переключать элемент между выбором ИС и самими данными 
             if (this.element) {
                return this.$store.getters.getSwitch({idDash: this.idDash, id: this.element});
             }
        },
        shouldGet:  function() {  // понимаем нужно ли запрашивтаь данные с реста
                if (this.element){
                    return this.$store.getters.getShouldGet({id:this.element, idDash: this.idDash});
                }
        },
        options: function() {
          
           let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.element});
            
            //if (Object.keys(options).length > 4) { 
                  
                Object.keys(options).forEach( item => {
                    this.props.options[item] = options[item];
                })

                if (this.props.options.timeFormat) {
                    this.props.timeFormat = this.props.options.timeFormat;
                }
                if (this.props.options.widthTile) {
                    this.$set(this.props.sizeTile,'width',this.props.options.widthTile);
                } else {
                    this.$set(this.props.sizeTile,'width','');
                }
                if (this.props.options.heightTile) {
                    this.$set(this.props.sizeTile,'height',this.props.options.heightTile);
                }  else {
                    this.$set(this.props.sizeTile,'height','');
                }
                if (this.props.options.tooltip) {
                    //console.log('asdasd')
                    //let options = {...{},...this.props.options.tooltip};
                    // this.props.tooltip.texts = [];
                    // this.props.tooltip.links = [];
                    // this.props.tooltip.buttons = [];
                    Object.keys(this.props.options.tooltip).forEach( item => {
                        this.$set(this.props.tooltip,item,this.props.options.tooltip[item]);
                        // this.props.tooltip[item] = this.props.options.tooltip[item];
                    })
                } else {
                    this.$set(this.props.tooltip,'texts',[]);
                    this.$set(this.props.tooltip,'links',[]);
                    this.$set(this.props.tooltip,'buttons',[]);
                }

                this.$emit('SetLevel',this.props.options.level)

                

            // }  else {
            //     this.props.options.change = !this.props.options.change;
            // }
          
            this.setShadow();

            return options.change
        }
     },
     methods: {
            // searchID: function() {
            //     //if (this.element) { 
            //         console.log('adad');
                    
            //         return this.$store.getters.getSearchID({idDash: this.idDash, id: this.element});
            //    // }
            // },
            editName: function (props) {  // изменяем имя элемнета
                props.edit=true; 
                props.edit_icon=true;
                this.$store.commit('setNameDash', {name: props.name, id: this.element, idDash: this.idDash });
            },
            moveElem: function (props) {  // переключаем режим разрешения перемещения элемента 
                if (props.move_elem) {
                      props.arrow_coral = 'controlsActive';
                      this.$emit('moveElem');  // так как это переключается у родителя, мы вынуждены вызывать событие на родителе и передавтаь туда данные
                      props.move_elem = !props.move_elem;
                } else {
                    props.arrow_coral = 'controlsInsideDash';
                    this.$emit('moveElem');
                    this.$emit('sendMove');
                    props.move_elem = !props.move_elem;
                }
            },
             resizeElem: function (props) {  // тоже самое для режима изменения размера
                if (props.resize_elem) {
                    props.resize_arrow_coral = 'controlsActive';
                    props.transition = !props.transition;
                    this.$emit('resizeElem');
                    props.resize_elem = !props.resize_elem;
                } else {
                    props.resize_arrow_coral = 'controlsInsideDash';
                    props.transition = !props.transition;
                    this.$emit('resizeElem');
                    this.$emit('sendSize');
                    props.resize_elem = !props.resize_elem;
                }
            },
            chooseDS: function() {  // открываем модальное окно с выбором ИС (источник данных)
                this.$store.commit('setModalSearch',  { id: this.idDash, status: true, elem: this.element } );
            },
            switchDS: function ( props ) {  // переключаем между режимами выбора данных и их отображением
                   // this.$store.commit('setSearch', { id: this.id, status: !this.search_code});
                   let status = !this.showElement;
                   this.$store.commit('setSwitch',  { idDash: this.idDash, status: status, id: this.element } );
            },
            switchOP: function() {
                this.$store.commit('setModalSettings',  { idDash: this.idDash, status: true, element: this.element } );
            },
            setShadow: function() {
                if (this.props.options.boxShadow) {
                     this.props.optionsBoxShadow =  this.color.controlsActive;
                    } 
                else{ 
                     this.props.optionsBoxShadow =  `transparent`;
                    }
            },
            setLoading: function(event) {
                this.props.loading = event;
            },
            // setOption: function(elem) {
            //         // let label = this.props.options[elem].label;
            //         // this.props.options[elem].label = this.props.options[elem].label_not;
            //         // this.props.options[elem].label_not = label;
            //         if (this.props.options.boxShadow) {
            //             this.props.optionsBoxShadow = this.color.controlsActive;
            //         } else {
            //            this.props.optionsBoxShadow = 'transparent';
            //         }
            //         this.$store.commit('setOptions',  { idDash: this.idDash, id: this.element, options: this.props.options });

            // },
            deleteDashBoard: function ( props ) { // вызываем окно для удаления элемнета
                this.$store.commit('setModalDelete', { id: this.idDash, status: true, elem: this.element, name: props.name, page:  this.dataPageFrom}); 

                //this.$store.commit('deleteDashBoard', { idDash: this.idDash,  id: this.element }); 
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
                                resolve([])
                            }
                        //    console.log("Сёрч получен", query.result);
                            };

                            query.onerror = function() {
                            console.log("Ошибка", query.error);
                            };

                          
                            

                        };    

                     

                });

                return promise
                  // promise.then навешивает обработчики на успешный результат или ошибку
                      

            // this.props.loading = true;  // включаем полосу загрузки


                    
            
            
            
             
             
            //     let response = await this.$store.getters.getDataAPI({id:this.element, idDash: this.idDash});  // собственно проводим все операции с данными 
            //     // вызывая метод в хранилище

               
            
            //  if ( response.status != 200) {  // если что-то пошло не так 
            //    // this.props.superheroes = [];
            //     this.props.dataRest = {error: response.statusText} // возвращаем статус ошибки
            //     //this.props.loading = false;
            //     this.$store.commit('setShould', { idDash: this.idDash,  id: this.element, status: false}); // выключаем режи получения данных
            //     this.props.loading = false;  // выключаем строку загрузки
            //  } else {  // если все нормально
            //     this.props.dataRest = response.result;  // заносим данные
            //     //this.props.dataRest = this.props.customdata;
            //     this.$store.commit('setShould', { idDash: this.idDash,  id: this.element, status: false});  // выключаем режим получения данных
            //     this.props.loading = false;  // выключаем полосу загрузки
            //  }
         },
        //  openSettings: function() {  
        //     this.props.open_gear = !this.props.open_gear;
        //  },
         openTitle: function() {  // открываем закрываем шапку элемнета
             if(this.props.arrow.direct == "up") {
                    this.props.arrow.elem = this.props.mdiChevronDown;
                    this.props.arrow.direct = "down";
             }  else {
                 this.props.arrow.elem = this.props.mdiChevronUp;
                 this.props.arrow.direct = "up";
             }
             this.props.open_title = !this.props.open_title;
         },
         hideDS: function(event) {  // функция которая для определенного элемента сразу вносит ряд настроек визуализации=
             this.$store.commit('setSwitch',  { idDash: this.idDash, status: true, id: this.element } ) ;  // сразу переключаем элемнет на отображение данных,
         },
         setVissible: function(event){
            if (event.split('-')[0] == 'picker' || event.split('-')[0] == 'guntt') {   // собственно если элемнет выбора даты и времен
                  // поскольку запроса данных никакого не надо
                  this.$el.querySelector('.dash-block').style.overflow ='visible'; // и еще меняем скрытие элемнета,  чтобы раскрывающийся список вылазхил из него
            }
         },
         changeOptions: function(mode) {
            let level = this.props.options.level;
             if(mode) {
                 this.props.differentOptions.visible = true;
             } else {
                 if (!this.props.options.visible) {
                     this.props.differentOptions.visible = false;
                     level = '-1';
                 } else {
                     this.props.differentOptions.visible = true;
                 }
             }
             this.$emit('SetLevel',level);
         },
         checkFilter: function() {
             let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'OnDataCompare', element: this.element});
             let data = [];
             let incl = false;
             let columnDel = '';
             let event = {};
             this.props.dataRestFilter = [];
             

              events.forEach( item => {
                  event = {...{},...item};
                  
                  if(event.prop == 'filter' && event.value == 'true') {
                      data = JSON.parse(JSON.stringify(this.props.dataRest));
                   
                       event.row =  event.row.replace(/\[|\]/g, '').split(',');
                     
                     if (event.column.indexOf('!') != -1) {
                        columnDel = event.column.replace('!', '');
                         this.props.dataRest.forEach( (itemFil,i) => {
                                if (Object.keys(itemFil).includes(columnDel)) {
                                    
                                    //data[i] = JSON.parse(JSON.stringify(this.props.dataRest[i]));
                                    delete data[i][columnDel]
                                }
                         });
                     } else  {
                         switch(event.compare) {
                             case 'equals':
                                let notArr = [];
                                event.row.forEach( notElem => {
                                    if ( notElem.indexOf('!') != -1) {
                                        notArr.push(notElem.substr(1));
                                    }
                                })
                                if (event.column != '') {
                                    data = data.filter( itemFil => {
                                        if (notArr.length != 0) {
                                            if (!notArr.includes(String(itemFil[event.column]))) {
                                                return itemFil
                                            } 
                                        } else {
                                            if (event.row.includes(String(itemFil[event.column]))) {
                                                return itemFil
                                            } 
                                        }
                                        
                                    });

                                } else {
                                    data = data.filter( itemFil => {

                                        if (notArr.length != 0) {
                                            incl = true;
                                            Object.values(itemFil).forEach( val => {
                                                if(notArr.includes(String(val))) {
                                                    incl = false;
                                                }
                                            })
                                        } else {
                                            incl = false
                                            Object.values(itemFil).forEach( val => {
                                                if(event.row.includes(String(val))) {
                                                    incl = true;
                                                }
                                            })
                                        }
                                        if (incl) {
                                            return itemFil
                                        }
                                    });
                                }
                             break
                             case "over":
                                if (event.column != '') {
                                    data = data.filter( itemFil => {
                                        incl = true;
                                        event.row.forEach( row => {
                                            if ( parseFloat(itemFil[event.column]) <= parseFloat(row)) {
                                                incl = false;
                                            }
                                        })
                                        if (incl) {
                                           return itemFil
                                        }
                                    });

                                }
                             break
                             case "less":
                                if (event.column != '') {
                                    data = data.filter( itemFil => {
                                        incl = true;
                                        event.row.forEach( row => {
                                            if ( parseFloat(itemFil[event.column]) >= parseFloat(row)) {
                                                incl = false;
                                            }
                                        })
                                        if (incl) {
                                           return itemFil
                                        }
                                    });

                                }
                             break
                             case 'in':
                                if (event.column != '') {
                                    data = data.filter( itemFil => {
                                        if (event.row.includes(String(itemFil[event.column]))) {
                                            return itemFil
                                        } 
                                    });

                                } else {
                                    data = data.filter( itemFil => {
                                        incl = false
                                        Object.values(itemFil).forEach( val => {
                                            if(event.row.includes(String(val))) {
                                                incl = true;
                                            }
                                        })
                                        if (incl) {
                                            return itemFil
                                        }
                                    });
                                }
                             break
                             case "between":
                                if (event.column != '') {
                                    data = data.filter( itemFil => {
                                        incl = false;
                                        let min,max;
                                        if(parseFloat(event.row[0]) > parseFloat(event.row[1])) {
                                             max = event.row[0]; 
                                             min = event.row[1];
                                        } else {
                                             max = event.row[1]; 
                                             min = event.row[0];
                                        }
                                        if ( parseFloat(itemFil[event.column]) > min && parseFloat(itemFil[event.column]) < max){
                                            incl = true;
                                        }
                                        if (incl) {
                                           return itemFil
                                        }
                                    });
                                }
                             break
                         }
                     }

                    if (this.props.dataRestFilter.length == 0) {
                        this.props.dataRestFilter = [...this.props.dataRestFilter ,...data];
                    } else {  // если в массив результирующем уже что-то было, то надо добавить только новые элементы
                        data.forEach( itemData => {    // пробегаемся по все мотфильтрвоанным элементам
                            let equal = false; // переменная которая скажет встречается ли такая строка уже в выборке
                            let keys = Object.keys(itemData);  // ключи объекта внутри фильтрованного массива
                            this.props.dataRestFilter.forEach( itemDataRest => {  // пробегаемся пов сем отфильтрованным данным
                                let equalRest = true;  // переменная которая скажет полностью совпал объект внутри результирующего массива
                                keys.forEach( key => {  // пробегаемся по кажлому полю в объекте
                                    if (itemData[key] != itemDataRest[key]){  // если значения поля из только что отфильтрованного массива, не равно значени в уже до
                                                                            // этого отфильтрованном массиве, то значит что строка не полностью совпала, а значит строки не равны
                                        equalRest = false;   // поэтому присваиваем переменной значение мол строки отличаются
                                    }
                                })
                                if (equalRest) {  // а вот если строка в только что отфлильтрованном массиве полностью совпала со строкой в уже до этого отфильтрованном
                                    equal = true;  // то присваиваем true переменной которай говорит что такая строка уже есть
                                }
                            })
                            if (!equal) {  // и вот если такой строки все же нет
                                this.props.dataRestFilter.push(itemData); // то смело добовляем ее в результирующий массив
                            }
                        })
                    }
                  }
                         
             })

             if (data.length == 0) {
                 this.props.dataRestFilter = JSON.parse(JSON.stringify(this.props.dataRest));
             }
             
         }
    },
    mounted() {
       this.props.icons = settings.icons;
       this.page = this.$parent.$el.getAttribute('data-page');  // понимаем какая страница перед нами
       this.props.name = this.$store.getters.getNameDash({idDash: this.idDash, id: this.element}); // получаем имя этой страницы
     //  this.$store.commit('setSearchStatus',  { idDash: this.idDash, id: this.element }); // если ИС прикреплен был заранее то сразу можно получить и данные

    //    let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.element});
    //    if (Object.keys(options).length > 1) {
    //        this.props.options = options;
    //    } else {
    //        this.props.options.change = options.change;
    //        console.log('new');
    //    }

       if (this.props.options.boxShadow) {
            this.props.optionsBoxShadow = this.color.controlsActive;
        } else {
            this.props.optionsBoxShadow = 'transparent';
        }

            this.$store.commit('setShould', { idDash: this.idDash,  id: this.element, status: true});
        
    }   
}


</script>

<style lang="sass" > 
  
    @import '../sass/dashBoard.sass'
   
  
</style>