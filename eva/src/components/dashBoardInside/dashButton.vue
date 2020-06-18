<template>
  <div 
    class="dash-button" 
    :options="options" 
    style="padding: 0" 
    @click="setClick"
  >
    <div 
      class="name" 
      :style="{color:optionsData.colorText,height:`${height}px`,lineHeight:`${height-dataMode}px`,background:optionsData.background}"
    >
      {{ optionsData.name }}
    </div>
  </div>
</template>


<script>


export default {
  props: {  // переменные полученные от родителя
    idFrom: null,  // id элемнета (table, graph-2)
    idDashFrom: null, // id дашборда 
    colorFrom: null,  // цветовые переменные
    widthFrom: null, // ширина родительского компонента
    heightFrom: null, // выоста родительского компонента
    dataModeFrom: null,
  },
  data () {
    return {
      // actions: [
      //     {name:'click',
      //         capture: []
      //     },
      // ],
      optionsData: {
        'name': '',
        'background': '',
        'colorText': ''
      }, 
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
    height: function() {
      return this.heightFrom
    },
    dataMode: function() {
      if (this.dataModeFrom) {
        return 35
      } else {
        return 0
      }
    },
    options: function() {
      let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
      if (options.color || options.backgroundcolor || options.name) {
        this.optionsData.name = options.name;
        this.optionsData.background = options.backgroundcolor;
        this.optionsData.colorText = options.color;
      }  else {
        this.optionsData.name = '';
        this.optionsData.background = 'transparent';
        this.optionsData.colorText = this.color.text;
      }
      return true
    }
  },  
  methods: {
    actionOpen: function(targetLink, header ,widthPersent, heightPersent) {
      //размер нового окна
      const _width = screen.width*widthPersent;
      const _height = screen.height*heightPersent;

      //устанавливаем положение нового окна.
      const _left = (screen.width - screen.width*widthPersent) / 2;
      const _top = (screen.height - screen.height*heightPersent) / 3;
      
      //адрес перехода
      const _link =`${window.location.origin}/dashboards/${targetLink}${header==='false'|| header==='0' ?'?header=false':''}`
      window.open(_link, '', 'width=' + _width + ', height=' + _height + ', top=' + _top + ', left=' + _left);
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
          } else if (item.action.toLowerCase() === 'open'.toLowerCase()){//если экшен open
            this.actionOpen(item.target.toLowerCase(), item.header, item.widthPersent, item.heightPersent)
          }
        })
      }
    }
  },
  mounted() {
    this.$emit('hideDS',this.id);
    this.$emit('hideLoading');
  } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashButton.sass'

   
</style>