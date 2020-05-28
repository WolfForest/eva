<template>
    <v-dialog  v-model="active" width='400px' persistent  @keydown="checkEsc($event)">
        <v-card  class="delete-profile" :style="{background: colorFrom.backElement }">
            <v-card-text>
                <div class="name-profile" v-html="dataFrom.text" :style="{color: colorFrom.text }"></div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small  :color="colorFrom.controlsSystem" class="profile-btn" @click="deleteEssence">Удалить</v-btn>
                <v-btn small :color="colorFrom.controlsActive" class="profile-btn" @click="cancelModal">Отмена</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>

import {  } from '@mdi/js'

export default {
    props: {
        activeDelete: null,
        dataFrom: null,
        colorFrom: null,
    },
    data () {
        return {

        } 
    },
     computed: { 
         active: function() {
             return this.activeDelete
         },
     },  
     methods: {
         cancelModal: function() {
             this.$emit('cancelModal');
         },
          checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancelModal();
              }
          },
         deleteEssence: function() {


            let response = this.$store.auth.getters.deleteEssence({id: this.dataFrom.id, essence: this.dataFrom.essence});     
            
            response.then( res => {
                if (res.status == 200){
                    this.cancelModal();
                } 
            })

         }
     },
}


</script>

<style lang="sass" > 
  
   @import '../../sass/modalDeleteProfile.sass'

   
</style>