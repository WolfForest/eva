<!-- Модальное окно для выбора ИС -->

<template>
    <v-dialog  v-model="active"  width="500" persistent >
      <v-card :style="{background: color.backElement, boxShadow: `0 3px 1px -2px ${this.color.border},0 2px 2px 0 ${this.color.border},0 1px 5px 0 ${this.color.border}`, color: color.text}">
        <div class="searches-block">
            <div class="searches-one" v-for="sear in searches" :key="sear.id" @click="selectSearch($event,sear)" >
                <div class="search-id" :style="{color:'white', background: color.controls, border: `2px solid ${color.controls}`}">{{checkSid(sear.sid)}}</div>
                <div class="search-query" :style="{color: color.text, background: color.backElement, border: `1px solid ${color.text}`}">{{sear.original_otl}}</div>
            </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small :color="color.controlsSystem" class="delete-btn" @click="startDS">Подтвердить</v-btn>
          <v-btn small :color="color.controlsActive" class="delete-btn" @click="cancelModal">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>


export default {
    props: {
        idDashFrom: null,
        colorFrom: null
    },
    data () {
        return {
            currentId : 0,
        }
    },
      computed: { 
          
          idDash: function() {  // получаем название элемнета от родителя
            return this.idDashFrom
          },
           active: function() {  // получаем статус открытия или нет окна модального
               if (this.idDash) {
                    return this.$store.getters.getModalSearch(this.idDash)
               }
           },
          searches:  function() {  // получаем все ИС на странице
              if (this.idDash) {
                    return this.$store.getters.getSearches(this.idDash)
              }
          },
           color: function() {
            return this.colorFrom
          },

     },
      methods: {
          startDS: function() {  //  если нажали на кнопку согласия
              if (this.currentId != 0) { // проверяем выбран ли хоть один ИС
                  this.$store.commit('setDataSource',  { id: this.idDash, searchid: this.currentId } );  // отправляем данные  в хранилище чтобы укзаать элемнету что он должен ссылаться на выбранный ИС
                  this.$store.commit('setModalSearch',  { id: this.idDash, status: false } ); // закрываем окно
              }
          },
          cancelModal: function() {  // если нажали отмену
              this.$store.commit('setModalSearch',  { id: this.idDash, status: false } );  // просто закрываем окно
          },
          selectSearch: function(event,search) {  // функция для выбора одного элемента из списка
              let elem = event.target.parentElement; // получаем родителя в котором находятся все элементы
              elem.parentElement.childNodes.forEach( item => {  // пробегаемся по всем элементам
                  item.style = 'box-shadow: none';  // и отключаем  обводку
              });
              this.currentId = search.sid; // затем получаем текст всего ИС который выбрали
              elem.style = `box-shadow: 0px 0px 4px 3px  ${this.color.controlsActive}`;  // и делаем ему обводку
          },
           checkSid: function(sid) {
               let newSid = sid;
            if (sid.length > 5) {  // если там больше 10 символов
                newSid = sid.substring(0,5) + '...'; // обрезаем и добовляем троеточие
            }
            return newSid 
         },
    },
    created() {
        this.$store.commit('setModalSearch', { id: this.idDash, status: false });  // при создании окна на странице выключаем все открытые ранее окна
    }
}
</script>


<style lang="sass" scoped> 
  
    @import '../sass/modalSearch.sass'
   
  
</style>

