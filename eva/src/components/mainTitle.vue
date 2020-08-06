<template>
  <v-app 
    class="aplication" 
    :style="{background:color.back}"
  >
    <header-top 
      :class="{openHeader:!openProfile}"
      @permissions="setPermissions" 
      @checkOver="checkOver"
    />
    <div 
      v-if="prepared"
      class="body-block" 
    >
      <dash-panel-bord  
        :idDashFrom="idDash" 
        :colorFrom="color" 
        :style="{top:top, display:display}" 
        @changeMode="changeMode" 
        @openProfile="event => {openProfile = event}" 
        @openSettings="openSettings" 
      />
      <v-card 
        v-if="alreadyShow"
        class="already-block"  
        :style="{color:color.text,background:color.backElement}"
      >
        <div class="text-already">
          Существует более новая версия дашборда. Хотите обновить?
        </div>
        <div class="btn-already">
          <v-btn 
            small 
            :color="color.controlsSystem" 
            class="create-btn" 
            @click="updateDash"
          >
            Да
          </v-btn>
          <v-btn 
            small 
            :color="color.controlsActive" 
            class="create-btn" 
            @click="alreadyShow = false"
          >
            Нет
          </v-btn>
        </div> 
      </v-card>
      <v-content id="content">
        <v-container class="dash-container">
           <div
            v-if="gridShow"
            class="overlay-grid"
            :data-grid="true"
             :style="{height: `calc(100vh - ${headerTop}px + ${deltaHorizontal}px)`,top:`${headerTop}px` ,background: `linear-gradient(-90deg, ${color.text} 1px, transparent 1px) repeat scroll 0% 0% / ${verticalCell}px ${verticalCell}px,
            rgba(0, 0, 0, 0) linear-gradient(${color.text} 1px, transparent 1px) repeat scroll 0% 0% / ${horizontalCell}px ${horizontalCell}px`}"
          />
          <move-able 
            v-for="elem in elements" 
            :key="hash(elem)"  
            :dataModeFrom="mode" 
            :colorFrom="color" 
            :idDashFrom="idDash" 
            :dataElem="elem" 
            :dataPageFrom="page"
            :verticalCell="verticalCell"
            :horizontalCell="horizontalCell"
          />
          <modal-delete 
            :colorFrom="color" 
            :idDashFrom="idDash" 
            :dataPageFrom="page"
          />
          <modal-search 
            :colorFrom="color" 
            :idDashFrom="idDash" 
          />
          <modal-settings 
            :colorFrom="color" 
            :idDashFrom="idDash"   
          />
            
          <!-- 
              НЕ УДАЛЯТЬ ЦВЕТОВЫЕ НАСТРОЙКИ
              <dash-settings :showFrom="showSetting"  ></dash-settings> 
          -->
        </v-container>
      </v-content> 
    </div>
    <footer-bottom />
  </v-app> 
</template>

<script> 

import themes from '../js/themeSettings.js';

export default {
  data () {
    return {
      page: 'dash',
      mode: true,
      showSetting: false,
      rotate: '',
      color: { },
      adminRoot: false,
      openProfile: false,
      alreadyDash: {},
      alreadyShow: false,
      letElements: false,
      prepared: false,
      colorChange: false,
      verticalCell: 60,
      horizontalCell: 60,
      deltaHorizontal:0,//сколько надо увеличить высоту overlay-grid,по первое знач-500,
      startClientHeight:0,//первоначальная высота
      startClientWidth:0, //первоначальная ширина
    }
  },   
  computed: {
    idDash: function() {   // получаем id страницы от родителя
      return this.$route.params.id
    },
    elements: function() {  // получаем название элемента  от родителя
      let elements = [];
        
      if (this.letElements) {
        elements =  this.$store.getters.getElements(this.idDash)
      } 
      return elements
    },
    top: function() {
      if (this.openProfile) {
        if (screen.width < 1400) {
          return '40px'
        } else {
          return '50px'
        }
      } else {
        return '0px'
      }
    },
    headerTop: function (){
      if(document.body.clientWidth <=1400){
        return 40
      } else {
        return 50
      }
    },
    theme: function() {
      return this.$store.getters.getTheme
    },
    display: function() {
      if (this.$route.query.header === 'false'){
        return 'none'
      } else {
        return 'flex'
      }
    },
    gridShow: function() {
      let gridShow = this.$store.getters.getGridShow(this.idDash);
      gridShow == 'true' ? gridShow = true : gridShow = false;
      return gridShow;
    },
  },  
  watch: {
    theme: function (theme) {
      this.color = themes[theme];
      
    },
  },
  methods: {
    hash: function(elem) {
      return `${elem}#${this.idDash}`
    },
    changeMode: function() {
      this.mode = !this.mode;
    },
    openSettings: function() {
      this.showSetting = !this.showSetting;
    },
    setPermissions: function(event) { 
      if (event.includes('admin_all')) {
        this.adminRoot = true;
      }           
    },
    checkOver: function() {
      this.letElements = true;
      this.checkAlreadyDash();
    },
    updateDash: function() {
      this.$store.commit('updateDash',{dash: this.alreadyDash,modified: this.alreadyDash.modified});
      this.$store.auth.getters.putLog(`Обновлен дашборд ${this.toHichName(this.alreadyDash.name)} с id ${this.alreadyDash.id}`);
      this.alreadyShow = false;
    },
    toHichName: function(name) {
      return name[0].toUpperCase() + name.slice(1);
    },
    checkAlreadyDash: function() {
      let response =  this.$store.getters.checkAlreadyDash(this.$route.params.id);
      response.then( res => {
        if (res.status == 'exist') {  
          this.alreadyShow = true;
          this.alreadyDash = res;
        } 
        this.prepared = true;
      })
    },
    addScrollListener: function(){ 
      //наблюдение за скроллом
      let otstup = 0;
      window.addEventListener('scroll' , () => {  // при увеличении экрана в высоту (вообще коненчо срабатывает при скролле страницы)       
      if (document.querySelector('.aplication')) {
        if (document.body.scrollHeight > document.body.clientHeight) { // если высота скролируемого экрана больше чем клиентского
          //добавляем размер
          otstup = this.horizontal;
        } else {
          otstup = 0;
          //просто сработало событие
        }
        let _maxHeigth = (Math.round(document.querySelector('.aplication').clientHeight/this.horizontal)) * this.horizontal
        this.deltaHorizontal = (_maxHeigth - this.startClientHeight)

        document.querySelector('.aplication').style.height =  `${document.body.scrollHeight+otstup}px`; // в любом случае расширяем контейнер до размеров экрана
        }
      })
    },
    createStartClient: function(){ 
      //первоначальные значения высоты и ширины
      this.startClientHeight = document.body.clientHeight - this.headerTop
      this.startClientWidth = document.body.clientWidth
    },
    calcSizeCell: function(){
      //размер ячейки
      let grid = this.$store.getters.getSizeGrid(this.idDash);
      this.verticalCell = (this.startClientWidth /grid.vert).toFixed(1);
      this.horizontalCell =  (this.startClientHeight/ grid.hor).toFixed(1);
    }
    
  },
  mounted() {
    //первоначальные значения высоты и ширины
    this.createStartClient();
    //размер ячейки
    this.calcSizeCell();
    //наблюдение за скроллом
    this.addScrollListener();    
    this.color = themes[this.theme];
  }
}
</script>

<style > 

    html,body {
        background: #fafafa;
    }
    .aplication {
        position: relative;
    }
    .aplication .already-block {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 15px;
        position: absolute;
        top: 60px;
        left: 10px;
        z-index: 12;
    }
    .aplication .already-block .text-already {
        font-size: 15px
    } 
    .aplication .already-block .btn-already {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center; 
    } 
    .aplication .already-block .btn-already .create-btn {
        color: white;
        margin-left: 10px;
        cursor: pointer
    } 
    .aplication .dash-container {
        max-width: 100%;
        padding: 0;
    }

    .overlay-grid {
      position: absolute;
      left: 0;
      width: 100%;
      opacity: 0.2;
      transition: all ease 0.3s
    }
    .dash-grid-layout {
      margin-top: 50px
    }
    .dash-grid-layout .dash-grid-item {
      background: black;
      color: white;
    }
    
</style>