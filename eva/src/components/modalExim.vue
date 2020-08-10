<template>
  <v-dialog  
    v-model="active"  
    width="500"  
    persistent 
  > 
    <div class="exin-modal-block">
      <v-card :style="{background:color.backElement}">
        <v-card-text class="headline ">
          <div 
            class="exin-title" 
            :style="{color:color.text,borderColor:color.text}"
          >
            Экспорт / Импорт 
          </div>
        </v-card-text>
        <div 
          ref="blockExim" 
          class="block-exim" 
        >
          <v-select 
            v-model="selected" 
            :prepend-icon="selectImg" 
            :style="{color:color.text, fill: color.text}" 
            :items="elements[element]" 
            multiple  
            :color="color.text"  
            hide-details  
            outlined 
            class="select-exp" 
            :label="labelExp[element]" 
            @click="changeColor"
          /> 
          <v-btn 
            small  
            :color="color.controls" 
            class="export-btn" 
            @click="exportDash"
          >
            Экспортировать
          </v-btn>
          <p 
            class="msgExp" 
            :style="{color:color[msgExp.color],opacity:msgExp.opacity}"
          >
            {{ msgExp.text }}
          </p>
          <div 
            class="divider" 
            :style="{backgroundColor:color.border,opacity:'0,3'}"
          />
          <v-file-input 
            :prepend-icon="fileImg" 
            :color="color.controls" 
            :style="{color:color.text, fill: color.text}"  
            class="file-itself" 
            hide-details  
            outlined 
            label="Выберите файл"
            @change="file=$event" 
          />
          <v-btn 
            small  
            :color="color.controls" 
            class="import-btn" 
            @click="importDash"
          >
            Импортировать
          </v-btn>
          <p 
            class="msgImp" 
            :style="{color:color[msgImp.color],opacity:msgImp.opacity}"
          >
            {{ msgImp.text }}
          </p>
        </div>  
        <v-card-actions class="exim-action">
          <v-spacer />
          <v-btn 
            small 
            :color="color.controlsActive" 
            class="close-btn" 
            @click="closeModal"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card> 
    </div>
  </v-dialog>
</template>

 
<script>

import {   mdiFileOutline, mdiFormatListBulleted   } from '@mdi/js'

export default {
  props: {
    color: null,
    active: null,
    dashboards: null,
    groups: null,
    element: null,
    curName: null,
  },
  data () {
    return {
      msgExp: {
        text: 'Успешно',
        color: 'controls',
        opacity: '0'
      },
      msgImp: {
        text: 'Успешно',
        color: 'controls',
        opacity: '0'
      },
      file: "",
      fileImg: mdiFileOutline,
      selectImg: mdiFormatListBulleted,
      labelExp: {
        group: 'Выберите группы',
        dash: 'Выберите дашборды',
      },
      elements: {
        group: [],
        dash: [], 
      },
      selected: [],
    } 
  },
  computed: { 

  },  
  watch: {
    dashboards: function() {
      let list = this.dashboards.map( item =>{ return item.name});
      list.unshift('Выбрать все');
      this.elements.dash = list;
    },
    groups: function() {
      let list = this.groups.map( item =>{ return item.name});
      list.unshift('Выбрать все');
      this.elements.group = list;
    },
    selected: function(selected) {
      if(selected.includes('Выбрать все')) {
        let list = [];
        if (this.element == 'dash') {
          list = this.dashboards.map( item =>{ return item.name});
        } else {
          list = this.groups.map( item =>{ return item.name});
        }
        this.selected = list;
        list = [...[],...list];
        list.unshift('Очистить все');
        this.elements[this.element] = list;
      } else if (selected.includes('Очистить все')) {
        let list = [];
        if (this.element == 'dashs') {
          list = this.dashboards.map( item =>{ return item.name});
        } else {
          list = this.groups.map( item =>{ return item.name});
        }
        this.selected = [];
        list.unshift('Выбрать все');
        this.elements[this.element] = list;
      }
    },
    
  },
  methods: {
    exportDash: async function() {
      let ids = [];
      if (this.element == 'dash') {
        this.dashboards.forEach( item =>{ 
          if(this.selected.includes(item.name)) {
            ids.push(item.id);
          }
        })
      } else {
        this.groups.forEach( item =>{ 
          if(this.selected.includes(item.name)) {
            ids.push(item.id);
          }
        }) 
      }
           
      let response = await this.$store.getters.exportDash({element: this.element,ids: ids.join(',')});
      if(response == '') {
        this.msgExp.text = 'Экспортировать не удалось';
        this.msgExp.color = 'controlsActive';
        this.msgExp.opacity = '1';
      } else {
        this.msgExp.text = 'Экспорт прошел успешно';
        this.msgExp.color = 'controls';
        this.msgExp.opacity = '1';
        this.downloadDash(response);
      }
      setTimeout( () => {
        this.msgExp.opacity = '0'; 
      },2000)
    },
    importDash: async function() {
      if (this.file == '' || this.file == undefined) {
        this.msgImp.text = 'Выберите файл для импорта';
        this.msgImp.color = 'controlsActive';
        this.msgImp.opacity = '1';
      } else {
        let extantion = this.file.name.split('.');
        extantion = extantion[extantion.length-1];
        if (extantion != this.element) {
          if (this.element == 'group') {
            this.msgImp.text = 'Выберите файл c группами';
          } else {
            this.msgImp.text = 'Выберите файл c дашбордами';
          }
          this.msgImp.color = 'controlsActive';
          this.msgImp.opacity = '1';
        } else {

          let formData =  new FormData();
          if (this.element == 'dash') {
            formData.append('group', this.curName);
            formData.append('body', this.file);
          } else {
            formData.append('body', this.file);
          }
          let response = await this.$store.getters.importDash({element: this.element,formData: formData});
          try {
            let res = JSON.parse(response);  // тут проверяем может ли распарситься ответ от сервера
            this.msgImp.text = 'Импорт прошел успешно';
            this.msgImp.color = 'controls';
            this.msgImp.opacity = '1';
          }
          catch {
            this.msgImp.text = 'Импортировать не удалось';
            this.msgImp.color = 'controlsActive';
            this.msgImp.opacity = '1';
          } 
        }
      }
      setTimeout( () => {
        this.msgImp.opacity = '0'; 
      },2000)
             
    },
    downloadDash: function(url) {
      let link = this.$refs.blockExim.appendChild(document.createElement("a"));
      link.setAttribute('href',url);
      link.click();
      link.remove();
    },
    closeModal: function() {
      this.$emit('closeModal');
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
  },
}


</script>

<style lang="sass" > 
  
  @import '../sass/modalExin.sass'
   
</style>