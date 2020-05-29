<!-- Модальное окно для создания ИС -->

<template>
    <v-dialog  :value="active"  width="680" persistent  @keydown="checkEsc($event)" >
        <v-card class="reports-card" :style="{background: colorFrom.backElement}">
            <div class="textarea-block">
                    <!-- <v-text-field  color="teal" class="textarea-item" outlined label="Sid"  placeholder="Sid" clearable v-model="search.sid" hide-details></v-text-field> -->
                    <div class="times-block">
                        <div class="time-block">
                            <v-text-field  :color="colorFrom.controls" :style="{color: colorFrom.text}"  class="textarea-item" outlined label="Временной интервал: начало"  v-model="search.parametrs.tws" hide-details></v-text-field>
                            <DTPicker v-model="tws"    :no-value-to-custom-elem="true"  format="YYYY-MM-DD HH:mm"  :style="{fill: colorFrom.text, background: colorFrom.backElement, color: colorFrom.text}"   :color="colorFrom.controlsActive" button-color="colorFrom.controls" class="dtpicker-report" >
                                <v-icon class="picker-report" :color="colorFrom.controls" >{{pickerIcon}}</v-icon> 
                            </DTPicker>
                        </div>
                        <div class="time-block">
                            <v-text-field  :color="colorFrom.controls" :style="{color: colorFrom.text}" class="textarea-item" outlined label="Временной интервал: конец"  v-model="search.parametrs.twf" hide-details></v-text-field>
                            <DTPicker v-model="twf"   :no-value-to-custom-elem="true"  format="YYYY-MM-DD HH:mm" :style="{fill: colorFrom.text, background: colorFrom.backElement, color: colorFrom.text}"  :color="colorFrom.controlsActive" button-color="colorFrom.controls" class="dtpicker-report" >
                                <v-icon class="picker-report" :color="colorFrom.controls" >{{pickerIcon}}</v-icon> 
                            </DTPicker>
                        </div>
                    </div>
                    <v-expansion-panels class="expansion-panels" > 
                        <v-expansion-panel :style="{backgroundColor: colorFrom.backElement, color: colorFrom.text, border: `1px solid ${colorFrom.border}`}">
                            <v-expansion-panel-header>Дополнительные параметры</v-expansion-panel-header>
                            <v-expansion-panel-content class="order-expansion">
                                <!-- <v-text-field  color="teal"   class="textarea-item" outlined label="Username"  v-model="search.parametrs.username" hide-details></v-text-field> -->
                                <v-text-field  :color="colorFrom.controls" :style="{color: colorFrom.text}" class="textarea-item" outlined label="Timeout"  v-model="search.parametrs.timeout" hide-details></v-text-field>
                                <v-text-field  :color="colorFrom.controls" :style="{color: colorFrom.text}" class="textarea-item" outlined label="Cache_ttl"  v-model="search.parametrs.cache_ttl" hide-details></v-text-field>
                                <v-text-field :color="colorFrom.controls"  :style="{color: colorFrom.text}" class="textarea-item" outlined label="Field_extraction"  v-model="search.parametrs.field_extraction" hide-details></v-text-field>
                                <v-text-field  :color="colorFrom.controls" :style="{color: colorFrom.text}" class="textarea-item" outlined label="Preview"  v-model="search.parametrs.preview" hide-details></v-text-field>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>  
            </div>
            <v-card-actions class="reports-action">
            <v-spacer></v-spacer>
            <v-btn small :color="colorFrom.controlsSystem" class="create-btn" @click="setSearch">Подтвердить</v-btn>
            <v-btn small :color="colorFrom.controlsActive" class="create-btn" @click="cancelModal">Отмена</v-btn>
            </v-card-actions>
        </v-card>
       
        
    </v-dialog>
</template>

<script> 

import { mdiCalendarMonth} from '@mdi/js'


export default {
    props: {
        searchFrom: null,
        modalFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            search: {
                sid: '',
                original_spl: null,
                parametrs: {
                    tws: '',
                    twf: '',
                    username: 'adminsss',
                    timeout: 100,
                    preview: 'false',
                    field_extraction: 'false',
                    cache_ttl: 100,
                }
            },
            tws : '',
            twf : '',
            pickerIcon: mdiCalendarMonth
        }
    },
      computed: {
           active: function() {  // тут понимаем нужно ли открыть окно с созданием или нет
               if (this.modalFrom) {
                   this.search = this.searchFrom;
               }
               return this.modalFrom
           },
     },
      watch: {
        tws : function (tws) {
            this.search.parametrs.tws = tws ;
        },
        twf : function (twf) {
            this.search.parametrs.twf = twf;
        }
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
         setSearch: function() {
             //1586348147
              //  let search = JSON.parse(JSON.stringify(this.search));
           // if(new Date(this.search.parametrs.tws)) {
               //console.log(this.search.parametrs.tws instanceof Number)
               if(Number(this.search.parametrs.tws) || this.search.parametrs.tws == 0 ) {  // не придумал ка кполучить не Number()
                   
               } else {
                        this.search.parametrs.tws = parseInt(new Date(this.search.parametrs.tws).getTime()/1000); 
               }
               if(Number(this.search.parametrs.twf) || this.search.parametrs.twf == 0 ) {  // не придумал ка кполучить не Number()
                   
               } else {
                       this.search.parametrs.twf = parseInt(new Date(this.search.parametrs.twf).getTime()/1000);
               }
               
              
            this.$emit('setSearch',this.search);
         },
      
      },
}
</script>

<style lang="sass" > 

     @import '../sass/modalReports.sass'
    
</style>