<template>
  <v-navigation-drawer
    v-model="paleteShow"
    fixed
    class="theme-setting"
    right
    :color="colorFrom.text"
    :style="{background: colorFrom.backElement}"
  >
    <div class="theme-btn">
      <v-btn 
        :color="colorFrom.controlsSystem" 
        class="theme-choise-btn" 
        @click="setTheme('light')"
      >
        Светлая тема
      </v-btn> 
      <v-btn 
        :color="colorFrom.controlsSystem" 
        class="theme-choise-btn" 
        @click="setTheme('dark')"
      >
        Тёмная тема
      </v-btn> 
      <!-- <div 
        class="just-btn theme-btn-light" 
        @click="setTheme('light')"
      >
        Светлая тема
      </div>
      <div 
        class="just-btn theme-btn-dark" 
        @click="setTheme('dark')"
      > 
        Тёмная тема
      </div> -->
    </div>
  </v-navigation-drawer>
  <!-- <div 
    class="settings" 
    :class="{showSettings:active}" 
    :style="{background: color.back}"
  >
    <div class="setting-block">
      <p 
        class="color-setting" 
        :style="{color: color.text}"
      >
        Цветовые настройки
      </p>
      <div 
        class="divider-settings" 
        :style="{background: color.border}"
      />
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет текста
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}"  
            @click="switchBlock('textBlock')"
          >
            {{ switchers.textBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.textBlock.status"
          class="color-picker" 
        >
          <v-color-picker  
            v-model="color.text"  
            mode.sync="rgba"
          />
        </div>
      </div>
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет фона
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}" 
            @click="switchBlock('backBlock')"
          >
            {{ switchers.backBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.backBlock.status"
          class="color-picker"
        >
          <v-color-picker  
            v-model="color.back"  
            mode.sync="rgba" 
          />
        </div>
      </div>
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет фона элементов
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}" 
            @click="switchBlock('backElementBlock')"
          >
            {{ switchers.backElementBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.backElementBlock.status"
          class="color-picker"
        >
          <v-color-picker  
            v-model="color.backElement"  
            mode.sync="rgba" 
          />
        </div>
      </div>
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет кнопок
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}" 
            @click="switchBlock('controlsBlock')"
          >
            {{ switchers.controlsBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.controlsBlock.status"
          class="color-picker" 
        >
          <v-color-picker  
            v-model="color.controls"  
            mode.sync="rgba" 
          />
        </div>
      </div>
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет активных кнопок
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}" 
            @click="switchBlock('controlsActiveBlock')"
          >
            {{ switchers.controlsActiveBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.controlsActiveBlock.status"
          class="color-picker"
        >
          <v-color-picker  
            v-model="color.controlsActive"  
            mode.sync="rgba" 
          />
        </div>
      </div>   
      <div class="color-item">
        <div class="color-row">
          <p 
            class="color-itself" 
            :style="{color: color.text}"
          >
            Цвет границ
          </p>
          <v-icon 
            class="color-arrow" 
            :style="{color:color.controls}" 
            @click="switchBlock('borderBlock')"
          >
            {{ switchers.borderBlock.arrow }}
          </v-icon>
        </div>
        <div 
          v-show="switchers.borderBlock.status"
          class="color-picker"
        >
          <v-color-picker  
            v-model="color.border"  
            mode.sync="rgba" 
          />
        </div>
      </div> 
      <div class="theme-btn">
        <div 
          class="just-btn theme-btn-light" 
          @click="setTheme('light')"
        >
          Светлая тема
        </div>
        <div 
          class="just-btn theme-btn-dark" 
          @click="setTheme('dark')"
        > 
          Тёмная тема
        </div>
      </div>
       <v-btn 
        small 
        :color="color.controls" 
        class="accept-btn" 
        @click="setNewColor"
      >
        Подтвердить
      </v-btn> 
    </div>
    <div 
      class="vertical-line" 
      :style="{background: color.controls}"
    /> 
  </div> -->
</template>


<script>

import {  mdiChevronDown, mdiChevronUp } from '@mdi/js'

export default {
  props: {
    colorFrom: null,
    paleteFrom: null,
    showFrom: null,
  },
  data () {
    return {
      paleteShow: false,
      switchers: {
        textBlock: {
          status: false,
          arrow: mdiChevronDown
        },
        backBlock: {
          status: false,
          arrow: mdiChevronDown
        },
        controlsBlock: {
          status: false,
          arrow: mdiChevronDown
        },
        controlsActiveBlock: {
          status: false,
          arrow: mdiChevronDown
        },
        borderBlock: {
          status: false,
          arrow: mdiChevronDown
        },
        backElementBlock: {
          status: false,
          arrow: mdiChevronDown
        }
      }
    } 
  },
  computed: {
    active: function() {  
      return this.showFrom 
    } 
  },  
  watch: {
    paleteFrom: function (palete) {
      palete ? this.paleteShow = true : this.paleteShow = false;

    },
  },
  methods: {
    switchBlock: function(switcher) {
      Object.keys(this.switchers).forEach( item => {
        if (item != switcher) {
          this.switchers[item].status = false;
          this.switchers[item].arrow = mdiChevronDown;
        }
      })
      this.switchers[switcher].status = !this.switchers[switcher].status;
      if (this.switchers[switcher].status) {
        this.switchers[switcher].arrow = mdiChevronUp;
      } else {
        this.switchers[switcher].arrow = mdiChevronDown; 
      }
    },
    setTheme: function(theme){
      this.$store.commit('setTheme', theme);
      // if (theme == 'light') {
      //   this.color.text = '#333';
      //   this.color.back = '#FFF';
      //   this.color.backElement = '#FFF';
      //   this.color.controls = '#008080';
      //   this.color.controlsActive = '#FF6D70';
      //   this.color.border = '#00000033';
      //   this.color.change = !this.color.change;
      // } else {
      //   this.color.text = '#FFFCFCFF';
      //   this.color.back = '#07070EFF';
      //   this.color.backElement = '#17171BFF';
      //   this.color.controls = '#0B909C';
      //   this.color.controlsActive = '#F5B910';
      //   this.color.border = "#F1FFFF33";
      //   this.color.change = !this.color.change;
      // }
    },
  },
  mounted() {
    //this.color =  this.$store.getters.getColor;
    
  } 
}


</script>

<style lang="sass" > 
  
    @import '../sass/themeSettings.sass'

   
</style>