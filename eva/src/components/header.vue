<template >
    <div class="header-block" :style="{background: color.back}">
        <div class="aut-panel">
            <div class="nav-btn">
                <div class="title-main">EVA</div>
                <v-tooltip bottom color="#FF6D70" >
                    <template v-slot:activator="{ on }">
                        <v-icon class="home"  color="teal" v-on="on" @click="toHome">{{home}}</v-icon>
                    </template>
                    <span>На главную</span>
                </v-tooltip>
                <v-tooltip bottom color="#FF6D70" >
                    <template v-slot:activator="{ on }">
                        <v-icon class="undo"  color="teal" v-on="on" @click="toBackward">{{undo}}</v-icon>
                    </template>
                    <span>Назад</span>
                </v-tooltip>
            </div>
           <div class="manage-btn">
                <div class="id-user">{{login}} | </div>
                <v-tooltip bottom color="#FF6D70" >
                    <template v-slot:activator="{ on }">
                        <v-icon class="edit icon-aut" :color="colorError" v-on="on" @click="openLogs()">{{log}}</v-icon>
                    </template>
                    <span>Просмотреть логи</span>
                </v-tooltip>
                <v-tooltip bottom color="#FF6D70" v-if="!inside" >
                    <template v-slot:activator="{ on }">
                        <v-icon class="edit icon-aut" color="teal" v-on="on" @click="edit">{{userEdit}}</v-icon>
                    </template>
                    <span>Редактировать профиль</span>
                </v-tooltip>
                <v-tooltip bottom color="#FF6D70"  >
                    <template v-slot:activator="{ on }">
                        <v-icon class="exit icon-aut" color="teal" v-on="on" @click="exit">{{door}}</v-icon>
                    </template>
                    <span>Выйти из профиля</span>
                </v-tooltip>
           </div>   
        </div>
        <v-divider></v-divider> 
        <modal-log :modalActive="modalActive"  @cancelModal="modalActive=false" ></modal-log>
    </div>    
</template>


<script>

import { mdiDoor, mdiAccountEdit, mdiUndoVariant,  mdiHomeVariantOutline, mdiPencil, mdiScriptTextOutline } from '@mdi/js'

import VueJWT from 'vuejs-jwt'

Vue.use(VueJWT, {'storage': 'cookie','keyName':'eva_token'})

export default {
    props: {
        inside: null
    },
    data () {
        return {
            login: '',
            user: {},
            door: mdiDoor,
            userEdit: mdiAccountEdit,
            log: mdiScriptTextOutline,
            modalActive:false,
            home: mdiHomeVariantOutline,
            undo: mdiUndoVariant,
        } 
    },
     computed: { 
         color: function() {
             return this.$store.getters.getColor
         },
         colorError: function() {
             if (this.$store.getters.getColorError) {
                 return '#FF6D70'
             } else {
                 return 'teal'
             }
         }
     },  
     methods: {
         getCookie: async function() {
                if(this.$jwt.hasToken()) {
                   // token = this.$jwt.getToken();
                    // this.unicid = (this.$jwt.decode());
                    this.login = this.$jwt.decode().username;
                    let id = this.$jwt.decode().user_id;
                    let permissions = [];

                    let response = await fetch(`/api/user/permissions`)
                    .catch (error => {
                        console.log(error);
                        return {status: 300, result: 'Post не создался, возможно из-за неточностей в запросе'}
                    }) 

                   
                    if (response.status == 200) {  // если получилось
                            await response.json().then( res => {  // переводим полученные данные из json в нормальный объект
                                permissions = res.data;
                                this.$emit('permissions',permissions);
                                this.$emit('setUsername',this.login);
                                this.$emit('checkOver');
                            }) 
                    }  else {
                        // permissions = ['all'];
                        // this.$emit('permissions',permissions);
                    }


                    // this.role = this.$jwt.decode().role;
                    
                     
                } else {
                    this.$router.push(`/`);
                }

                // if (this.unicid == null) {
                //     this.$router.push(`/`);
                // } 

         },
         exit: function() {
             document.cookie = `eva-dashPage=''; max-age=0 ; path=/`;
             document.cookie = `eva_token=''; max-age=0 ; path=/`;
             this.$store.commit('clearState');
             this.$router.push(`/`);
         },
         edit: function() {

            this.$router.push(`/profile`); 
           // this.$router.push(`/profile`); 
         },
         toHome: function() {
             this.$router.push(`/main`);
         },
         toBackward: function() {
             this.$router.go(-1);
         },
         openLogs: function() {
            this.modalActive=true;
            this.$store.commit('setErrorLogs',false);
         }
    },
    mounted() {
        this.getCookie();
    } 
}


</script>

<style lang="sass" > 
  
   @import '../sass/header.sass'

   
</style>