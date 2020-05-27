<template >
    <v-app class="aut-app-profile">
      <header-top :inside="true" @permissions="setPermissions"></header-top>
       <v-content>
           <v-container  class="main-container" >
                <v-card class="card-aut-table">
                    <v-card-text>

                    <v-tabs   v-model="tab" :color='color.controls'  @change="getData" >
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab  :href="`#tab-${i}`" v-for="i in tabs.length" :key="i" >
                            {{tabs[i-1]}}
                        </v-tab>

                        <v-tab-item  class="item" v-for="i in tabs.length" :key="i" :value="`tab-${i}`">
                            <div class="loading-tab" v-if="dataLoading">
                                <v-skeleton-loader
                                    type="table-tbody"
                                    tile
                                ></v-skeleton-loader>
                            </div>
                            <div class="table-tab" v-if="!dataLoading">
                                <v-data-table
                                :headers="titles"
                                :items.sync="originData"
                                :items-per-page="15"
                                class="aut-table"
                                :sort-by="['roles']"
                                >
                                <template v-slot:item.color="{ item }">
                                    <div class="square-profile" :style={backgroundColor:item.color}></div>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-tooltip bottom :color='color.controlsActive'  >
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="editUser icon-aut" :color='color.controls' v-if="i == 1 ? true : showPencilRoot" v-model="item.actions" v-on="on" @click="editUser('edit',item,i)">{{pencil}}</v-icon>
                                        </template>
                                        <span>Редактировать</span>
                                    </v-tooltip>
                                    <v-tooltip bottom :color='color.controlsActive'  >
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="editUser icon-aut" :color='color.controls' v-if="adminRool" v-model="item.actions" v-on="on" @click="openDelete(item,i)">{{trash}}</v-icon>
                                        </template>
                                        <span>Удалить</span>
                                    </v-tooltip>
                                </template>
                              
                                </v-data-table>
                                <v-btn
                                    :color='color.controls'
                                    fab
                                    dark
                                    small
                                    absolute
                                    top
                                    v-if="adminRool"
                                    right
                                    @click="editUser('create','',i)"
                                >
                                <v-icon>{{plus}}</v-icon>
                                </v-btn>
                            </div>
                            

                        </v-tab-item>

                    </v-tabs>

                    </v-card-text>
                </v-card>
               
           </v-container> 
        </v-content>
        <footer-bottom></footer-bottom>
        <modal-profile :activeFrom ="activeModal" :colorFrom="color" :create="createSome" :keyFrom="keyFrom"  :curItemFrom="curItem" :passway="permission"  :userFrom="user" @cancelModal="closeModal"></modal-profile>
        <modal-delete-profile :activeDelete ="activeDelete" :colorFrom="color" :dataFrom="dataDelete" @cancelModal="closeModal"></modal-delete-profile>
    </v-app>
</template>


<script>

import {   mdiPencil,  mdiPlus, mdiTrashCanOutline  } from '@mdi/js'

