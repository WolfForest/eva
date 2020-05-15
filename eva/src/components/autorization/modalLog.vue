<template>
    <v-dialog  v-model="active" width='90%' persistent @keydown="checkEsc($event)"  >
        <v-card  class="log-block">
            <v-card-text class='card-log'>
                <div class="log-body" v-html="text"></div>
            </v-card-text>
             <v-card-actions class="btn-log">
                <v-btn small color="teal" class="log-btn" @click="clearLog(clear)">{{clear}}</v-btn>
                <div class="errorSaveBlock" :style="{color:colorError,opacity:opacityError}">{{msgError}}</div>
                <div class="right-btn">
                    <v-btn small color="teal" class="log-btn" @click="sendToBack">Сохранить</v-btn>
                    <v-btn small color="#FF6D70" class="log-btn" @click="cancelModal">Закрыть</v-btn>
                </div>
            </v-card-actions>
        </v-card>
        
    </v-dialog>
</template>


<script>

import {  } from '@mdi/js'

export default {
    props: {
        modalActive: null,
    },
    data () {
        return {
            text: '',
            restore: '',
            clear: 'Очистить',
            msgError: '',
            colorError: '',
            opacityError: 0
        } 
    },
     computed: { 
         active: function() {
             if (this.modalActive) {
                 this.getLog();
             }
             return this.modalActive
         },
     },  
     methods: {
         cancelModal: function() {
             this.$emit('cancelModal');
             this.clear = 'Очистить';
         },
         getLog: async function() {
            this.text =  await this.$store.auth.getters.getLog('front');
         },
         sendToBack: async function() {

            let hide = () => {
                this.opacityError = 1;
                setTimeout( () => {
                    this.opacityError = 0;
                    this.msgError = '';
                    this.colorError = '';
                },2000)
            }


            let response =  await this.$store.auth.getters.saveLogIntoBack();
            
                if (response.status == 200) {
                    this.msgError = 'Лог сохранен успешно';
                    this.colorError = 'teal';
                    hide()
                } else {
                    this.msgError = 'Не получилось. Попробуйте еще раз.';
                    this.colorError = '#FF6D70'; 
                    hide()
                }

            
                
             
         },
          checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancelModal();
              }
          },
         clearLog: async function(clear) {
             if (clear == 'Очистить') {
                let response = await  this.$store.auth.getters.deleteLog();
                if (response == 'clear') {
                    this.restore = this.text;
                    this.text = '';
                    this.clear = 'Восстановить';
                }
             } else {
                this.text = this.restore;
                this.clear = 'Очистить';
                this.$store.auth.getters.putLog(this.text);  
             }
         }
     },
}


</script>

<style lang="sass" > 
  
   @import '../../sass/modalLog.sass'

   
</style>