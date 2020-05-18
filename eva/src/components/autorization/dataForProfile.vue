<template>
    <div class="field-profile more-data" :data-active="active" >
        <div class="headline">{{alldata[essence][`${subessence}Name`]}}</div>
            <v-tabs   v-model="alldata[essence].tab[subessence]" :color='colorFrom.controls' @change="switchTab">
                <v-tabs-slider></v-tabs-slider>
                <v-tab  :href="`#tab-1`" >
                    {{alldata[essence][`${subessence}TabName`].tab1}}
                </v-tab>
                    <v-tab  :href="`#tab-2`" >
                    {{alldata[essence][`${subessence}TabName`].tab2}}
                </v-tab>


                <v-tab-item  class="item"  :value="'tab-1'">
                    <v-skeleton-loader
                        type="table-tbody"
                        tile
                        v-if="loaders[essence][subessence]"
                        class="skeleton-loader"
                    ></v-skeleton-loader>
                    <v-text-field v-model="searchText" v-if="!loaders[essence][subessence]" :append-icon="search"  label="Поиск" class="search-row" :color='colorFrom.controls'  single-line hide-details ></v-text-field>
                    <div class="table-profile-block" v-if="!loaders[essence][subessence]">
                            <v-data-table
                            hide-default-header
                            :no-data-text="alldata[essence][subessence].nodata"
                            v-model="alldata[essence][subessence].selected"
                            :headers="alldata[essence][subessence].titles"
                            :items="alldata[essence][subessence].data"
                            item-key="name"
                            show-select
                            :search="searchText"
                        >
                        </v-data-table>
                    </div>
                    <div class="control-btn">
                        <v-btn small  :color='colorFrom.controlsActive' class="control-btn-itself" @click="deleteSelected(subessence)" >{{alldata[essence][`${subessence}DeleteName`].del1}}</v-btn>
                    </div> 
                </v-tab-item>

                <v-tab-item  class="item"  :value="'tab-2'">
                    <v-skeleton-loader
                        type="table-tbody"
                        tile
                        v-if="loaders[essence][`all${subessence}`]"
                        class="skeleton-loader"
                    ></v-skeleton-loader>
                     <v-text-field v-model="searchText" v-if="!loaders[essence][`all${subessence}`]" :append-icon="search"  label="Поиск" class="search-row" :color='colorFrom.controls'  single-line hide-details ></v-text-field>
                    <div class="table-profile-block" v-if="!loaders[essence][`all${subessence}`]">
                            <v-data-table
                            hide-default-header
                            :no-data-text="alldata[essence][subessence].nodata"
                            v-model="alldata[essence][`all${subessence}`].selected"
                            :headers="alldata[essence][`all${subessence}`].titles"
                            :items="alldata[essence][`all${subessence}`].data"
                            item-key="name"
                            show-select
                            :search="searchText"
                        >
                        </v-data-table>
                    </div>
                    <div class="control-btn">
                        <v-btn small  :color='colorFrom.controls' class="control-btn-itself" @click="addSelected(subessence)">{{alldata[essence][`${subessence}DeleteName`].del2}}</v-btn>
                    </div> 
                </v-tab-item>
            </v-tabs>
    </div>
</template>


<script>

import { mdiMagnify } from '@mdi/js'

