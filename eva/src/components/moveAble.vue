<template>
  <vue-draggable-resizable 
    :w="props.width" 
    :h="props.height" 
    :x="props.left" 
    :y="props.top"  
    :draggable="props.draggable" 
    :resizable="props.resizable" 
    :grid="props.grid"
    :style="{zIndex:props.zIndex, outlineColor: color.controlsActive, background: color.controlsActive, opacity:opacity }" 
    @dragging="onDrag"
    @resizing="onResize" 
    @dragstop="dragStopped" 
  >
    <dash-board 
      :dataModeFrom="dataMode" 
      :colorFrom="color" 
      :width="props.width"  
      :height="props.height"  
      :idDashFrom="idDash" 
      :dataPageFrom="dataPageFrom" 
      :dataElemFrom="id" 
      @moveElem="moveSwitch" 
      @resizeElem="resizeSwitch" 
      @SetLevel="props.zIndex = $event" 
      @sendMove="sendMove" 
      @sendSize="sizeSwitch" 
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
      props: {
        draggable: false,
        resizable: false,
        width: 0, // 0 не должен быть, по умолчанию беруться эти настройки
        height: 0, 
        top: 0,
        left: 0,
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
  },
  methods: {
    onResize: function (x, y, width, height) {  // получаем позицию и размер элемента
      this.props.top = x
      this.props.left = y
      this.props.width = width
      this.props.height = height
    },
    onDrag: function (x, y) {   // получаем позицию элемнета
      this.props.top = y
      this.props.left = x
      document.querySelector('.aplication').style.height =  `${document.body.scrollHeight}px`; // растягиваем контейнер на высоту страницы
    },
    dragStopped: function(left,top) {
      
      //let result = {top: 0, left: 0};
      let clientWidth = document.querySelector('#app').clientWidth;
      if (top < 50) {
        this.props.top = 70;
      } 
      if (left < 0) {
        this.props.left = 20;
      } 
      if ((left+this.props.width) >  clientWidth) {
        this.props.left = clientWidth - this.props.width - 20
      } 
    },
    resize(newRect) {  // если перемещение разрешено то будем заносить позицию и размер для смены даных о элементе
      if (this.props.draggable) {
        this.props.width = newRect.width;
        this.props.height = newRect.height;
        this.props.top = newRect.top;
        this.props.left = newRect.left;
      }
    },
    moveSwitch() {  // переключает возможность транспортировки
      this.props.draggable = !this.props.draggable;
    },
    sendMove() {  // отправляем позицию элемнета в хранилище
      let header;
      screen.width > 1400 ? header = 50 : header = 40;
      // let left = this.calcSizePx(this.props.left,'width');
      // let top = this.calcSizePx(this.props.top,'height');
      // this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});
      let top = Math.round((this.props.top-header)/this.step.hor);
      let left =  Math.round(this.props.left/this.step.vert);
      this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});
    },
    resizeSwitch() {  // переключаем возможность изменения размеров элемента
      this.props.resizable = !this.props.resizable;
      this.props.vue_drag_none = !this.props.vue_drag_none;
    },
    sizeSwitch() {  // отправляем размер элемента
    //  let width = this.calcSizePx(this.$el.offsetWidth,'width');
    //  let height = this.calcSizePx(this.$el.offsetHeight,'height');
    //  this.$store.commit('setSizeDash', {width: width, height: height, id: this.id, idDash: this.idDash});
      let width = Math.round(this.$el.offsetWidth/this.step.vert);
      let height = Math.round(this.$el.offsetHeight/this.step.hor);
      this.$store.commit('setSizeDash', {width: width, height: height, id: this.id, idDash: this.idDash});
    },
    // calcSizeProc(size,key) {
    //   let newSize = size;
    //   if (!Number(size)) {
    //     newSize = (parseFloat(size)*screen[key])/100;
    //   }
    //   return Number(newSize.toFixed(1))
    // },
    // calcSizePx(size,key) {
    //   return `${((size*100)/screen[key]).toFixed(1)}%`
    // },
    changeOpacity(event){
      this.opacity = event;
    }
  },
  created() {
    this.step = {vert: 60, hor: 60};
    let header;
    screen.width > 1400 ? header = 50 : header = 40;
    let pos = this.$store.getters.getPosDash({idDash: this.idDash, id: this.id});
    this.props.left = pos.left*this.step.vert;
    this.props.top = (pos.top*this.step.hor)+header;
    let size = this.$store.getters.getSizeDash({idDash: this.idDash, id: this.id});
    let width = size.width*this.step.vert;
    let height = size.height*this.step.hor;
    this.props.width = width;
    this.props.height =height;
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