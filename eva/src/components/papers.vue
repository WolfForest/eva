<template>
  <v-app 
    class="papers-app-main" 
    :style="{background: color.back}"
  >
    <header-top @setUsername="setUsername($event)" />
    <v-content>
      <v-container class="main-container container-paper">
        <div 
          class="paper-block" 
        >
          <v-card 
            class="file-block" 
            :data-ready="dataReady"
            :style="{background: color.backElement, color: color.text}"
          >
            <div
              v-show="fileBlock==1"
              class="buttons-file-block"
            >
              <v-btn 
                small 
                :color="color.controls" 
                class="file-btn" 
                @click="fileBlock=2;uploadFile=''"
              >
                Загрузить отчет
              </v-btn>
              <v-btn 
                small 
                :color="color.controls" 
                class="file-btn" 
                @click="getAllPapers"
              >
                Выбрать отчет
              </v-btn>
            </div>
            <div
              v-show="fileBlock==2"
              class="load-file-block"
            >
              <v-icon
                :color="color.controls"
                class="arrow-back"
                medium
                @click="fileBlock=1"
              >
                {{ arrowBack }}
              </v-icon>
              <v-file-input 
                :style="{color: color.text,fill: color.text}" 
                :color="color.controls" 
                class="file-load-itself" 
                hide-details  
                outlined 
                label="Загрузить отчет"
                @change="uploadFile=$event"
              />
              <div 
                class="error-msg" 
                :class="{showError:showError}"
                :style="{color:color.controls}"
              >
                {{ errorMsg }}
              </div>
              <v-btn 
                small 
                :color="color.controls" 
                class="file-load-btn" 
                @click="setPaper"
              >
                Отправить отчет
              </v-btn>
            </div>
            <div
              v-show="fileBlock==3"
              class="get-file-block"
            >
              <v-icon
                :color="color.controls"
                class="arrow-back"
                medium
                @click="returnArrow"
              >
                {{ arrowBack }}
              </v-icon>
              <v-autocomplete 
                v-model="selectedFile" 
                :items="allFiles"  
                outlined 
                :style="{color:color.text, fill: color.text}"
                :color="color.controls" 
                hide-details  
                class="file-get-itself"
                label="Выбрать отчет"  
                @click="changeColor" 
              />
              <div 
                class="error-msg" 
                :class="{showError:showError}"
                :style="{color:color.controls}"
              >
                {{ errorMsg }}
              </div>
              <v-btn 
                small 
                :color="color.controls" 
                class="file-get-btn" 
                @click="choosePaper"
              >
                Получить отчет
              </v-btn>
            </div>
          </v-card>
          <v-card 
            class="search-block" 
            :style="{background: color.backElement, color: color.text}" 
          >
            <v-card-text 
              class="search-card-block" 
              :style="{background: color.backElement, color: color.text}"
            >
              <div 
                class="loading-divider" 
                :class="{loading:loading}" 
              > 
                <div 
                  class="loading-bar " 
                  :style="{background: color.controls}" 
                />
              </div>
              <v-textarea 
                ref="search" 
                v-model="search.original_otl"  
                solo 
                spellcheck="false" 
                flat 
                no-resize 
                hide-details 
                :data-ready="dataReady"
                :rows="rowsCount"
                :style="{background: color.backElement, color: `${color.text} !important`}" 
                placeholder="Введите запрос" 
              />
              <v-tooltip 
                bottom 
                :color="color.controlsActive" 
              >
                <template v-slot:activator="{ on }">
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
                    <v-icon>{{ play }}</v-icon>
                  </v-btn>
                </template>
                <span>Запустить</span>
              </v-tooltip>
              <v-tooltip 
                bottom 
                :color="color.controlsActive"  
              >
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
                    <v-icon>{{ gear }}</v-icon>
                  </v-btn>
                </template>
                <span>Настройки</span>
              </v-tooltip>
            </v-card-text>
          </v-card>
          <v-card
            ref="stepper"
            class="stepper-paper"
            :style="{background: color.backElement, color: color.text}"
          >
            <v-stepper 
              ref="steppers"
              v-model="move"
              alt-labels 
            >
              <v-stepper-header>
                <v-stepper-step 
                  step="1" 
                  :complete="steps['1'].complete"
                  :color="steps['1'].status"
                  :rules="steps['1'].error" 
                >
                  Готов к работе
                </v-stepper-step>

                <div 
                  :style="{borderColor:color.text}"   
                  class="loading-divider" 
                  :class="{loading:steps['1'].loading}" 
                >
                  <div 
                    class="loading-overlay"
                    :style="{background: color.text}"  
                  />
                  <div 
                    class="loading-bar " 
                    :style="{background: color.controls}" 
                  />
                </div>

                <v-stepper-step 
                  step="2" 
                  :complete="steps['2'].complete"
                  :color="steps['2'].status"
                  :rules="steps['2'].error" 
                >
                  Получаю данные об отчете
                </v-stepper-step>

                <div 
                  :style="{borderColor:color.text}"   
                  class="loading-divider" 
                  :class="{loading:steps['2'].loading}" 
                >
                  <div 
                    class="loading-overlay"
                    :style="{background: color.text}"  
                  />
                  <div 
                    class="loading-bar " 
                    :style="{background: color.controls}" 
                  />
                </div>

                <v-stepper-step 
                  step="3"
                  :complete="steps['3'].complete"
                  :color="steps['3'].status"
                  :rules="steps['3'].error" 
                >
                  {{ steps['3'].text }}
                </v-stepper-step>

                <div 
                  :style="{borderColor:color.text}"   
                  class="loading-divider" 
                  :class="{loading:steps['3'].loading}" 
                >
                  <div 
                    class="loading-overlay"
                    :style="{background: color.text}"  
                  />
                  <div 
                    class="loading-bar " 
                    :style="{background: color.controls}" 
                  />
                </div>

                <v-stepper-step 
                  step="4"
                  :complete="steps['4'].complete"
                  :color="steps['4'].status"
                  :rules="steps['4'].error" 
                >
                  Обрабатываю отчет
                </v-stepper-step>
              </v-stepper-header>
            </v-stepper>
          </v-card>
          <v-card
            ref="vis" 
            class="static-vis" 
            :style="{background: color.backElement, color: color.text}"
          >
            hello kitty
          </v-card>
        </div>
      </v-container> 
    </v-content>
    <footer-bottom />
    <modal-report 
      :colorFrom="color" 
      :modalFrom="modal" 
      :searchFrom="search"
      @cancelModal="cancelModal" 
      @setSearch="setSearch($event)" 
    />
  </v-app>
