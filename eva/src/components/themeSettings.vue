<template>
  <v-navigation-drawer
    v-model="paleteShow"
    fixed
    class="theme-setting"
    right
    :color="colorFrom.text"
    :style="{background: addColorOpacity(colorFrom.backElement, 60)}"
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
    </div>
  </v-navigation-drawer>
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
      let settings = JSON.stringify({
        theme: theme,
      });
      this.$store.commit('setThemeBack', JSON.stringify({setting: settings}));
    },
    addColorOpacity(hexColor, opacity){
      const hex = hexColor.replace('#', '');
    
      if (hex.length === 3) {
        hex += hex
      }
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      return `rgba(${r},${g},${b},${opacity / 100})`;
    }
  },
}


</script>

<style lang="sass" > 
  
    @import '../sass/themeSettings.sass'

   
</style>