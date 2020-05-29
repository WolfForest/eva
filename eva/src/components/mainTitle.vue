<template>
   <v-app class="aplication" :style="{background:color.back}">
       <header-top @permissions="setPermissions" @checkOver="checkOver" :class="{openHeader:!openProfile}"></header-top>
       <div class="body-block" v-if="prepared">
            <dash-panel-bord  :idDashFrom="idDash" :colorFrom="color" :style="{top:top}" @changeMode="changeMode" @openProfile="event => {this.openProfile = event}" @openSettings="openSettings" ></dash-panel-bord>
            <!-- <v-divider style="margin-top: 60px"></v-divider> -->
            <v-card class="already-block" v-if="alreadyShow" :style="{color:color.text,background:color.back,boxShadow:` 0 0 5px 5px ${color.border}`}">
                    <div class="text-already" >Существует более новая версия дашборда. Хотите обновить?</div>
                    <div class="btn-already">
                    <v-btn small :color="color.controlsSystem" class="create-btn" @click="updateDash">Да</v-btn>
                    <v-btn small :color="color.controlsActive" class="create-btn" @click="alreadyShow = false">Нет</v-btn>
                    </div>
            </v-card>
            <v-content id="content" style="margin-bottom:40px">
                <v-container  class="dash-container">
                    <move-able :dataModeFrom="mode" :colorFrom="color" v-for="elem in elements" :key="hash(elem)"  :idDashFrom="idDash" :dataElem="elem" :dataPageFrom="page" ></move-able>
                    <modal-delete :colorFrom="color" :idDashFrom="idDash" :dataPageFrom="page"></modal-delete>
                    <modal-search :colorFrom="color" :idDashFrom="idDash" ></modal-search>
                    <!-- <modal-exin :colorFrom="color" :idDashFrom="idDash" :dataPageFrom="page"></modal-exin> -->
                    <modal-settings :colorFrom="color" :idDashFrom="idDash"   ></modal-settings>
                    <dash-settings :showFrom="showSetting"  ></dash-settings>
                </v-container>
            </v-content> 
        </div>
       <footer-bottom></footer-bottom>
   </v-app> 
</template>

<script> 

export default {
    data () {
        return {
           page: 'dash',
           mode: true,
           showSetting: false,
           rotate: '',
        //    color: {
        //         back: '#fafafa',
        //         backElement: '#ffffff',
        //         text: '#4a4a4a',
        //         controls: '#6e96c5',
        //         controlsSystem: '#004799',
        //         controlsActive: '#41C4FF',
        //         controlsInsideDash: '#BCBCBC',
        //         panel: '#2B68B1',
        //         border: '#00000033',
        //     },
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
          }
     },
      methods: {
        //   makeScreen: async function() {  // функция которая делает скриншот страницы
        //         let el = document.querySelector('#content');

        //         let result = await this.$html2canvas(el);
        //         result = await result.toDataURL();
        //         this.$store.commit('setScreenShot', { id: this.idDash, screen: result});
        //   },
          hash: function(elem) {
              return `${elem}#${this.idDash}`
          },
          changeMode: function() {
              this.mode = !this.mode;
          },
        //   updateColor: function(color) {
        //       console.log('update');
        //     this.color = color;
        //   },
          openSettings: function() {
              this.showSetting = !this.showSetting;
          },
        setPermissions: function(event) { 
               
                // let events = event.map( item => {
                //     return item.name
                // })
                if (event.includes('admin_all')) {
                     this.adminRoot = true;
                } 
                
        },
    checkOver: function() {
      this.letElements = true;
      this.checkAlreadyDash();
    },
    updateDash: function() {
    //let dateCreate = Math.round(Date.now()/1000);
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
        //   openModalSettings: function(event) {
        //       //this.modalSettings = true;
        //       console.log(event);
        //   },

    },
    mounted() {
            //  setInterval( () => {  // каждый пять минут вызывает функцию для скриншота
            //   this.makeScreen();
            //  },300000)
           
            let height = document.body.clientHeight;  // получаем высоту страницы пользователя

             window.addEventListener('scroll' , () => {  // при увеличении экрана в высоту (вообще коненчо срабатываетпри скролле страницы)
                if (document.querySelector('.aplication')) {
                    if (document.body.scrollHeight > document.body.clientHeight) { // если высота скролируемого экрана больше чем клиентского
                        document.querySelector('.aplication').style = "margin-bottom: 40px";  // значит стваим отступ
                    }
                    document.querySelector('.aplication').style.height =  `${document.body.scrollHeight}px`; // в любом случае расширяем контейнер до размеров экрана
                }
                    })
            //setTimeout( () => {
              //  this.color =  this.$store.getters.getColor;
              //  this.color.change = this.colorChange; 
                // this.color =   {
                //     back: 'black',
                //     backElement: 'black',
                //     text: 'white',
                //     controls: 'teal',
                //     controlsActive: '#FF6D70',
                //     border: 'rgba(255,255,255,.2)',
                // };

           // },0)
             
              
                // еще такая же строка с присваением прописана в moveAble.vue при перетаскивании элемента

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