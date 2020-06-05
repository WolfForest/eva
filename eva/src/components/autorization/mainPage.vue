<template>
  <v-app 
    class="aut-app-main" 
    :style="{backgroundColor:color.back}"
  >
    <header-top :inside="false" />
    <v-content>
      <v-container class="main-container container-product">
        <div class="product-block">
          <v-card 
            class="product-block-itself" 
            :style="{backgroundColor:color.backElement}"
            @click="openDash"  
          >   
            <v-card-text 
              class="product-text" 
              :style="{color:color.text}" 
            >
              Конструирование <br> дашбордов
              <p 
                class="delimetr" 
                :style="{backgroundColor:color.text}"
              />
            </v-card-text>
          </v-card>
          <v-card  
            class="product-block-itself" 
            :style="{backgroundColor:color.backElement}"
            @click="openReport"
          >   
            <v-card-text 
              class="product-text" 
              :style="{color:color.text}"
            >
              Исследование <br> данных
              <p 
                class="delimetr" 
                :style="{backgroundColor:color.text}"
              />
            </v-card-text>
          </v-card>
        </div>
      </v-container> 
    </v-content>
    <footer-bottom />
  </v-app>
</template>


<script>

export default {

  data () {
    return {
      color: { 
        back: '#060606',
        backElement: '#191919',
        text: '#DADADA',
        controls: '#6e96c5',
        controlsSystem: '#004799',
        controlsActive: '#41C4FF',
        controlsInsideDash: '#DADADA',
        panel: '#0D0D0D',
        border: '#454545',
      },
    } 
  },
  computed: { 

  },  
  methods: {
    openDash: function() {
      this.$router.push(`/dashboards`); 
    },
    openReport: function() {
      this.$store.commit('createReportSearch'); 
      this.$router.push(`/reports`); 
    },
  },
}


</script>

<style lang="sass" > 
  
   @import '../../sass/mainPage.sass'

   
</style>