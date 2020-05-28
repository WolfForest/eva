<template >
    <div class="dash-select" >
        <div class="select-with-data" v-if="show" ref = "selectBlock">
               <div class="arrow-block">
                    <v-icon class=" arrow-down arrows-select" :color="color.controls" v-if="!open" @click="openSelect">{{down}}</v-icon>
                    <v-icon class=" arrow-up arrows-select" :color="color.controlsActive" v-if="open" @click="openSelect">{{up}}</v-icon>
                </div>
                <div class="source"  :class="{source_show:source_show}" :style="{width:widthInput}">
                    <v-select  :items="this.dataRest" :color="color.controls"  v-model="elem" :data-elem="dataelem" hide-details  outlined class="select-parent"  @change="getItem('elem')"   :loading="dataLoading" @focus="setColorSelect($event)" label="Столбец данных" ></v-select> 
                    <v-select  :items="this.dataRest" :color="color.controls" v-model="elemlink" :data-elem="dataelemlink" hide-details  outlined class="select-parent"  @change="getItem('elemlink')"  :loading="dataLoading" @focus="setColorSelect($event)" label="Связанный столбец данных" ></v-select> 
                </div>
                 <div class="target" :style="{width:widthInput,borderColor:color.text}" :class="{select_show:select_show}"> 
                    <v-autocomplete  :items="this.dataRestDeep"  solo flat :multiple="multiple"     v-model="elemDeep[String(multiple)]" :color="color.controls" :data-elem="dataelemDeep" hide-details  class="select"  @change="setTocken"  @focus="setColorSelect($event)"   label="Значение" >
                        <template v-slot:prepend-item v-if="multiple">
                            <v-list-item
                                ripple
                                @click="selectItems"
                            >
                                <v-list-item-action>
                                <v-icon :color="elemDeep[String(multiple)].length > 0 ? color.controls : color.text">{{ chooseIcon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                <v-list-item-title>{{chooseText}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                        </template>  
                    </v-autocomplete> 
                 </div> 
               
        </div>
        <div class="error-msg" v-if="!show">{{message}}</div>
    </div>
</template>


<script> 

 import { mdiArrowDownBoldBoxOutline, mdiArrowUpBoldBoxOutline, mdiCropSquare, mdiSquare   } from '@mdi/js'; 


export default {
    props: {
        idFrom: null,
        idDashFrom: null,
        dataRestFrom: null,
        colorFrom: null,
        dataLoadingFrom: null,
        widthFrom: null,
    },
    data () {
        return {  
            message: '',
            show: true,
            elem: "Выберите столбец данных",
            elemlink: "Выберите связанный столбец данных",
            elemDeep: {
                'true' : [],
                'false' : '',
            },
            topArray: [],
            bottomArray: [],
            open: true,
            down: mdiArrowDownBoldBoxOutline,
            up: mdiArrowUpBoldBoxOutline,
            source_show: true,
            select_show: false,
            dataFromRest: {},
            legends: {},
            chooseText: 'Выбрать все',
            chooseIcon: mdiCropSquare,
            actions: [
                   {name:'click',
                   capture: []
                   },
                   {name:'change',
                   capture:[]
                   },
                   {name:'mouseover',
                   capture:[]
                   },
                ],
        } 
    },
     computed: {
        id: function() { 
               return this.idFrom
        },
        idDash: function() { 
               return this.idDashFrom
        },
        dataReady: function() {
            let data = [];
            if (this.dataRestFrom != null) {
                data = this.dataRestFrom;
            } 
            return data
           
        },
        color: function() {
            return this.colorFrom
        },
        widthInput: function() {
            return `${this.widthFrom-70}px`
        },
        multiple: function() {
               let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
                if(options.multiple){
                    return options.multiple
                 } else {
                     return false
                 }
        },
        dataRest: function() {
                let data = [];
                if (this.dataReady.length > 0) {
                    data = Object.keys(this.dataReady);
                    this.show = true;
                    if (Object.keys(this.dataReady).length != 0) {
                        if (this.dataReady.error) {
                            this.message = this.dataReady.error;
                            this.show = false;
                        } else {
                                data = Object.keys(this.dataReady[0]);
                            // this.elem = data[0];
                        } 
                    }
                    this.dataFromRest = data;
                }

            return data
        },
        dataRestDeep: function() {
              
                let res = [];
                if (this.dataReady.length > 0) {
                    let data = this.dataReady;
                    res = Object.values(data).map( item => {
                        return item[this.elem];
                    })
                        res = this.filterSelect(res,this.elemDeep.true);
                }
            
            //this.elemDeep = res[0];
            return res

        },
        dataelem: function() {
            if (this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elem == '') {
                this.elem = 'Выберите столбец данных'
            }
            return this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elem
        },
        dataelemlink: function() {
            if (this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elemlink == '') {
                this.elemlink = 'Выберите связанный столбец данных'
            }
            return this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elemlink
        },
        dataelemDeep: function() {
           
            if (this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elemDeep == '') {
                String(this.multiple) == 'true' ?  this.elemDeep[String(this.multiple)] = [] :  this.elemDeep[String(this.multiple)] = '';
                // this.source_show = true;
                // this.open = true;
                // this.select_show = false;
            }
            return this.$store.getters.getSelected({idDash: this.idDash, id: this.id }).elemDeep
        },
         dataLoading: function() {
             return this.dataLoadingFrom
        },
     },  
     methods: {
        getItem: function(element) {
                switch (element){
                    case 'elem':
                        this.$store.commit('setSelected', {element: 'elem',value: this.elem, idDash: this.idDash, id: this.id });
                        break
                    case 'elemlink':
                        this.$store.commit('setSelected', {element: 'elemlink',value: this.elemlink, idDash: this.idDash, id: this.id });
                        break
                }
                if (this.elem != 'Выберите элемент' && this.elemlink != 'Выберите связанный столбец данных') {
                    this.openSelect();
                }
                this.chooseText = 'Очистить Все';
                this.selectItems();


        },
        openSelect: function() {
            this.source_show = !this.source_show;
            this.open = !this.open;
            this.select_show = !this.select_show;
        },
        selectItems: function() {
             if (this.chooseText == 'Выбрать все') {
                    this.chooseText = 'Очистить Все';
                    this.chooseIcon = mdiSquare;
                    this.elemDeep.true = [...this.topArray,...this.bottomArray];
             } else {
                this.chooseText = 'Выбрать все';
                this.chooseIcon = mdiCropSquare;
                this.elemDeep.true = [];
             }
             this.$store.commit('setSelected', {element: 'elemDeep',value: this.elemDeep.true, idDash: this.idDash, id: this.id });
        },
         filterSelect: function(res,selected) {
                let data = [...[],...res];
                data = data.filter( elem => {
                    if (!selected.includes(elem)) {
                        return elem
                    }
                })


                this.topArray = sorted(selected);
                this.bottomArray = sorted(data);
                

                data = [...this.topArray,...this.bottomArray];
               
                function sorted(data) {
                    let reg = new RegExp( /\d/, "g");
                        
                        if (reg.exec(data[0])) {
                            data = data.sort( (a,b) => {
                                // let amass = a.split('');
                                // let bmass = b.split('');
                                // let res = null;
                                // for (let i=0; i<amass.length-1;i++) {

                                        
                                //      if ((Number(amass[i]) && Number(bmass[i])) || amass[i] != bmass[i] ) {
                                            
                                //             a = amass[i];
                                //             b = bmass[i];
                                //             let j = 1;
                                //             while (amass[i+j] == 0 || Number(amass[i+j] )) {
                                //                 a += amass[i+j];
                                //                 j++
                                //             }
                                //             j = 1;
                                //             while (bmass[i+j] == 0 || Number(bmass[i+j])) {
                                //                     b += bmass[i+j];
                                //                 j++
                                //             }
                                //             console.log(a,b)
                                //             console.log('------')




                                //            if (a<b) {
                                //               res = -1;
                                //           } else {
                                //               res = 1;
                                //           }

                                //            break
                                //      }
                                // }

                               // (a < b) ? -1 : (a > b) ? 1 : 0; 
                                return a-b
                            });
                        } else {
                            data = data.sort();
                        }
                    return data
                }

                
            
             return data
         },
         setTocken: function() {
            
            this.$store.commit('setSelected', {element: 'elemDeep',value: this.elemDeep[String(this.multiple)], idDash: this.idDash, id: this.id });
            let tockens = this.$store.getters.getTockens(this.idDash);
            let name = '';
            let curTocken = {};
            let data = this.dataReady;
            Object.keys(tockens).forEach( i =>{
                if (tockens[i].elem == this.id && tockens[i].action == 'change') {
                    curTocken = tockens[i];
                    name = tockens[i].name;
                }
            })
            let value = null;
             if (String(this.multiple) == 'true') {
                 value = [...[],...this.elemDeep[String(this.multiple)]];
                for (let i = 0; i < data.length; i++) {
                    value.forEach((deep,j) => {
                        if (data[i][this.elem] == deep) {
                            value[j] = data[i][this.elemlink];
                        }
                    })
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i][this.elem] == this.elemDeep[String(this.multiple)]) {
                        value = [data[i][this.elemlink]];
                        break
                    }
                }
            }


            if (curTocken.prefix && curTocken.prefix != '') {
                value = value.map( item => {
                    return `${curTocken.prefix}${item}`;
                })
            }
            if (curTocken.sufix && curTocken.sufix != '') {
                value = value.map( item => {
                    return `${item}${curTocken.sufix}`;
                })
            }
            if (curTocken.delimetr && curTocken.delimetr != '') {
                value = value.join(curTocken.delimetr);
            } else {
               value = value.join(','); 
            }
            
            // Object.values(data).forEach( item => {
            //     console.log(item[this.elemlink])
            //     if (item[this.elem] == this.elemDeep) {
            //         value = item[this.elemlink];
            //     }
                
            // })
            

            let  tocken = {
                        name: name,
                        action: 'change',
                        capture : '',
                    }
            if (name != '') {
                
                
                this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: value, store: this.$store });

               

                // let searches = this.$store.getters.getSearches(this.idDash);
                // let response = {};

                //     searches.forEach( async item => {
                //         if (item.original_spl.indexOf(`$${tocken.name}`) != -1  ) {  // если в тексте запроса есть наш токен

                //                 response = await this.$store.getters.getDataApi({search: item, idDash: this.idDash});
                //                 if ( response.status == 200) {
                //                         let responseDB = this.$store.getters.putIntoDB(response.result, item.sid, this.idDash);
                //                         responseDB
                //                             .then(
                //                                 result => {
                //                                 let refresh =  this.$store.getters.refreshElements(this.idDash, item.sid, );
                //                                 },
                //                             );
                //                     }
                //             }
                //     });
            }
        },
        setColorSelect: function(event) {
             document.querySelectorAll('.v-menu__content').forEach( item => {
                    item.style.boxShadow = `0 5px 5px -3px ${this.color.border},0 8px 10px 1px ${this.color.border},0 3px 14px 2px ${this.color.border}`;
                    item.style.background = this.color.back;
                    item.style.color = this.color.text;
                    item.style.border = `1px solid ${this.color.border}`;
                })
        },
    },  
    mounted() {
       this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
       let selected =  this.$store.getters.getSelected({idDash: this.idDash, id: this.id })
       if (selected){
            selected.elem ? this.elem = selected.elem : false;
            selected.elemlink ? this.elemlink = selected.elemlink : false;
            if (this.elem != 'Выберите элемент' && this.elemlink != 'Выберите связанный столбец данных') {
                    this.openSelect();
            }
            if (selected.elemDeep.length != 0 || selected.elemDeep != '')  {
                this.elemDeep[String(this.multiple)] = selected.elemDeep;
                this.chooseText = 'Очистить Все';
                this.chooseIcon = mdiSquare;
            } else {
                this.chooseText = 'Выбрать все';
                this.chooseIcon = mdiCropSquare;
            }

       }

       
    }, 
}

 
</script>

<style lang="sass" > 
  
    @import '../../sass/dashSelect.sass'

   
</style>