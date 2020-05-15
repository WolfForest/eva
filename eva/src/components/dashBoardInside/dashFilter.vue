<template >  
           <div class="filter-block">
                <v-select  :items="this.getDataStart" v-model="props.item" :loading="props.loading" hide-details  solo class="select"  @change="setItem" ></v-select> 
                <v-select  :items="props.items" v-model="props.sign"  hide-details  solo class="select"  @change="setSign" ></v-select>
                <v-text-field   v-model="props.value" solo clearable hide-details class="select"  @keydown.enter="setValue" ></v-text-field> 
           </div>
</template>



<script>




export default {
    data () {
        return {
            props: {
               id: '',
               selects: [],
               superheroes: [],
               loading: false,
               items: ['>','=','<'],
               item: '',
               sign: '=',
               value: '',
            }
        }
    },
    computed: {
       id: function() { 
               return this.$attrs['data-id']
        },
        shouldGet:  function() {

             
                  if (this.id){

                       return this.$store.getters.getShouldGet(this.id);
                   }
        
             
          },
           getDataStart: function() {
              

              
             if (this.shouldGet == true) { 
                

                let file = this.$store.getters.getFile(this.id);

                this.props.id = this.id;
                
                this.getData(file); 
                
             }
             
             return  this.props.selects;
         },



    },
     methods: {
        getData: async function(file) {

            this.props.loading = true;
          
            let response = await fetch(`src/js/${file}`);


            if(response.status == 404) {

              //  this.props.message = 'Такого файла нет'
                this.props.loading = false;

            } else if (response.status == 200) {
 
                let result = await response.json();


                this.createSelects(result.data);

                setTimeout( () => {
                
                this.props.superheroes = result.data;

                this.props.loading = false;

                this.$store.commit('setShouldGetData', { id: this.props.id, status: false});

                }, 1500);
    
            }

         },
           createSelects: function(result) {

            let selects = Object.keys(result[0]).map( item => {
                 return item
             });


             this.props.selects = selects;

         },
         setItem: function (item) {
                this.props.item = item;
                this.setFilter();
         },
         setSign: function (sign) {
             this.props.sign = sign;
             this.setFilter();
         },
         setValue: function (event) {
                this.props.value = event.target.value;
                this.setFilter();
         },
         setFilter: function() {
             let filter = `${this.props.item} ${this.props.sign} ${this.props.value}`;
             this.$store.commit('setFilter', { id: this.id, string: filter});
         }

    },
    mounted() {
    }
}


</script>

 <style lang="sass" > 
  
      @import '../../sass/dashFilter.sass'

 </style>