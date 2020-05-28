<template >
    
    <v-app class="aut-app-main" :style="{backgroundColor:color.back}">
       <header-top :inside="false"></header-top>
       <v-content>
           <v-container  class="main-container container-product" >
               <div class="product-block">
                     <v-card  class="product-block-itself"  @click="openDash"  :style="{backgroundColor:color.backElement}">   
                        <v-card-text class="product-text" :style="{color:color.text}" >
                            Конструирование <br> дашбордов
                            <p class="delimetr" :style="{backgroundColor:color.text}"></p>
                        </v-card-text>
                        
                    </v-card>
                    <v-card  class="product-block-itself"  @click="openReport"  :style="{backgroundColor:color.backElement}">   
                        <v-card-text class="product-text" :style="{color:color.text}">
                            Исследование <br> данных
                             <p class="delimetr" :style="{backgroundColor:color.text}"></p>
                        </v-card-text>
                    </v-card>
               </div>
           </v-container> 
        </v-content>
        <footer-bottom></footer-bottom>
    </v-app>
</template>


<script>

//import { mdiDoor, mdiAccountEdit, mdiPencil } from '@mdi/js'

export default {

    data () {
        return {
            // unicid: null,
            // login: '',
            // user: {},
            // door: mdiDoor,
            // userEdit: mdiAccountEdit,
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
        //  getCookie: function(cookie) {
        //      cookie.split(';').forEach(item => {
        //         if (item.indexOf('eva-unicid') != -1) {
        //             this.unicid =  JSON.parse(item.split('=')[1]);  
        //         }
        //      });
        //  },
        //  exit: function() {
        //      document.cookie = `eva-unicid=''; max-age=0`;
        //      this.$router.push(`/`);
        //  },
        //  edit: function() {
        //     this.$router.push(`/profile`); 
        //  },
        //  editUser: function() {

        //  },
         openDash: function() {
             this.$router.push(`/dashboards`); 
         },
         openReport: function() {
             this.$store.commit('createReportSearch'); 
             this.$router.push(`/reports`); 
         },
    },
    mounted() {
        // this.getCookie(document.cookie);
        // if (this.unicid == null){
        //     this.$router.push(`/`);
        // } else {
        //     this.login = this.unicid.login;
        // }
    } 
}


</script>

<style lang="sass" > 
  
   @import '../../sass/mainPage.sass'

   
</style>