</template>


<script>

import { mdiPlay, mdiSettings, mdiArrowLeftBold , mdiPlus } from '@mdi/js'
//import  settings  from '../js/componentsSettings.js';
import themes from '../js/themeSettings.js';

export default {

  data () {
    return {
      search: {
        parametrs: {}
      },
      play: mdiPlay,
      plus: mdiPlus,
      gear: mdiSettings,
      modal: false,
      loading: false,
      rows: [],
      data: [
        {name: 'Kitty', date: '12 апреля 2020'}
      ],
      size: {
        width: 0,
        height: 0,
      },
      aboutElem: {},
      rowsCount: 9,
      color: { },
      fileBlock: 1,
      arrowBack: mdiArrowLeftBold,
      uploadFile: '',
      showError: false,
      errorMsg: 'Выберите файл',
      steps: {
        "1": {
          complete: true,
          status: '',
          loading: false,
          error: [],
        },
        "2": {
          complete: true,
          status: '',
          loading: false,
          error: [],
        },
        "3": {
          complete: false,
          status: '',
          loading: false,
          error: [],
          text: 'Выбрать отчет'
        },
        "4": {
          complete: false,
          status: '',
          error: [],
          text: 'Обработать отчет'
        }
      },
      move: '2',
      selectedFile: '',
      allFiles: []
    } 
  },
  
  computed: { 
    // getDataRest:  function() {
    //   if (this.shouldGet) {
    //     console.log(this.getDataAsynchrony());
    //   }
    //   return 'done'
    // },
    // shouldGet: function() {  // понимаем нужно ли запрашивтаь данные с реста
    //   return this.$store.getters.getShouldGet({id: 'table', idDash: 'reports'})
    // },
    // elements: function() {
           
    //   this.$store.getters.getReportElement.forEach( (item,i) => {
    //     this.$set(this.aboutElem,item,{});
    //     if (i == 0) {
    //       this.$set(this.aboutElem[item],'show',true);
    //       this.$set(this.aboutElem[item],'color',this.color.controls);
    //     } else {
    //       this.$set(this.aboutElem[item],'show',false);
    //       this.$set(this.aboutElem[item],'color',this.color.text);
    //     }
    //     this.$set(this.aboutElem[item],'tooltip',settings.reports[item].tooltip);
    //     this.$set(this.aboutElem[item],'icon',settings.reports[item].icon);
    //     this.$set(this.aboutElem[item],'key',i);
    //   })
    //   this.activeElem = 'table';
    //   return this.$store.getters.getReportElement
    // },
    dataReady: function() {
      if (this.data.length != 0 && this.steps['3'].complete) {
        this.getPaper();
      }
      return true
    }, 
    theme: function() {
      return this.$store.getters.getTheme
    }
  },  
  watch: {
    theme: function (theme) {
      this.color = themes[theme];
    },
  }, 
  methods: {
    setPaper: async function() {
      if (this.uploadFile == '') {
        this.message("Выберите файл");
      } else {
        let formData = new FormData();
        formData.append('file', this.uploadFile);
        let result = await this.$store.getters.loadPaper(formData);
        try {
          if (JSON.parse(result).status == 'success') {
            this.message("Файл успшено загружен");
          } else {
            this.message("Ошибка при загрузке файла");
          }

        } catch (error) {
          this.message(`Ошибка: ${error}`);
        }
      }
      
    },
    choosePaper: async function() {
      if (this.selectedFile == '') {
        this.message("Выберит файл");
      } else {
        this.steps['2'].loading = false;
        this.steps['3'].complete = true;
        this.steps['3'].text = "Отчет выбран";
        this.returnArrow();
      }
    },
    message: function(text) {
      this.errorMsg = text;
      this.showError = true;
      setTimeout( () =>{
        this.showError = false;
      },2000)
    },
    getPaper: async function() {
      this.move=4;
      this.steps['3'].loading = true;
      this.steps['4'].text = 'Обрабатываю отчет';

      let formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('data', JSON.stringify(this.data[0]));
      let result = await this.$store.getters.getPaper(formData);
      try {
        if (JSON.parse(result).status == 'success') {
          this.createCsv(JSON.parse(result).file)
          // this.allFiles = JSON.parse(result).files;
        } else {
          // this.errorMsg = "Список отчетов получить не удалось. Вернитесь назад и попробуйте снова.";
          // this.showError = true;
          // this.steps['2'].loading = false;
          // this.steps['3'].error = [() => false];
          // this.steps['3'].text = 'Ошибка получения списка';
        }

      } catch (error) {
        this.message(`Ошибка: ${error}`);
      }

    },
    getAllPapers: async function() {
      this.selectedFile = '';
      this.fileBlock=3;
      this.move=3;
      this.steps['2'].loading = true;
      this.steps['3'].complete = false;
      this.steps['3'].text = 'Проверяю наличие отчета';
      
      let result = await this.$store.getters.getAllPaper();
      try {
        if (JSON.parse(result).status == 'success') {
          this.allFiles = JSON.parse(result).files;
        } else {
          this.errorMsg = "Список отчетов получить не удалось. Вернитесь назад и попробуйте снова.";
          this.showError = true;
          this.steps['2'].loading = false;
          this.steps['3'].error = [() => false];
          this.steps['3'].text = 'Ошибка получения списка';
        }

      } catch (error) {
        this.message(`Ошибка: ${error}`);
      }
    },
    createCsv: function(csvFrom) {
      let csv = JSON.parse(csvFrom);

      let csvContent = "data:text/csv;charset=utf-8,"; // задаем кодировку csv файла
        // let keys = Object.keys(res[0]); // получаем ключи для заголовков столбцов
        // csvContent += encodeURIComponent(keys.join(',') + "\n"); // добавляем ключи в файл

      console.log(csv)
      // Object.values(csv).forEach( item =>  {

      //   console.log(Object.values(item).join(","))

      // })
      csvContent += "hello kitty\nhello";
      // csvContent += encodeURIComponent(Object.values(csv).map( item =>  Object.values(item).join(",")).join("\n")); // добовляем все значения по ключам в файл
      let link = this.$refs.stepper.$el.appendChild(document.createElement("a")); // создаем ссылку
      link.setAttribute('href', csvContent); // указываем ссылке что надо скачать наш файл csv
      link.setAttribute("download", `test.xlsx`); // указываем имя файла 
      link.click(); // жмем на скачку
      link.remove(); // удаляем ссылку 
    },
    returnArrow: function() {
      this.fileBlock=1;
      this.steps['3'].error = [];
      if (this.selectedFile == '') {
        this.move=2;
        this.steps['3'].text="Выбрать отчет";
        this.steps['2'].loading = false;
        this.steps['3'].complete = false;
      }
    },
    
    
    // getData: function() {

    //   let blob = new Blob([`onmessage=${this.getDataFromDb().toString()}`], { type: "text/javascript" }); // создаем blob объект чтобы с его помощью использовать функцию для web worker

    //   let blobURL = window.URL.createObjectURL(blob); // создаем ссылку из нашего blob ресурса

    //   let worker = new Worker(blobURL); // создаем новый worker и передаем ссылку на наш blob объект

    //   worker.onmessage = function(event) { // при успешном выполнении функции что передали в blob изначально сработает этот код

  
    //     let statistic = '';
    //     this.rows = [];
    //     if (event.data.data.length != 0) {
          
    //       this.shema = event.data.shema;
    //       this.data = event.data.data;

    //       let text = '';
    //       Object.keys(this.shema).forEach( (item,i) => {
            
    //         statistic = this.createStatistic(item,event.data.data);
            
    //         text = `${item}&nbsp;&nbsp;&nbsp;[${this.shema[item]}]`;
    //         this.rows.push({'id': i,'text': text,'static': statistic});

            
    //       })
    //     }

    //     worker.terminate();

    //   }.bind(this);

    //   worker.postMessage(`reports-${this.search.sid}`);   // запускаем воркер на выполнение


    // },
    launchSearch: async function() {

      this.search.sid = this.hashCode(this.search.original_otl);

      this.$store.auth.getters.putLog(`Запущен запрос  ${this.search.sid}`);
      console.log(this.search.sid)

      this.loading = true;
      console.log('launch search')
      let response = await this.$store.getters.getDataApi({search: this.search, idDash: 'papers'});
      // вызывая метод в хранилище  

      if (!response.data || response.data.length == 0) {  // если что-то пошло не так 
        this.loading = false;
        this.$store.commit('setErrorLogs',true);
        this.data = [];
        this.rows = [];
      } else {  // если все нормально
        console.log('data ready')
    
        // let responseDB = this.$store.getters.putIntoDB(response, this.search.sid, 'reports');
        // responseDB
        //   .then(
        //     result => {
        //       let refresh =  this.$store.getters.refreshElements('reports', this.search.sid, );
        //       this.loading = false;
        //       this.$store.commit('setReportSearch',this.search);
        //     },
        //   );
      }
    },
    setUsername: function(event) {
      this.search.parametrs.username = event;
    },
    hashCode: function(otl) {
      return otl.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
    },
    // getDataFromDb: function() {
    //   return function(event)  {
    //     let db = null;

    //     let searchSid = event.data;

    //     let request = indexedDB.open("EVA",1);  

    //     request.onerror = function(event) {
    //       console.log("error: ",event);
    //     };

    //     request.onupgradeneeded = event => {
    //       console.log('create');
    //       db = event.target.result;
    //       if (!db.objectStoreNames.contains('searches')) { // if there's no "books" store
    //         db.createObjectStore('searches'); // create it
    //       }

    //       request.onsuccess = event => {
    //         db = request.result;
    //         console.log("successEvent: " + db);
    //       };
    //     }

    //     request.onsuccess =  event => {

    //       db = request.result;

    //       let transaction = db.transaction("searches"); // (1)

    //       // получить хранилище объектов для работы с ним
    //       let searches = transaction.objectStore("searches"); // (2)


    //       let query = searches.get(String(searchSid)); // (3) return store.get('Ire Aderinokun');


    //       query.onsuccess = event => { // (4)
    //         if (query.result) {
    //           self.postMessage(query.result);  // сообщение которое будет передаваться как результат выполнения функции
    //         } else {
    //           self.postMessage([]);  // сообщение которое будет передаваться как результат выполнения функции
    //         }
    //       };

    //       query.onerror = function() {
    //         console.log("Ошибка", query.error);
    //       };
    

    //     };   


    //   }
    // },
    openSettings: function() {
      this.modal = true;
    },
    cancelModal: function() {
      this.modal = false;
    },
    // changeTab: function(elem) {
    //   if (elem == 'multiLine'){
    //     this.unitedShow = true;
    //   } else {
    //     this.unitedShow = false;
    //   }
    //   Object.keys(this.aboutElem).forEach( item => {
    //     if (item != elem) {
    //       this.$set(this.aboutElem[item],'show',false);
    //       this.$set(this.aboutElem[item],'color',this.color.text);
    //     } else {
    //       this.activeElem = item;
    //       this.$set(this.aboutElem[item],'show',true);
    //       this.$set(this.aboutElem[item],'color',this.color.controls);
    //     }
    //   })
    // },
    // changeUnited: function() {
    //   if (!this.unitedData.united) {
    //     this.unitedData.united = true;
    //     this.unitedData.color = this.color.controlsActive;
    //   } else {
    //     this.unitedData.united = false;
    //     this.unitedData.color = this.color.controls;
    //   }
    //   this.$store.commit('setOptions',  { idDash: 'reports', id: 'multiLine', options: {united: this.unitedData.united} });
    // },
    // createStatistic: function(key,data) {
    //   let how_much = {};
    //   let result = [];
    //   let length = data.length;
    //   data.forEach( item => {
    //     if (how_much[item[key]]) {
    //       how_much[item[key]]++;
    //     } else {
    //       how_much[item[key]] = 1 
    //     }
    //   })
    //   Object.keys(how_much).forEach( item => {
                    
    //     result.push(
    //       {
    //         'value': item,
    //         'count': how_much[item],
    //         '%': Math.round((how_much[item]*100)/length)
    //       }
    //     );
    //   })
      
               
    //   return result 

    // },
    setSearch: function(search) {
      this.search = Object.assign({},search);
      this.modal = false;
    },
    changeColor: function() {
      if (document.querySelectorAll('.v-menu__content').length != 0){
        
        document.querySelectorAll('.v-menu__content').forEach( item => {
          
          item.style.boxShadow = `0 5px 5px -3px ${this.color.border},0 8px 10px 1px ${this.color.border},0 3px 14px 2px ${this.color.border}`;
          item.style.background = this.color.back;
          item.style.color = this.color.text;
          item.style.border = `1px solid ${this.color.border}`;
        })
      }
    },
    // openStatistic: function(statistic) {
    //   if (this.showStatistic) {
    //     if (this.statisticKey == statistic.text) {
    //       this.showStatistic = false;
    //     } else {
    //       this.statisticKey = statistic.text;
    //       this.statistic = statistic.static;
    //     }
    //   } else {
    //     this.showStatistic = true;
    //     this.statisticKey = statistic.text;
    //     this.statistic = statistic.static;
    //   }
    // },
    // calcSize: function() {
    //   let size = this.$refs.vis.$el.getBoundingClientRect();
    //   this.size.width = Math.round(size.width) - 16;
    //   this.size.height = Math.round(size.height) - 66;
    // },
  },
  mounted() {
    
    // this.search = this.$store.getters.getReportSearch;
    // if (this.search.original_otl != '') {
    //   this.$store.commit('setShould', { idDash: 'reports',  id: 'table', status: true});
    // }
    // this.calcSize();
    // this.$refs.search.$el.addEventListener ("keypress", event =>{
    //   if (event.ctrlKey && event.keyCode == 13) {
    //     this.launchSearch();
    //   }
    // });
    // this.$refs.report.addEventListener('click', event => {
    //   if(!event.target.classList.contains('static-row')) {
    //     this.showStatistic = false;
    //   }
    // })

    if (screen.width > 1920) {
      this.rowsCount = 14;
    } else if (screen.width <= 1440) {
      this.rowsCount = 6;
    }
    //this.unitedData.color=  this.color.controls;
    this.color = themes[this.theme];
    Object.values(this.steps).forEach( item => {
      item.status = this.color.controls;
    })
    this.$refs.steppers.$el.querySelectorAll('.v-stepper__step__step').forEach( item => {
      item.style.background = this.color.border;
    })
  } 
}


</script>

<style lang="sass" > 
  
   @import '../sass/papers.sass'
   
</style>