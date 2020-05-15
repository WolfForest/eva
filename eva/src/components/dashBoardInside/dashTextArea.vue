<template >
    <div class="dash-textArea" >
        <div class="button-container">
            <v-btn small :color="color.controls" class="accept-btn" @click="acceptTextArea">Подтвердить</v-btn>
        </div>
        <v-textarea :color="color.text" outlined hide-details class="textarea-itself"   :rows="rows" v-model="textarea"></v-textarea>
    </div>
</template>


<script>


export default {
    props: {  // переменные полученные от родителя
        idFrom: null,  // id элемнета (table, graph-2)
        idDashFrom: null, // id дашборда 
        colorFrom: null,  // цветовые переменные
        heightFrom: null, // выоста родительского компонента
    },
    data () {
        return {
            actions: [
                   {name:'accept',
                     capture: []
                   },
                ],
            textarea: ''
        } 
    },
     computed: {  // осоновные параметры, которые чатсо меняются и которы следует отслеживать
        id: function() { 
            return this.idFrom
        },
        idDash: function() { 
            return this.idDashFrom
        },
        color: function() {
            return this.colorFrom
        },
        rows: function() {
            let rowsCount = 20;
            if (screen.width< 1400) {
                rowsCount = 15;
            }
            if (screen.width > 1920) {
                rowsCount = 25;
            }
            let rows = Math.floor((this.heightFrom-200)/rowsCount);
            return rows
        }
     },  
     methods: {
        acceptTextArea: function() {
            this.$store.commit('setTextArea', {idDash: this.idDash, id: this.id, textarea: this.textarea});
            this.setTocken();
        },
         setTocken: function() {
            let tockens = this.$store.getters.getTockens(this.idDash);
            let name = '';
            Object.keys(tockens).forEach( i =>{
                if (tockens[i].elem == this.id && tockens[i].action == 'accept') {
                    name = tockens[i].name;
                }
            })
            let textarea = this.textarea.replace(/\n/g,' ');
            let  tocken = {
                name: name,
                action: 'accept',
                capture : '',
            };
                
            this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: textarea, store: this.$store });

            
        },
    },
    mounted() {
        this.$emit('hideDS',this.id);
       // this.$emit('hideLoading');
        this.textarea = this.$store.getters.getTextArea({idDash: this.idDash, id: this.id});
        this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
    } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashTextArea.sass'

   
</style>