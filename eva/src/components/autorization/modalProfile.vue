<template>
    <v-dialog  v-model="active"  :width="width" persistent @keydown="checkEsc($event)">
        <v-card v-if="passway" class="passcard">
            <v-card-text class="card-text-profile">
                <div class="headline">Изменить пароль</div>
                <v-text-field label="Старый пароль" :color="colorFrom.controls"  class="field-profile"  v-model="oldpass" type="password" outlined  hide-details clearable></v-text-field>
                <v-text-field label="Новый пароль" :color="colorFrom.controls"  class="field-profile"  v-model="newpass" type="password" outlined  hide-details clearable></v-text-field>

            </v-card-text>
            <div class="msg-profile" :class="{openMsg:openMsg}" :style="{color:colorMsg}">{{msg}}</div>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small  :color="colorFrom.controlsSystem" class="profile-btn" @click="changeBtn('pass')">Изменить</v-btn>
            <v-btn small :color="colorFrom.controlsActive" class="profile-btn" @click="cancelModal">Отмена</v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-if="!passway" class="profile-tab">

            <v-card-text   class="card-text-profile">
                <div class="headline">{{titleModal}}</div>

                <div class="profile-block" v-if="showBlock.users">
                    <v-text-field label="Логин пользователя" :color="colorFrom.controls"  class="field-profile"  v-model="userData.username"  outlined  hide-details clearable></v-text-field>
                    <v-text-field label="Пароль пользователя" :color="colorFrom.controls"  autocomplete="new-password" class="field-profile" placeholder="********"  v-model="userData.pass" type="password" outlined  hide-details clearable></v-text-field>
                    
                    <!--  v-for="item in Object.keys(user.tab)" :key="item" -->
                    <data-profile v-for="item in Object.keys(user.tab)" :key="item" :colorFrom="colorFrom"  essence="user" :dataFrom="dataRest" @changeData="changeData"  :subessence="item" :create="create"  :activeFrom="activeFrom" ></data-profile>

                    <!-- <v-select  :items="roles" color="teal" v-model="user.role" hide-details  outlined class="select-profile field-profile"   label="Роль пользователя" ></v-select> 
                    <v-textarea color="teal" outlined hide-details class="field-profile" no-resize height="130px" rows="5" label="Группы пользователя" v-model="user.groups" placeholder="data science; data engeneer"></v-textarea>
                    <v-textarea color="teal" outlined hide-details class="field-profile" no-resize height="130px" rows="5" label="Индексы пользователя" v-model="user.indexes" placeholder="index-1; index-2"></v-textarea> -->
                </div>

                <div class="profile-block" v-if="showBlock.roles">
                    <v-text-field label="Название роли" :color="colorFrom.controls"  class="field-profile"  v-model="curItem.name"  outlined  hide-details clearable></v-text-field>
                    <data-profile v-for="item in Object.keys(role.tab)" :key="item"  essence="role"  :dataFrom="dataRest" @changeData="changeData" :subessence="item" :create="create" :activeFrom="activeFrom" ></data-profile>
                </div>

                <div class="profile-block" v-if="showBlock.permissions">
                    <v-text-field label="Название привилегии" :color="colorFrom.controls"  class="field-profile"  v-model="curItem.name"  outlined  hide-details clearable></v-text-field>
                    <data-profile v-for="item in Object.keys(permission.tab)" :key="item"  essence="permission" :dataFrom="dataRest" @changeData="changeData" :subessence="item" :create="create" :activeFrom="activeFrom" ></data-profile>
                </div>

                <div class="profile-block" v-if="showBlock.groups">
                    <v-text-field label="Название группы" :color="colorFrom.controls"  class="field-profile"  v-model="curItem.name"  outlined  hide-details clearable></v-text-field>
                    <div class="zagolovok-values">Изменить цвет группы</div>
                    <v-color-picker class="colorPicker" v-model="curItem.color"></v-color-picker>
                    <data-profile v-for="item in Object.keys(group.tab)" :key="item"  essence="group" :dataFrom="dataRest" @changeData="changeData" :subessence="item" :create="create" :activeFrom="activeFrom" ></data-profile>
                </div>

                 <div class="profile-block" v-if="showBlock.indexes">
                    <v-text-field label="Название индекса" :color="colorFrom.controls"  class="field-profile"  v-model="curItem.name"  outlined  hide-details clearable></v-text-field>             
                    <data-profile v-for="item in Object.keys(index.tab)" :key="item"  essence="index" :dataFrom="dataRest" @changeData="changeData" :subessence="item" :create="create" :activeFrom="activeFrom" ></data-profile>
                </div>
            </v-card-text>

            <!-- <v-card-text class="card-text-profile">
                <div class="headline">{{titleModal}}</div>
                
            </v-card-text>-->

            <div class="msg-profile" :class="{openMsg:openMsg}" :style="{color:colorMsg}">{{msg}}</div> 
            <v-card-actions class="action-btn">
            <v-spacer></v-spacer>
            <v-btn small  :color="colorFrom.controlsSystem" class="profile-btn" @click="changeBtn(create)">{{btnMsg}}</v-btn>
            <v-btn small :color="colorFrom.controlsActive" class="profile-btn" @click="cancelModal">Отмена</v-btn>
            </v-card-actions>
        </v-card>
      
    </v-dialog>
