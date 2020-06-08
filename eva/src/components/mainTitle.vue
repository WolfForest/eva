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
        :style="{top:top}" 
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
      <v-content 
        id="content" 
        style="margin-bottom:40px"
      >
        <v-container class="dash-container">
          <move-able 
            v-for="elem in elements" 
            :key="hash(elem)"  
            :dataModeFrom="mode" 
            :colorFrom="color" 
            :idDashFrom="idDash" 
            :dataElem="elem" 
            :dataPageFrom="page" 
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
    }
  },
  mounted() {
    let otstup = 0;
          

    window.addEventListener('scroll' , () => {  // при увеличении экрана в высоту (вообще коненчо срабатывает при скролле страницы)
      if (document.querySelector('.aplication')) {
        if (document.body.scrollHeight > document.body.clientHeight) { // если высота скролируемого экрана больше чем клиентского
          otstup = 40;
        } else {
          otstup = 0;
        }
        document.querySelector('.aplication').style.height =  `${document.body.scrollHeight+otstup}px`; // в любом случае расширяем контейнер до размеров экрана
      }
    })
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
    
</style>