export default {

    data () {
        return {
            user: {},
            pencil: mdiPencil,
            plus:  mdiPlus,
            trash: mdiTrashCanOutline,
            tab: 'tab-1',
            adminRoot: false,
            showPencilRoot: false,
            tabs: ['Пользователи','Роли','Привилегии','Группы','Индексы'],
            essence: ['user','role','permission','group','index'],
            titles: [],
            originData: [],
            dataLoading: true,
            activeModal: false,
            activeDelete: false,
            createSome: false,
            colorRow: false,
            keyFrom: null,
            dataDelete: {},
            user: {},
            curItem: {},
            permission: true,
            color: { 
                back: '#060606',
                backElement: '#191919',
                text: '#DADADA',
                controls: '#6e96c5',
                controlsSystem: '#004799',
                controlsActive: '#41C4FF',
                controlsInsideDash: '#DADADA',
                panel: '#0D0D0D',
                border: '#00000033',
            },
        } 
    },
     computed: { 
          adminRool: function() {
              return this.adminRoot
          }
     },  
     methods: {
        //  getCookie: function() {
        //      if(this.$jwt.hasToken()) {
        //             this.login = this.$jwt.decode().username;

        //             //this.role = this.$jwt.decode().role;
        //         } else {
        //             this.$router.push(`/`);
        //         }
        //  },
         setPermissions: function(event) {
            // let events = event.map( item => {
            //     return item.name
            // })
            if (event.includes('admin_all')) {
                this.adminRoot = true;
                this.permission = false;
                this.showPencilRoot = true;
            } 
            
         },
         editUser: function(act,item,key) {
                if (act == 'create') { 
                    this.user = {};
                    this.createSome = true;
                } else { 

                    // this.users.forEach( itemUser => {

                    //     if ( itemUser.username == item.username ) {
                    //         this.user = itemUser;
                    //     }
                    // });
                    this.user = item;
                    this.createSome = false;

                   

                }
                this.curItem = item;
                this.keyFrom = key;

                if (act!='create') {
                        switch(key){
                            case 1:
                                this.curItem.tab = 'user';
                            break
                            case 2:
                                this.curItem.tab = 'role';
                            break
                            case 3:
                                this.curItem.tab = 'permission';
                            break
                            case 4:
                                this.curItem.tab = 'group';
                            break
                            case 5:
                                this.curItem.tab = 'index';
                            break

                        }
                }
                //let caption = this.caption(key);
                // this.originData[caption].forEach( itemData => {
                //     if (itemData.id == item.id) {
                //         this.originData[this.essence[key-1]] = itemData;
                //     }
                // })

                this.activeModal = true;
         },
        getData: async function(event) {
                this.dataLoading = true;
                this.titles = this.setTitles(Number(event.split('-')[1]));
                this.originData = await this.setData(Number(event.split('-')[1]));
                
               //let caption = this.caption(event);
               // this.curData = Object.assign([], this.originData[caption]);
               // this.curData = JSON.parse(JSON.stringify(this.originData[caption]));
                if(this.originData.length) {
                    this.originData.forEach( (item,i) => {
                        Object.keys(item).forEach( itemopt => {
                            if (Array.isArray(item[itemopt])) {
                                this.originData[i][itemopt] = this.checkName(item[itemopt].join(', '));
                            }
                        })
                    });
                } else {
                    this.originData = [];
                }
                

                this.dataLoading = false;

        },
        setTitles: function(role) {
            let titles = [];
            switch(role) {
                case 1:
                    titles =     [
                        { text: 'Логин',  value: 'name',},
                        { text: 'Роли', value: 'roles' },
                        { text: 'Группы', value: 'groups' },
                        { text: '', value: 'actions' },
                    ]
                break
                case 2:
                    titles =     [
                        { text: 'Название',  value: 'name',},
                        { text: 'Пользователи', value: 'users' },
                        { text: 'Привилегии', value: 'permissions' },
                        { text: '', value: 'actions' },
                    ]
                break
                case 3:
                    titles =     [
                        { text: 'Название',  value: 'name',},
                        { text: 'Роли', value: 'roles' },
                        { text: '', value: 'actions' },
                    ]
                break
                case 4:
                    titles =     [
                        { text: 'Название',  value: 'name',},
                        { text: 'Цвет', value: 'color' },
                        { text: 'Индексы', value: 'indexes' },
                        { text: '', value: 'actions' },
                    ]
                break
                case 5:
                    titles =     [
                        { text: 'Название',  value: 'name',},
                        { text: 'Группы', value: 'groups' },
                        { text: '', value: 'actions' },
                    ]
                break
            }
            return titles;
        },
        setData: async function(role) {
            return await this.$store.auth.getters.getEssenceList(role,false)


            // switch(role) {
            //     case 1:

            //         data = await this.$store.auth.getters.getEssenceList(role);

            //     break
            //     case 2:
            //         data = [
            //                 {
            //                     name: 'admin',
            //                     users: this.checkName('admin'),
            //                     rights: this.checkName('admin_all, user'),
            //                     actions: '',
            //                 },
            //                 {
            //                     name: 'user',
            //                     users: this.checkName('user'),
            //                     rights: this.checkName('user'),
            //                     actions: '',
            //                 },
                            
            //         ];
            //     break
            //     case 3:
            //         data = [
            //                 {
            //                     name: 'admin_all',
            //                     roles: this.checkName('admin'),
            //                     actions: '',
            //                 },
            //                 {
            //                     name: 'user',
            //                     roles: this.checkName('user'),
            //                     actions: '',
            //                 },
            //         ];
            //     break
            //     case 4:
            //         data = [
            //                 {
            //                     name: 'Orange',
            //                     color: '#F96100',
            //                     indexes: this.checkName('index-1, index-2, index-3, index-4'),
            //                     actions: '',
            //                 },
            //                 {
            //                     name: 'Blue',
            //                     color: '#002FFE',
            //                     indexes: this.checkName('index-5, index-6, index-7, index-8'),
            //                     actions: '',
            //                 },
            //         ];
            //     break
            //     case 5:
            //         data = [
            //                 {
            //                     name: 'index-1',
            //                     groups: this.checkName('Orange,Blue'),
            //                     actions: '',
            //                 },
            //                 {
            //                     name: 'index-2',
            //                     groups: this.checkName('Orange'),
            //                     actions: '',
            //                 },
            //         ];
            //     break
            // }
          //  return data;
        },
        // caption: function(event) {
        //     if (this.essence[event-1] == 'index') {
        //         return `${this.essence[event-1]}es`;
        //     } else {
        //         return `${this.essence[event-1]}s`;
        //     }
        // },
        checkName: function(name) {
            if (name.length > 25) {
               return name.slice(0, 25) + '...'
            }
            return name
        },
        openDelete: function(item,i) {
            let text = '';
            this.keyFrom = i;
            switch(i){
                case 1:
                    text = `<p>Удалить пользователя</p> `;
                break
                case 2:
                    text = `<p>Удалить роль</p> `;
                break
                case 3:
                    text = `<p>Удалить привилегию</p> `;
                break
                case 4:
                    text = `<p>Удалить группу</p> `;
                break
                case 5:
                    text = `<p>Удалить индекс</p> `;
                break
            }
            this.dataDelete.text = `${text} <span>${item.name}</span>`;
            this.dataDelete.id = item.id; 
            this.dataDelete.essence = i;
            this.activeDelete = true;
        },
        closeModal: function() {
           this.activeDelete = false;
           this.activeModal = false;
           this.getData(`tab-${this.keyFrom}`);
        },
    },
    mounted() {
        this.getData('tab-1');
    } 
}


</script>

<style lang="sass" > 
  
   @import '../../sass/profile.sass'

   
</style>