</template>


<script>

import {  } from '@mdi/js'

export default {
    props: {
        activeFrom: null,
        passway: null,
        create: null,
        userFrom: null,
        keyFrom: null,
        curItemFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            oldpass: '',
            newpass: '',
            msg: '',
            openMsg: false,
            colorMsg: '',
            userData: {},
            essence: ['user','role','permission','group','index'],
            user: {
                tab: {
                    roles: null,
                    groups: null,
                },
            },
            role: {
                tab: {
                    users: null,
                    permissions: null
                },
            },
            permission: {
                tab: {
                    roles: null,
                },
            },
            group: {
                tab: {
                    users: null,
                    dashs: null,
                    indexes: null,
                },
            },
            index: {
                tab: {
                    groups: null,
                },
            },
            showBlock: {
                users: true,
                roles: false,
                permissions: false,
                groups: false,
                indexes: false 
            },
            curItem: {},
            changedData: {},
            dataRest: {}
        } 
    },
    //  asyncComputed: {
    //     async datatoSend() { 
    //         if (this.activeFrom) {
    //             return await this.getDataForEssence()
    //         }
    //     }
    //  },
     computed: { 
         active: function() {
             if (this.activeFrom) {
                 if (Object.keys(this.userFrom).length != 0) {
                    this.userData.username = this.userFrom.username;
                    this.userData.pass = '';
                 } else {
                    this.userData.username = '';
                    this.userData.pass = ''; 
                 }
                 Object.keys(this.showBlock).forEach( item => {
                      this.showBlock[item] = false;
                 })

                

                 switch(this.keyFrom) {
                    case 1:
                       this.showBlock.users = true; 
                    break
                    case 2:
                       this.showBlock.roles = true; 
                    break
                    case 3:
                       this.showBlock.permissions = true; 
                    break
                    case 4:
                       this.showBlock.groups = true; 
                    break
                    case 5:
                       this.showBlock.indexes = true; 
                    break
                 }
                if (this.create) {
                    this.$set(this.userData,'username','');
                    this.$set(this.userData,'pass','');
                    this.$set(this.curItem,'color','');
                    this.$set(this.curItem,'name','');
                } else {
                   this.$set(this.userData,'username',this.curItemFrom.name);
                   this.curItem = Object.assign({},this.curItemFrom);
                }
                this.dataRest = this.getDataForEssence();

             }
             return this.activeFrom
         },
         width: function() {
             if (this.passway) {
                 return '400px'
             } else {
                 return '90%'
             }
         },
         titleModal: function() {
             let text = '';
             if (this.create) {
                 switch(this.keyFrom) {
                    case 1:
                       text = 'Создать нового пользователя'; 
                    break
                    case 2:
                       text = 'Создать новую роль';  
                    break
                    case 3:
                       text = 'Создать новую привилегию';
                    break
                    case 4:
                       text = 'Создать новую группу';
                    break
                    case 5:
                       text = 'Создать новый индекс'; 
                    break
                 }
                 return text
             } else {
                 switch(this.keyFrom) {
                    case 1:
                       text = 'Редактировать данные пользователя'; 
                    break
                    case 2:
                       text = 'Редактировать роль';  
                    break
                    case 3:
                       text = 'Редактировать привилегию';  
                    break
                    case 4:
                       text = 'Редактировать группу';
                    break
                    case 5:
                       text = 'Редактировать индекс'; 
                    break
                 }
             }
             return text
         },
         btnMsg: function() {
             if (this.create) {
                 return 'Создать'
             } else {
                 return 'Редактировать'
             }
         },
     },  
     methods: {
        getDataForEssence: async  function() {
               // console.log('asdad')
            // if (this.activeFrom) {
                
            // }

           // return 'asdasd'
              
                if (this.create) {
                   let role = this.essence[this.keyFrom-1];
                   let allData = {};
                   let keys =[];
                   let promise = Object.keys(this.$data[role].tab).map(  item => {
                       keys.push(item);
                       return this.$store.auth.getters.getEssenceList(item,true);
                   })
                   
                   
                 let result =  await Promise.all(promise);
                 result.forEach( (item,i) => {
                     allData[keys[i]] = item;
                 })
                
                  return allData
                //     Object.keys(this.$data[role].tab).forEach( async item => {

                //        allData[item] = await this.$store.auth.getters.getEssenceList(item,true);

                //    })

                   // return allData
                  // console.log('----')
                 //  return  this.$store.auth.getters.getEssence(this.userFrom.tab,'')
                }
                return this.$store.auth.getters.getEssence(this.userFrom.tab,this.userFrom.id)
           // }
        },
        cancelModal: function() {
            this.$emit('cancelModal');
        },
         checkEsc: function(event) {
              if (event.code =="Escape") {
                  this.cancelModal();
              }
          },
        changeBtn: function(act) {
            // console.log(this.keyFrom);
            
            let method = 'POST';
            let formData = {};  // формируем объект для передачи RESTу
            let sameMsg = "";
            switch(this.keyFrom){
                case 1:
                        formData.id = this.userFrom.id;
                        method = 'PUT';
                        this.msg = "Пароль не может быть пустым";
                        if (act == true) {

                                method = 'POST';
                                if (this.userData.pass.length == 0 || !this.userData.pass) {
                                    this.msg = "Логин или пароль не могут быть пустыми"; 
                                    this.openMsg = true;
                                    this.colorMsg = '#FF6D70';
                                    setTimeout( () => {
                                        this.openMsg = false;
                                    },2000);
                                    return false
                                }

                                if(this.userData.pass.length < 7){
                                        this.msg = "Пароль должен быть больше 7 символов"; 
                                        this.openMsg = true;
                                        this.colorMsg = '#FF6D70';
                                        setTimeout( () => {
                                            this.openMsg = false;
                                        },2000);
                                        return false
                                }
                                formData.password =this.userData.pass;
                            
                        } else if (act == 'pass') {
                            if (this.oldpass == null || this.oldpass.length == 0  || !this.oldpass) {
                                this.msg = "Введите старый пароль"; 
                                this.openMsg = true;
                                this.colorMsg = '#FF6D70';
                                setTimeout( () => {
                                    this.openMsg = false;
                                },2000);
                                return false
                            } else if (this.newpass == null || this.newpass.length == 0 ||  !this.newpass) {
                                this.msg = "Введите новый пароль"; 
                                this.openMsg = true;
                                this.colorMsg = '#FF6D70';
                                setTimeout( () => {
                                    this.openMsg = false;
                                },2000);
                                return false
                            } else  if (this.newpass.length < 7 ) {
                                this.msg = "Пароль должен быть больше 7 символов"; 
                                this.openMsg = true;
                                this.colorMsg = '#FF6D70';
                                setTimeout( () => {
                                    this.openMsg = false;
                                },2000);
                                return false
                            } else  if (this.newpass == this.oldpass ) {
                                this.msg = "Пароли не должны совпадать"; 
                                this.openMsg = true;
                                this.colorMsg = '#FF6D70';
                                setTimeout( () => {
                                    this.openMsg = false;
                                },2000);
                                return false
                            } else {
                                formData.old_password = this.oldpass;
                                formData.new_password = this.newpass;
                            }
                        } else {
                            if (this.userData.pass.length != 0 && this.userData.pass) {
                                  
                                  if(this.userData.pass.length < 7){
                                        this.msg = "Пароль должен быть больше 7 символов"; 
                                        this.openMsg = true;
                                        this.colorMsg = '#FF6D70';
                                        setTimeout( () => {
                                            this.openMsg = false;
                                        },2000);
                                        return false
                                  } else {
                                      formData.password =this.userData.pass;
                                  }
                            }
                        }
                        formData.name =this.userData.username ;
                        sameMsg = "Такой пользователь уже есть";
                break
                case 2:
                    if (!this.create) {
                        formData.id = this.userFrom.id;
                        method = 'PUT';
                    } 
                    formData.name = this.curItem.name;
                    sameMsg = "Такая роль уже есть";
                break
                case 3:
                    if (!this.create) {
                        formData.id = this.userFrom.id;
                        method = 'PUT';
                    } 
                    formData.name = this.curItem.name;
                    sameMsg = "Такая привилегия уже есть";
                break
                case 4:
                    if (!this.create) {
                        formData.id = this.userFrom.id;
                        method = 'PUT';
                    } 
                    formData.name =  this.curItem.name ;
                    formData.color =this.curItem.color ;
                    sameMsg = "Такая группа уже есть";
                break
                case 5:
                    if (!this.create) {
                        formData.id = this.userFrom.id;
                        method = 'PUT';
                    } 
                    formData.name =  this.curItem.name ;
                    sameMsg = "Такой индекс уже есть";
                break
            } 


            
            if (Object.keys(this.changedData).length != 0) {
                let essence = this.changedData[this.essence[this.keyFrom-1]];
                Object.keys(essence).forEach( item => {
                    if (essence[item].length != 0) {
                         essence[item].forEach( itemEs => {
                            if (!formData[item]) {
                               formData[item] = []; 
                            }
                            formData[item].push(itemEs);
                        })
                    } else {
                        formData[item] = []; 
                    }
                   
                })
            }

            

            let response = this.$store.auth.getters.setEssence({formData: JSON.stringify(formData), essence: this.essence[this.keyFrom-1],method: method});
            
            response.then( res => {
                if (res.status == 200){
                    this.cancelModal();
                } else if (res.status == 409) {
                    this.msg = sameMsg; 
                    this.openMsg = true;
                    this.colorMsg = '#FF6D70';
                    setTimeout( () => {
                        this.openMsg = false;
                    },2000);
                } else if (res.status == 403) {
                    this.msg = ''; 
                    this.openMsg = true;
                    this.colorMsg = '#FF6D70';
                    setTimeout( () => {
                        this.openMsg = false;
                    },2000);
                }
            })

        },
        changeData: function(event) {
            if (!this.changedData[event.essence]) {
                this.changedData[event.essence] = {}; 
            }
            this.changedData[event.essence][event.subessence] = event.data;
            
        }
    },
}


</script>

<style lang="sass" > 
  
   @import '../../sass/modalProfile.sass'

   
</style>