export default {
    props: {
        essence: null,
        subessence: null,
        create: null,
        activeFrom: null,
        dataFrom: null,
        nameGroupFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            search: mdiMagnify,
            searchText: '',
            alldata: {
                user: {
                    tab: {
                        roles: 'tab-1',
                        groups: 'tab-1',
                    },
                    rolesName: 'Управление ролями',
                    rolesTabName: {
                        tab1: 'Роли пользователя',
                        tab2: 'Все роли'
                    },
                    rolesDeleteName: {
                        del1: 'Удалить роли пользователя',
                        del2: 'Добавить роли пользователю'
                    },
                    roles: {},
                    allroles: {},
                    groupsName: 'Управление группами',
                    groupsTabName: {
                        tab1: 'Группы пользователя',
                        tab2: 'Все группы'
                    },
                    groupsDeleteName: {
                        del1: 'Удалить группы пользователя',
                        del2: 'Добавить группы пользователю'
                    },
                    groups: {},
                    allgroups: {},
                },
                role: {
                    tab: {
                        users: 'tab-1',
                        permissions: 'tab-1'
                    },
                    usersName: 'Управление пользователями',
                    usersTabName: {
                        tab1: 'Пользователи роли',
                        tab2: 'Все пользователи'
                    },
                    usersDeleteName: {
                        del1: 'Удалить  пользователя',
                        del2: 'Добавить  пользователя'
                    },
                    users: {},
                    allusers: {},
                    permissionsName: 'Управление привилегиями',
                    permissionsTabName: {
                        tab1: 'Привилегии роли',
                        tab2: 'Все привилегии'
                    },
                    permissionsDeleteName: {
                        del1: 'Удалить  привилегию',
                        del2: 'Добавить  привилегию'
                    },
                    permissions: {},
                    allpermissions: {},
                },
                permission: {
                    tab: {
                        users: 'tab-1',
                    },
                    rolesName: 'Управление ролями',
                    rolesTabName: {
                        tab1: 'Роли пользователя',
                        tab2: 'Все роли'
                    },
                    rolesDeleteName: {
                        del1: 'Удалить роли пользователя',
                        del2: 'Добавить роли пользователю'
                    },
                    roles: {},
                    allroles: {},
                },
                group: {
                    tab: {
                        users: 'tab-1',
                        dashs: 'tab-1',
                        indexes: 'tab-1',
                    },
                    usersName: 'Управление пользователями',
                    usersTabName: {
                        tab1: 'Пользователи группы',
                        tab2: 'Все пользователи'
                    },
                    usersDeleteName: {
                        del1: 'Удалить  пользователя',
                        del2: 'Добавить  пользователя'
                    },
                    users: {},
                    allusers: {},
                    dashsName: 'Управление дашбордами',
                    dashsTabName: {
                        tab1: 'Дашборды группы',
                        tab2: 'Все дашборды'
                    },
                    dashsDeleteName: {
                        del1: 'Удалить дашборды группы',
                        del2: 'Добавить дашборды группе'
                    },
                    dashs: {},
                    alldushs: {},
                    indexesName: 'Управление индексами',
                    indexesTabName: {
                        tab1: 'Индексы группы',
                        tab2: 'Все индексы'
                    },
                    indexesDeleteName: {
                        del1: 'Удалить индексы группы',
                        del2: 'Добавить индексы группе'
                    },
                    indexes: {},
                    allindexes: {},
                },
                index: {
                    tab: {
                        groups: 'tab-1',
                    },
                    groupsName: 'Управление группами',
                    groupsTabName: {
                        tab1: 'Группы индекса',
                        tab2: 'Все группы'
                    },
                    groupsDeleteName: {
                        del1: 'Удалить группы индекса',
                        del2: 'Добавить группы индексу'
                    },
                    groups: {},
                    allgroups: {},
                },
                // dashGroup: {
                //     tab: {
                //         dashs: 'tab-1',
                //     },
                //     dashsName: 'Управление дашбордами',
                //     dashsTabName: {
                //         tab1: 'Дашборды группы',
                //         tab2: 'Все дашборды'
                //     },
                //     dashsDeleteName: {
                //         del1: 'Удалить дашборды группы',
                //         del2: 'Добавить дашборды группе'
                //     },
                //     dashs: {},
                //     alldashs: {},
                // },
                dash: {
                    tab: {
                        groups: 'tab-1',
                    },
                    groupsName: 'Управление группами',
                    groupsTabName: {
                        tab1: 'Группы дашборда',
                        tab2: 'Все группы'
                    },
                    groupsDeleteName: {
                        del1: 'Удалить группы дашборда',
                        del2: 'Добавить группы дашборду'
                    },
                    groups: {},
                    allgroups: {},
                },
            }, 
            loaders: {
                user: {
                    roles: true,
                    allroles: true,
                    groups: true,
                    allgroups: true,
                },
                role: {
                    users: true,
                    allusers: true,
                    permissions: true,
                    allpermissions: true,
                },
                permission: {
                    roles: true,
                    allroles: true,
                },
                group: {
                    users: true,
                    allusers: true,
                    dashs: true,
                    alldashs: true,
                    indexes: true,
                    allindexes: true
                },
                index: {
                    groups: true,
                    allgroups: true,
                },
                dashGroup: {
                    dashs: true,
                    alldashs: true,
                },
                dash: {
                    groups: true,
                    allgroups: true,
                },
            },
            noneText: {
                users: 'Пользователи не выбраны',
                roles: 'Роли не выбраны',
                permissions: 'Привилегии не выбраны',
                groups: 'Группы не выбраны',
                indexs: 'Индексы не выбраны',
                dashs: 'Дашборды не выбраны'
            }
        }
    },
     computed: { 
         active: function() {
            let essence = this.essence;
            if (this.create) {
                this.alldata[essence].tab.users = 'tab-2';
                this.alldata[essence].tab.roles = 'tab-2';
                this.alldata[essence].tab.permissions = 'tab-2';
                this.alldata[essence].tab.groups = 'tab-2';
                this.alldata[essence].tab.indexes = 'tab-2';
                this.alldata[essence].tab.dashs = 'tab-2';
            } else {
                this.alldata[essence].tab.users = 'tab-1';
                this.alldata[essence].tab.roles = 'tab-1';
                this.alldata[essence].tab.permissions = 'tab-1';
                this.alldata[essence].tab.groups = 'tab-1';
                this.alldata[essence].tab.indexes = 'tab-1';
                this.alldata[essence].tab.dashs = 'tab-1';
            }
            if (this.activeFrom) {
                this.switchTab();
            }
             return this.activeFrom
         },
         
     }, 
     methods: {
           getData: async function() {
                   let essence = this.essence;
                   let subessence = this.subessence;
                   let data = await this.dataFrom;
                //    console.log(`-----`)
                    // Object.keys(data).forEach( async item => {
                    //     data[item] = await data[item];
                    // }) 
                   //console.log(data);
              // console.log(subessence);
                //    console.log(`-----`) 

                  
                   if (this.create) {
                        if (essence == 'dash') {
                            this.alldata[essence][subessence] = {
                                selected: [],
                                nodata: this.noneText[subessence],
                                titles: [{ text: 'Название',  value: 'name'}],
                                data: [{name: this.nameGroupFrom}]
                            };
                            this.$emit('changeData',{data:this.translateToArray([{name: this.nameGroupFrom}]), essence: essence, subessence: subessence });
                        } else {
                            this.alldata[essence][subessence] = {
                                selected: [],
                                nodata: this.noneText[subessence],
                                titles: [{ text: 'Название',  value: 'name'}],
                                data: []
                            };
                        } 
                   } else {

                        this.alldata[essence][subessence] = {
                            selected: [],
                            nodata: this.noneText[subessence],
                            titles: [{ text: 'Название',  value: 'name'}],
                            //data: await this.$store.auth.getters.getRoles(essence,this.userFrom)
                            data: this.translateToObj(data.data[subessence])
                          //data: []
                        };
                   }
                   
                    this.alldata[essence][`all${subessence}`] = {
                        selected: [],
                        nodata: this.noneText[subessence],
                        titles: [{ text: 'Название',  value: 'name'}],
                         //  data: await this.$store.auth.getters.getRolesList()
                        data: this.translateToObj(data[subessence])
                    };
                    
                    this.loaders[essence][subessence] = false;
                    this.loaders[essence][`all${subessence}`] = false;

                //    if (this.create) {
                //         this.alldata[essence].roles = {
                //             selected: [],
                //             nodata: 'Роли не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: []
                //         }; 
                        
                //    } else {
                //         this.alldata[essence].roles = {
                //             selected: [],
                //             nodata: 'Роли не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             //data: await this.$store.auth.getters.getRoles(essence,this.userFrom)
                //             data: [
                //                 { name: 'admin_all'},
                //                 { name: 'user'},
                //             ]
                //         };
                //    }
                   
                //     this.alldata[essence].allroles = {
                //         selected: [],
                //         nodata: 'Роли не выбраны',
                //         titles: [{ text: 'Название',  value: 'name'}],
                //       //  data: await this.$store.auth.getters.getRolesList()
                //         data: [
                //                 { name: 'admin_all'},
                //                 { name: 'user'},
                //             ]
                //     };
                //     this.loaders[essence].roles = false;
                //     this.loaders[essence].allroles = false;

                //      if (this.create) {
                //         this.alldata[essence].permissions = {
                //             selected: [],
                //             nodata: 'Привилегии не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: []
                //         }; 
                        
                //    } else {
                //         this.alldata[essence].permissions = {
                //             selected: [],
                //             nodata: 'Привилегии не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: [
                //             { name: 'admin_all'},
                //             ]
                //         };
                //    }
                   
                //     this.alldata[essence].allpermissions = {
                //         selected: [],
                //         nodata: 'Привилегии не выбраны',
                //         titles: [{ text: 'Название',  value: 'name'}],
                //         data: [
                //         { name: 'admin_all'},
                //         { name: 'user'},
                //         ]
                //     };
                //     this.loaders[essence].permissions = false;
                //     this.loaders[essence].allpermissions = false;


                //     if (this.create) {
                //         this.alldata[essence].groups = {
                //             selected: [],
                //             nodata: 'Группы не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: []
                //         }; 
                        
                //    } else {
                //         this.alldata[essence].groups = {
                //             selected: [],
                //             nodata: 'Группы не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: [
                //             { name: 'Orange'},
                //             { name: 'Blue'},
                //             ]
                //         };
                //    }
                //     this.alldata[essence].allgroups = {
                //         selected: [],
                //         nodata: 'Группы не выбраны',
                //         titles: [{ text: 'Название',  value: 'name'}],
                //         data: [
                //         { name: 'Orange'},
                //         { name: 'Blue'},
                //         { name: 'Red'}
                //         ]
                //     };
                //     this.loaders[essence].groups = false;
                //     this.loaders[essence].allgroups = false;

                //     if (this.create) {
                //         this.alldata[essence].indexes = {
                //             selected: [],
                //             nodata: 'Индексы не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: []
                //         }; 
                        
                //    } else {
                //         this.alldata[essence].indexes = {
                //             selected: [],
                //             nodata: 'Индексы не выбраны',
                //             titles: [{ text: 'Название',  value: 'name'}],
                //             data: [
                //             { name: 'index-1'},
                //             { name: 'index-2'},
                //             ]
                //         };
                //     }
                //     this.alldata[essence].allindexes = {
                //         selected: [],
                //         nodata: 'Индексы не выбраны',
                //         titles: [{ text: 'Название',  value: 'name'}],
                //         data: [
                //         { name: 'index-1'},
                //         { name: 'index-2'},
                //         { name: 'index-3'},
                //         { name: 'index-4'},
                //         ]
                //     };
                //     this.loaders[essence].indexes = false
                //     this.loaders[essence].allindexes = false

        },
        switchTab: function() {
            Object.keys(this.loaders[this.essence]).forEach( item => {
                this.loaders[this.essence][item] = true
            })
                this.getData();
            
        },
        translateToObj: function(array){
            return array.map( item => {
                return {name:item}
            }) 
        },
        deleteSelected: function(subj) {
            let essence = this.essence;
            let subessence = this.subessence;
            let deleted = this.alldata[essence][subj].selected.map( item => { return item.name});

            this.alldata[essence][subj].data = this.alldata[essence][subj].data.filter(item => {
                if (!deleted.includes(item.name)) {
                    return item
                }
            });
            this.alldata[essence][subj].selected = [];
            this.$emit('changeData',{data:this.translateToArray(this.alldata[essence][subj].data), essence: essence, subessence: subessence });

        },
        addSelected: function(subj) {
            let essence = this.essence;
            let subessence = this.subessence;
            let added = this.alldata[essence][`all${subj}`].selected.map( item => { return item.name});
            let already = this.alldata[essence][subj].data.map( item => { return item.name});
            this.alldata[essence][`all${subj}`].data.forEach(item => {
                if (added.includes(item.name) && !already.includes(item.name)) {
                    this.alldata[essence][subj].data.push(item);
                }
            });
             this.alldata[essence][`all${subj}`].selected = [];
             this.alldata[essence].tab[subj] = 'tab-1';
             this.$emit('changeData',{data:this.translateToArray(this.alldata[essence][subj].data), essence: essence, subessence: subessence });
        },
        translateToArray: function(array) {
            return array.map( item => {
                return item.name
            })
        }

     }, 
}


</script>

<style lang="sass" > 
  
   @import '../../sass/dataForProfile.sass'

   
</style>