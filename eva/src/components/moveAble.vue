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
    top: function() {
      if (this.top < 0) {
        this.top = 50;
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
        size = Math.round(document.body.clientWidth/Number(numb));
      } else {
        size = Math.round((document.body.clientHeight-this.headerTop))/Number(numb);
      }
      return size

    },
    drawElement: function() {
      this.step = JSON.parse(JSON.stringify(this.$store.getters.getSizeGrid(this.idDash)));
      this.step.vert = Math.round(document.body.clientWidth/Number(this.step.vert));
      this.step.hor = Math.round((document.body.clientHeight-this.headerTop)/Number(this.step.hor));
     
      let header;
      screen.width > 1400 ? header = 50 : header = 40;
      let pos = this.$store.getters.getPosDash({idDash: this.idDash, id: this.id});
      
      this.left = pos.left*this.step.vert;
      this.top = (pos.top*this.step.hor)+header;
      let size = this.$store.getters.getSizeDash({idDash: this.idDash, id: this.id});
      let width = size.width*this.step.vert;
      let height = size.height*this.step.hor;
      this.width = width;
      this.height =height;

    },
    // onResize: function (x, y, width, height) {  // получаем позицию и размер элемента
    //   this.props.top = y
    //   this.props.left = x
    //   this.props.width = width
    //   this.props.height = height
      
    // },
    // onDrag: function (x, y) {   // получаем позицию элемнета
      
    //   this.props.top = y
    //   this.props.left = x
    //   document.querySelector('.aplication').style.height =  `${document.body.scrollHeight}px`; // растягиваем контейнер на высоту страницы
    // },
    // dragStopped: function(left,top) {
      
      
    //   //let result = {top: 0, left: 0};
    //   let clientWidth = document.querySelector('#app').clientWidth;
    //   if (top < 50) {
    //     this.props.top = 70;
    //   } 
    //   if (left < 0) {
    //     this.props.left = 20;
    //   } 
    //   if ((left+this.props.width) >  clientWidth) {
    //     this.props.left = clientWidth - this.props.width - 20
    //   } 
    // },
    // resize(newRect) {  // если перемещение разрешено то будем заносить позицию и размер для смены даных о элементе
    //   if (this.props.draggable) {
    //     this.props.width = newRect.width;
    //     this.props.height = newRect.height;
    //     this.props.top = newRect.top;
    //     this.props.left = newRect.left;
    //   }
    // },
    // moveSwitch() {  // переключает возможность транспортировки
    //   this.props.draggable = !this.props.draggable;
    // },
    sendMove(x,y) {  // отправляем позицию элемнета в хранилище
      let topFrom = y;
      let leftFrom = x;
      //let clientWidth = document.querySelector('#app').clientWidth;
   
      if (leftFrom < 0) {
        leftFrom = 0;
      } 
      // if ((left+this.props.width) >  clientWidth) {   ПОДУМАТЬ ОБ ЭТОМ
      //   this.props.left = clientWidth - this.props.width - 20
      // } 
      let header;
      screen.width > 1400 ? header = 50 : header = 40;
      let top = Math.round((topFrom-header)/this.step.hor);
      let left =  Math.round(leftFrom/this.step.vert);
      // if (top < 0) {
      //   top = 0;
      // } 
      // console.log(top)
      this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});

    },
    // resizeSwitch() {  // переключаем возможность изменения размеров элемента
    //   this.props.resizable = !this.props.resizable;
    //   this.props.vue_drag_none = !this.props.vue_drag_none;
    // },
    sendSize(x,y,width,height) {  // отправляем размер элемента
      let header;
      screen.width > 1400 ? header = 50 : header = 40;
      let top = Math.round((y-header)/this.step.hor);
      let left =  Math.round(x/this.step.vert);
      this.$store.commit('setPosDash', {top: top,left: left, id: this.id, idDash: this.idDash});
      let newWidth = Math.round(width/this.step.vert);
      let newHeight = Math.round(height/this.step.hor);
      this.$store.commit('setSizeDash', {width: newWidth, height: newHeight, id: this.id, idDash: this.idDash});
      
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
    this.drawElement()
  },
  updated() {
    if(this.$refs.dragres) {
      this.$refs.dragres.$el.style.transform = `translate(${this.left}px, ${this.top}px)`;
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