<template >
    
    <v-app class="aut-app-main">
       <header-top :inside="false"></header-top>
       <v-content>
           <v-container  class="main-container container-product" >
               <div class="product-block">
                     <v-card  class="product-block-itself"  @click="openDash"  >   
                        <v-card-text class="product-text">
                            Конструирование <br> дашбордов
                        </v-card-text>
                    </v-card>
                    <v-card  class="product-block-itself"  @click="openReport"  >   
                        <v-card-text class="product-text">
                            Исследование <br> данных
                        </v-card-text>
                    </v-card>
               </div>
           </v-container> 
        </v-content>
        <footer-bottom></footer-bottom>
    </v-app>
</template>


<script>

import { mdiDoor, mdiAccountEdit, mdiPencil } from '@mdi/js'

export default {

    data () {
        return {
            // unicid: null,
            // login: '',
            // user: {},
            // door: mdiDoor,
            // userEdit: mdiAccountEdit,
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