<template>
  <vue-draggable-resizable 
    ref="dragres"
    :w="width" 
    :h="height" 
    :x="left" 
    :y="top" 
    :draggable="dragRes" 
    :resizable="dragRes" 
    :data-grid="sizeGrid"
    :grid="props.grid"
    :style="{zIndex:props.zIndex, outlineColor: color.controlsActive, background: color.controlsActive, opacity:opacity }" 
    @resizestop="sendSize"
    @dragstop="sendMove" 
  >
    <dash-board 
      :dataModeFrom="dataMode" 
      :colorFrom="color" 
      :width="width"  
      :height="height"  
      :idDashFrom="idDash" 
      :dataPageFrom="dataPageFrom" 
      :dataElemFrom="id" 
      @SetLevel="props.zIndex = $event" 
      @SetOpacity="changeOpacity($event)" 
    />
  </vue-draggable-resizable>
</template>

<script>


export default {
  props: {
    dataModeFrom: null,
    idDashFrom: null,
    dataElem: null,
    colorFrom: null,
    dataPageFrom: null,
  },
  data () {
    return {
      opacity: 1,
      top: 0,
      left: 0,
      width: 0, // 0 не должен быть, по умолчанию беруться эти настройки
      height: 0,
      props: {
        vue_drag: false,
        zIndex: 1,
        step: {},
        grid: [60,60]
      }
    }
  },
  computed: {
    id: function() {  // название элемента, полученное от родителя
      return this.dataElem
    },
    idDash: function() {  // id страницы, полученное от родителя
      return this.idDashFrom
    },
    dataMode: function() {
      return this.dataModeFrom
    },
    color: function() {
      return this.colorFrom
    },
    dragRes: function() {
      let dragRes = this.$store.getters.getDragResize(this.idDash);
      dragRes == 'true' ? dragRes = true : dragRes = false;
      return dragRes;
    },
    sizeGrid: function() {
      let grid = this.$store.getters.getSizeGrid(this.idDash);
      if (grid.vert != '') {
        this.props.grid[0] = this.calcSizeGrid(grid.vert,'vert');
      }
      if (grid.hor != '') {
        this.props.grid[1] = this.calcSizeGrid(grid.hor,'hor');
      }
      this.drawElement();
      return true
    },
    headerTop: function (){
      if(document.body.clientWidth <=1400){
        return 40
      } else {
        return 50
      }
    },
  },
  watch: {
    top: function(val) {
       if(val <= this.headerTop){
         val = this.headerTop
       }
    },
    left: function() {
      let clientWidth = document.querySelector('#app').clientWidth;
  
      if (this.left < 0) {
        this.left = 0;
      } 
      if ((this.left+this.width) >  clientWidth) {
        this.left = clientWidth - this.width;
      } 
    },
  },
  methods: {
    calcSizeGrid: function(numb, type) {
      let size = 0;
      if (type == 'vert') {
        //toFixed(x) округление до х знака
        size = Number((document.body.clientWidth/Number(numb)).toFixed(1));
      } else {
        size = Number(((document.body.clientHeight-this.headerTop)/Number(numb)).toFixed(1));
      }
      return size

    },
    drawElement: function() {
      this.step = JSON.parse(JSON.stringify(this.$store.getters.getSizeGrid(this.idDash)));
      this.step.vert = Number((document.body.clientWidth/Number(this.step.vert)).toFixed(1));
      this.step.hor = Number(((document.body.clientHeight - this.headerTop)/Number(this.step.hor)).toFixed(1))
      let pos = this.$store.getters.getPosDash({idDash: this.idDash, id: this.id});

      this.left = pos.left*this.step.vert;
      this.top = pos.top*this.step.hor + this.headerTop;

      let size = this.$store.getters.getSizeDash({idDash: this.idDash, id: this.id});

      let width = size.width*this.step.vert;
      let height = size.height*this.step.hor;

      this.width = width;
      this.height =height;
    },
    sendMove(x,y) {  // отправляем позицию элемнета в хранилище
      let leftFrom = x;
      let topFrom = y;
      
      let top = Math.round((topFrom - this.headerTop)/this.step.hor)
      if (top < 0 ) { 
        top = 0
      }

      let left =  Number((leftFrom/this.step.vert).toFixed(1));
      if (left < 0 ) {
        left = 0
      }

      this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});

    },
    sendSize(x,y,width,height) {  // отправляем размер элемента
    //для количества ячеек по высоте  округляем до целого
      let top = Math.round((y - this.headerTop)/this.step.hor)
      let left =  Number((x/this.step.vert).toFixed(1));
      this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});

      let newWidth =  Number((width/this.step.vert).toFixed(1));
      let newHeight = Number((height/this.step.hor).toFixed(1));
      this.$store.commit('setSizeDash', {width: newWidth, height: newHeight, id: this.id, idDash: this.idDash});
      
    },
    changeOpacity(event){
      this.opacity = event;
    }
  },
  created() {
    this.drawElement()
  },
  updated() {
    if(this.$refs.dragres) {
      let _pos = this.$store.getters.getPosDash({idDash: this.idDash, id: this.id});
      let _shift = _pos.top * this.step.hor + this.headerTop
      this.$refs.dragres.$el.style.transform = `translate(${this.left}px, ${_shift}px)`;
    }
  },
}
</script>

<style >


.vdr {
  touch-action: none;
  position: absolute;
  box-sizing: border-box;
  outline: none ;
  border-radius: 4px;
  transition: transform ease 0.3s
}
.vdr.active.resizable{
  outline-color: inherit;
  outline: 2px dashed;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  width: 10px;
  height: 10px;
  background: inherit;
  z-index: 1;
}
.handle-tl {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}
.handle-tm {
  top: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: n-resize;
}
.handle-tr {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}
.handle-ml {
  top: 50%;
  margin-top: -5px;
  left: -5px;
  cursor: w-resize;
}
.handle-mr {
  top: 50%;
  margin-top: -5px;
  right: -5px;
  cursor: e-resize;
}
.handle-bl {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}
.handle-bm {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  cursor: s-resize;
}
.handle-br {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
@media only screen and (max-width: 768px) {
  [class*="handle-"]:before {
    content: '';
    left: -10px;
    right: -10px;
    bottom: -10px;
    top: -10px;
    position: absolute;
  }
}

 
</style>