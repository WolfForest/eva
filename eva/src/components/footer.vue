<template>
  <div 
    class="footer-block" 
    :style="{color: color.text}"
  >
    {{ version }}
  </div>    
</template>


<script>


export default {

  data () {
    return {
      version: 'v 1.28.13 [orderTooltip]',
      color: { 
        text: '#DADADA',
      },
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