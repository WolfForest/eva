<template >
    <div class="tile-template">
        <div class="dash-tile" :style="{height:`${height-otstupBottom}px`}" v-show="!noMsg">
            <div class="tile-block" >
                <div class="tile" v-for="i in dataRest.length" :key="i"  @click="setClick(dataRest[i-1])" :style="{backgroundColor:dataRest[i-1].color,border: `3px inset ${borderColor(dataRest[i-1].border)}`,width:widthTile,height:heightTile}">
                    <p  v-html="checkName(dataRest[i-1].caption)"></p>
                </div>
            </div>
        </div>
        <div class="errormsg" v-show="noMsg">{{msgText}}</div>
    </div>
</template>

 
<script>


export default {
    props: {  // переменные полученные от родителя
        idFrom: null,  // id элемнета (table, graph-2)
        idDashFrom: null, // id дашборда 
        dataRestFrom: null, // данные полученые после выполнения запроса
        colorFrom: null,  // цветовые переменные
        sizeTileFrom: null,
        heightFrom: null,
    },
    data () {
        return {
            actions: [
                {
                    name:'click',
                    capture: []
                },
            ],
            captures: {},
            noMsg: false,
            msgText: '',
            otstupBottom: 50,
            // sizeTile: {
            //     width: '100px',
            //     height: '100px'
            // },
        } 
    },
     computed: {  // осоновные параметры, которые чатсо меняются и которы следует отслеживать
         id: function() { 
               return this.idFrom
        },
        idDash: function() { 
               return this.idDashFrom
        },
        dataRest: function() {
            let data = [];
             if (!this.dataRestFrom.length || this.dataRestFrom.length == 0) {
                this.noMsg = true;
                this.msgText = "Нет данных для отображения";
            } else if (!this.dataRestFrom[0].caption || !this.dataRestFrom[0].color) {
                this.noMsg = true;
                this.msgText = "Ожидается поле caption и color";
             } else {
                 this.noMsg = false;
                 this.dataRestFrom.forEach( (item) => {
                        data.push({...{},...item})
                })
                 this.captures = Object.keys(this.dataRestFrom[0]);
             }
            if (screen.width <= 1600) {
                this.otstupBottom = 35;
            }
            return data
        },
        color: function() {
            return this.colorFrom
        },
        height: function() {
            return this.heightFrom
        },
        widthTile: function() {
            return this.setSize('width')
        },
         heightTile: function() {
            return this.setSize('height')
        },
        // sizeTile: function() {
        //     let size = this.sizeTileFrom;
        //     console.log(size);
        //     if (!size.width || size.width == '') {
        //         size.width = '100px';
        //     } else {
        //         console.log(size.width);
        //     }
        //     if (!size.height || size.height == '') {
        //         size.height = '100px';
        //     }
        //     console.log(size);
        //     return size
        // }
     }, 
     watch: {
        captures: function (captures) {
           this.actions[0].capture =  captures;
           this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
        },
    },
     methods: {
        setClick: function(item) {

               let tockens = this.$store.getters.getTockens(this.idDash);
               let tocken = {};
     
                Object.keys(tockens).forEach( i =>{
                    tocken = {
                        name: tockens[i].name,
                        action: tockens[i].action,
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == 'click') {
                        this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: item[tockens[i].capture], store: this.$store });
                    } 
                })

                 
                let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: 'empty'});
            
                if (events.length != 0) {
                    events.forEach( item => {
                        if(item.action == 'set'){
                            this.$store.commit('letEventSet', {events: events, idDash: this.idDash,  });
                        } else if (item.action == 'go') {
                                this.$store.commit('letEventGo', {event: item, idDash: this.idDash, route: this.$router, store: this.$store  });
                        }
                    })
                }


        },
        checkName: function(name) {
            return name.replace('\\n','<br>');
        },
        setSize: function(sizeFrom) {
            let size = '';
            if (this.sizeTileFrom[sizeFrom] == '') {
                size = '100px';
            } else {
                if (this.sizeTileFrom[sizeFrom].indexOf('px') != -1) {
                    size = this.sizeTileFrom[sizeFrom];
                } else {
                    size = `${this.sizeTileFrom[sizeFrom]}px`
                }
            }
            return size
        },
        borderColor: function(border) {
            if (border == '1') {
                 return this.colorFrom.controlsSystem 
            } else if (border == '0' || border == null) { 
                return 'transparent'
            } else {
                return border
            }
        }
        
    },
    mounted() {
        //  В первый раз раскомментить чтобы создать события для элемнета, а затем лучше закоментить чтобы каждый раз не обращаться к store
      //  this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
    } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashTile.sass'

   
</style>