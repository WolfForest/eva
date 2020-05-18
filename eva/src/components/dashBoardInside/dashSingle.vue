<template >
    <div class="dash-single" ref="single">
        <v-card class="number-block" v-show="!noMsg"  outlined :loading="dataLoading" :lookSize="changeSize" @click="setClick">
            <div class="number"  :style="{fontSize:`${fontSize}px`}" >
                <div class="number-itself" :style={color:color}>{{number}}</div>
                <div class="number-sub" :style="{color:colorFrom.text}">{{subnumber}}</div>
            </div>
        </v-card>
        <div class="errormsg" v-show="noMsg">{{msgText}}</div>
    </div>
</template>


<script>


export default {
    props: {
        idFrom: null,
        idDashFrom: null,
        dataRestFrom: null,
        dataLoadingFrom: null,
        widthFrom: null,
        colorFrom: null,
    },
    data () {
        return {
            actions: [
                   {name:'click',
                   capture: []
                   },
                ],
            noMsg: true,
            msgText: 'Нет данных для отображения'
        } 
    },
     computed: {
        id: function() { 
               return this.idFrom
        },
        idDash: function() { 
               return this.idDashFrom
        },
        dataRest: function() {
            return this.dataRestFrom
        },
        dataLoading: function() {
             return this.dataLoadingFrom
        },
        number: function() {
             if (Object.keys(this.dataRest).length != 0) {
                 let number =  Object.values(this.dataRest[0])[0];
                 this.setEventColor(number);
                 this.noMsg = false;
                 return number 
             } else {
                 this.noMsg = true;
                 return ''
             }
        },
        subnumber: function() {
               let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
               // if(options.subnumber){
                    return options.subnumber
                // } else {
                //     return ''
                // }
        },
        fontSize: function() {
               let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
                if(options.fontSize){
                    return options.fontSize.split('px')[0]
                 } else {
                     return '30'
                 }
        },
        color: function() {
                let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
                let color = this.colorFrom.controls;
                if(options.color){
                    color = options.color;
                }  
                return color
        },
        changeSize: function() {
            let width = this.widthFrom; // присваиваем просто чтобы указать за каким свойством следить
            return true
        },
     },  
     methods: {
        //   fontSize: function(number) {
              
        //      let size  = this.$refs.single.getBoundingClientRect();
        //      let count = number.toString().length;
        //     // console.log(Math.floor(size.width*0.7));
        //      let k = 1;
        //      if (count < 7) {
        //          k = 0.7;
        //      } else if (count < 9) {
        //          k = 1;
        //      } else if (count < 13) {
        //          k = 1.4;
        //      } else if (count < 16) {
        //          k = 1.8;
        //      }

        //      this.$refs.number.style = `font-size: ${Math.floor(size.width/k)}%`;
        //     // let sizeNumb = this.$refs.number.getBoundingClientRect();
        //     // let sizes = {
        //     //     wasw: Math.floor(sizeNumb.width/count),
        //     //     wash:  Number(this.$refs.number.style['font-size'].split('px')[0]),
        //     //     bew: Math.floor((size.width / count)-20),
        //     //     beh: null
        //     // }
        //     // let procent =  Math.floor((sizes.wasw*100)/sizes.bew);
        //     // sizes.beh = Math.floor((sizes.wash*100)/procent); 
        //     // console.log(size.width);



           

        // },
        setEventColor: function(number) {

         
                let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'OnDataCompare', element: this.id});
                
                let resEvents=[],flag = -1,frontier;

              events.forEach( (item,j) => {


                    switch(item['compare']) {
                                                        
                        case 'equals':  
                                if (Number(item.sense) == Number(number)) {
                                    flag = 0;
                                }
                        break

                        case 'over':  
                             if (Number(item.sense) > Number(number))  {
                                 flag = 0;
                             }
                        break

                        case 'less':  
                            if (Number(item.sense) < Number(number))  {
                                 flag = 0;
                            }
                        break

                        case 'in':  
                                frontier = item.sense.replace(/\[|\]/g, '').split(',');
                                frontier.forEach( itemFron => {
                                    if (Number(number) == Number(itemFron))  {
                                       flag = 0; 
                                    }
                                })

                        break

                        case 'between': 
                            frontier = item.sense.replace(/\[|\]/g, '').split(',');
                            if ( Number(number) < Number(frontier[1]) && Number(number) > Number(frontier[0]))  {
                                 flag = 0;
                            }
                            
                        break

                     }

                    if (flag != -1) {
                        this.$store.commit('letEventSet', {events: [{target: item.target,prop: item.prop[0],value: item.value[0]}], idDash: this.idDash,  });
                    } else {
                        this.$store.commit('letEventSet', {events: [{target: item.target,prop: item.prop[0],value: ''}], idDash: this.idDash,  });
                    }
                    flag = -1;
              });
            
         },
        setClick: function() {
            let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: 'empty'});
             if (events.length != 0) {
                 events.forEach( item => {
                     if(item.action == 'set'){
                         this.$store.commit('letEventSet', {events: events, idDash: this.idDash,  });
                     } else if (item.action == 'go') {
                            this.$store.commit('letEventGo', {event: item, idDash: this.idDash });
                            this.$router.push(`/dashboards/${item.target.toLowerCase()}`);
                     }
                 })
             }
        }
    },
    mounted() {
        //  В первый раз раскомментить чтобы создать события для элемнета, а затем лучше закоментить чтобы каждый раз не обращаться к store
        this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
       // this.$refs.number.style = 'font-size: 30px';
    },
    // updated() {
    //         let sizeNumb = this.$refs.number.querySelector('.number-itself');
    //         if (sizeNumb.innerText.length !=0) {
    //             this.fontSize(this.number);
    //         }
    // } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashSingle.sass'

   
</style>