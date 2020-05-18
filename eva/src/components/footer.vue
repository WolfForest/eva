<template >
    <div class="footer-block">
        {{version}}
    </div>    
</template>


<script>


export default {

    data () {
        return {
            version: 'v 1.6.1 [cssChange]'
        } 
    },
     computed: { 

     },  
     methods: {

     },
}


</script>

<style lang="sass" > 
  
   @import '../sass/footer.sass'

   
</style>