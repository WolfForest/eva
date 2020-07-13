<template>
  <v-navigation-drawer
    v-model="gearShow"
    fixed
    class="theme-setting"
    width="300"
    left
    :color="colorFrom.text"
    :style="{background: colorFrom.backElement}"
  >
    <div
      class="line-setting"
      :style="{background: colorFrom.panel}"
    />
    <div class="setting">
      <div class="labelSetting">
        Поменять режим отображения
      </div>
      <v-switch  
        v-model="mode" 
        class="switch" 
        :color="colorFrom.controls" 
        :style="{color:colorFrom.text,}" 
        :label="String(mode)" 
      />
    </div>
  </v-navigation-drawer>
</template>


<script>

import {  mdiChevronDown, mdiChevronUp } from '@mdi/js'

export default {
  props: {
    colorFrom: null,
    gearFrom: null,
  },
  data () {
    return {
      gearShow: false,
      settings: {},
      mode: true
    } 
  },
  computed: {
    active: function() {  
      return this.showFrom 
    } 
  },  
  watch: {
    gearFrom: function (gear) {
      gear ? this.gearShow = true : this.gearShow = false;

    },
    mode: function(mode) {
      this.$emit("changeMode");
    }
  },
  methods: {
  //   switchBlock: function(switcher) {
  //     Object.keys(this.switchers).forEach( item => {
  //       if (item != switcher) {
  //         this.switchers[item].status = false;
  //         this.switchers[item].arrow = mdiChevronDown;
  //       }
  //     })
  //     this.switchers[switcher].status = !this.switchers[switcher].status;
  //     if (this.switchers[switcher].status) {
  //       this.switchers[switcher].arrow = mdiChevronUp;
  //     } else {
  //       this.switchers[switcher].arrow = mdiChevronDown; 
  //     }
  //   },
  //   setTheme: function(theme){
  //     // let formData =  new FormData();
  //     // formData.append('setting', {theme: theme});

  //     this.$store.commit('setTheme', theme);
  //     let settings = JSON.stringify({
  //       theme: theme,
  //     });
  //     this.$store.commit('setThemeBack', JSON.stringify({setting: settings}));


  //     // if (theme == 'light') {
  //     //   this.color.text = '#333';
  //     //   this.color.back = '#FFF';
  //     //   this.color.backElement = '#FFF';
  //     //   this.color.controls = '#008080';
  //     //   this.color.controlsActive = '#FF6D70';
  //     //   this.color.border = '#00000033';
  //     //   this.color.change = !this.color.change;
  //     // } else {
  //     //   this.color.text = '#FFFCFCFF';
  //     //   this.color.back = '#07070EFF';
  //     //   this.color.backElement = '#17171BFF';
  //     //   this.color.controls = '#0B909C';
  //     //   this.color.controlsActive = '#F5B910';
  //     //   this.color.border = "#F1FFFF33";
  //     //   this.color.change = !this.color.change;
  //     // }
  //   },
  },
  mounted() {
    //this.color =  this.$store.getters.getColor;
    
  } 
}


</script>

<style lang="sass" > 
  
    @import '../sass/dashSettings.sass'

   
</style>