<template >
    <div class="dash-csvg" tabindex="0" ref="svgBlock" :style="{height:`${heightFrom-otstupBottom}px`}" >
        <div class="csvg-block"  :style="{width:`${widthFrom-40}px`,height:`${heightFrom-otstupBottom}px`}" v-html="svg" v-show="noMsg==1" ref="csvg"></div>
        <div class="file-input" v-show="noMsg==0">
            <v-file-input :prepend-icon="image" @change="file=$event" :color="color.controls" class="file-itself" hide-details  outlined label="Загрузить изображение"></v-file-input>
            <button class="file-btn" :style="{color: 'white', background: color.controls}" @click="setSvg">{{sendMsg}}</button>
            <div class="answer-block" :class="{answerShow:answerShow}" :style="{color:answerColor}">{{answer}}</div>
        </div>
        <div class="errormsg" v-show="noMsg==2">{{msgText}}</div>
        <v-icon class="icon file" :color="colorMsg" v-show="noMsg!=2" @click="noMsg==0?noMsg=1:noMsg=0">{{upload}}</v-icon>
        <div class="tooltip" :options="String(options)" ref="tooltip" :class="{tooltipShow:tooltipShow}" v-html="tooltipBody" :style="{backgroundColor:color.backElement, borderColor:color.text}"></div>
        <div class="link-canvas"  :class="{linkCanvasShow:linkCanvasShow}">
            <canvas ref="link" ></canvas>
        </div>
    </div>
</template> 


<script>

import {    mdiFileImageOutline, mdiUpload  } from '@mdi/js'


export default {
    props: {  // переменные полученные от родителя
        idFrom: null,  // id элемнета (table, graph-2)
        idDashFrom: null, // id дашборда 
        dataRestFrom: null, // данные полученые после выполнения запроса
        colorFrom: null,  // цветовые переменные
        widthFrom: null, // ширина родительского компонента
        heightFrom: null, // выоста родительского компонента
    },
    data () {
        return {
            actions: [
                   {
                    name:'click',
                    capture: []
                   },
                   {
                    name:'mouseover',
                    capture: []
                   },
                ],
            svg: '',
            noMsg: 1,
            msgText: 'Нет данных для отображения',
            sendMsg: 'Отправить изображение',
            image:  mdiFileImageOutline ,
            file: '',
            upload: mdiUpload,
            dataFrom: {},
            token: '',
            answer: 'Изображение успешно загружено',
            answerShow: false,
            answerColor: '',
            otstupBottom: 40,
            tooltipShow: false,
            linkCanvasShow: false,
            tooltipPress: false,
            tooltipBody: '',
            tooltipOptions: false
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
        colorMsg: function() {
            if (this.noMsg == 1) {
                return this.color.controls
            } else {
                return this.color.controlsActive
            }
        },
        options: function() {
          
           let options = this.$store.getters.getOptions({idDash: this.idDash, id: this.id});
           let tockens = this.$store.getters.getTockens(this.idDash);
           let tokenObj = {};
           let reg = '';
           let itemn = {};
           tockens.forEach( item => {
               tokenObj[item.name] = item.value;
           })

           this.tooltipOptions == true ? this.tooltipBody = '' : false;
           this.tooltipOptions = false;


           if (options.tooltip) {
                if (options.tooltip.texts.length != 0) {
                    options.tooltip.texts.forEach( item => {

                        Object.keys(tokenObj).forEach( token => {
                            if (item.indexOf(`$${token}$`) != -1) {
                                reg = new RegExp( `\\$${token}\\$`, "g");
                                item =  item.replace(reg, tokenObj[token]);
                            }
                        })   
                        this.tooltipBody += `<p>${item}</p>`;
                    })
                    this.tooltipBody += `<div class="white-space"></div>`; 
                    this.tooltipOptions = true;
                }

                if (options.tooltip.links.length != 0) {
                    options.tooltip.links.forEach( item => {
                        itemn = {...{},...item};
                        Object.keys(tokenObj).forEach( token => {
                            if (itemn.url.indexOf(`$${token}$`) != -1) {
                                reg = new RegExp( `\\$${token}\\$`, "g");
                                itemn.url =  itemn.url.replace(reg, tokenObj[token]);
                            }
                        }) 
                        this.tooltipBody += `<a href="${itemn.url}" target="_blank">${itemn.name}<span></span></a>`;
                    })
                    this.tooltipBody += `<div class="white-space"></div>`;
                    this.tooltipOptions = true
                }

                if (options.tooltip.buttons.length != 0) {
                    options.tooltip.buttons.forEach( item => {
                        this.tooltipBody += `<button data-id="${item.id}" class="tooltip-button" style="color: white; background: ${this.color.controls}">${item.name}</button>`;
                    })
                    this.tooltipOptions = true
                }


           }

           return options.change
        }

     },  
     watch: { 
         dataRestFrom: function(dataRest) {
            if (dataRest.length != 0 && dataRest[0].svg_filename && dataRest[0].svg_filename != '') {
                
                this.dataFrom = dataRest[0];
                this.getSvg(dataRest[0].svg_filename);
                this.$store.commit('setActions', {actions: this.actions, idDash: this.idDash, id: this.id });
                
            }
            if (screen.width <= 1600) {
                this.otstupBottom = 30;
            }
         },
         widthFrom: function() {
            this.checkSize();
         },
         heightFrom: function() {
            this.checkSize();
         },

     },
     methods: {
        getSvg: async function(svg) {
                this.$emit('setLoading',true);
                let response = await  this.$store.getters.getSvg(svg);
                if (response != '') {
                        this.$emit('setLoading',false);
                        this.svg = this.checkToken(response);
                        this.noMsg = 1;
                        this.checkSize();
                } else {
                    this.msgText = "Изображение получить не удалось";
                    this.noMsg = 2;
                    this.$emit('setLoading',false);
                }
        },
        checkSize: function() {
            if (this.svg != 'Нет данных для отображения') {
                 let timeOut = setTimeout( function tick() {
                        if (this.$refs.csvg.querySelector('svg') != null ) {
                             let otstupBottom = 45;
                            if (screen.width <= 1600) {
                                otstupBottom = 30;
                            }
                            clearTimeout(timeOut);
                            let svgElem = this.$refs.csvg.querySelector('svg');
                            svgElem.setAttribute("width", this.widthFrom-40);
                            svgElem.setAttribute("height", this.heightFrom-otstupBottom);
                        }  else {
                            timeOut = setTimeout(tick.bind(this), 1000); 
                        }
                  }.bind(this), 0);   
                
            } else {

            }
           
        },
        checkToken: function(svg) {
            let reg = '';
            Object.keys(this.dataFrom).forEach(item => {
                if (item != 'svg_filename') {
                    reg = new RegExp( `\\$${item}\\$`, "g");
                    svg = svg.replace(reg,this.dataFrom[item]);
                } 
            }) 
            return svg
        },
        setSvg: async function() {
            if (this.file != '') {
                let formData = new FormData();
                formData.append("file", this.file);
                
                let response = await  this.$store.getters.setSvg(formData); 
                try {

                    if(JSON.parse(response).status == 'ok') {
                        this.answerColor = this.color.controls;
                        this.answer = 'Изображение успешно загружено';
                        
                    }

                } catch (err) {
                    this.answerColor = this.color.controlsActive;
                    this.answer = 'Изображение загрузить не удалось';
                }
            } else {
                this.answerColor = this.color.controlsActive;
                this.answer = 'Выберите изображение';
            }
                this.answerShow = true;
                setTimeout( () => {
                   this.answerShow = false; 
                },2000)
            
        },
        setClick: function(token) {

               let tockens = this.$store.getters.getTockens(this.idDash);
               let tocken = {};
     
                Object.keys(tockens).forEach( i =>{
                    tocken = {
                        name: tockens[i].name,
                        action: tockens[i].action,
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == 'click') {
                        this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: token, store: this.$store });
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
        setOver: function(token) {

               let tockens = this.$store.getters.getTockens(this.idDash);
               let tocken = {};
     
                Object.keys(tockens).forEach( i =>{
                    tocken = {
                        name: tockens[i].name,
                        action: tockens[i].action,
                        capture : tockens[i].capture,
                    }
                    if (tockens[i].elem == this.id && tockens[i].action == 'mouseover') {
                        this.$store.commit('setTocken', {tocken: tocken, idDash: this.idDash, value: token, store: this.$store });
                    } 
                })
        },
        setEvents: function(id) {

            let events = this.$store.getters.getEvents({idDash: this.idDash, event: 'onclick', element: this.id, partelement: id});
        
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
        setLink: function(direction) {
            let context = this.$refs.link.getContext("2d");
            context.clearRect(0, 0, this.$refs.link.width, this.$refs.link.height);
            context.beginPath();
            switch (direction) {
                case 'normal': 
                    context.moveTo(0, 50);
                    context.lineTo(20, 0);
                    context.lineTo(30, 0);
                break
                case 'right': 
                    context.moveTo(0, 0);
                    context.lineTo(10, 0);
                    context.lineTo(30, 50);
                break
                case 'top-right': 
                    context.moveTo(0, 50);
                    context.lineTo(10, 50);
                    context.lineTo(30, 0);
                break
                case 'top-left': 
                    context.moveTo(0, 0);
                    context.lineTo(20, 50);
                    context.lineTo(30, 50);
                break

            }
            context.strokeStyle = this.color.text;
            context.stroke();
            context.lineWidth = 1;
        } 

    },
    mounted() {
       //this.$emit('hideDS',this.id);
        
       this.$refs.csvg.addEventListener('click', event => {
           let token = '';
           let id = event.target.getAttribute('id');
           if(id && id.indexOf('overlay') !=-1) {
               token = id.split('overlay_')[1];
               this.setClick(token);
           }
           
       })


       this.$refs.csvg.addEventListener('mouseover', event => {
           let id = event.target.getAttribute('id');
           let token = '';
           let tooltipSize = this.$refs.tooltip.getBoundingClientRect();
           let tooltipLeft = event.layerX + 40;
           let tooltipTop = event.layerY - 50;
           let linkBlockSize = this.$refs.link.parentElement.getBoundingClientRect();
           let linkLeft = event.layerX + 10;
           let linkTop = event.layerY - 50;
           let csvgSize = this.$refs.csvg.getBoundingClientRect();
           let direction = 'normal';
           
           
           if(id && id.indexOf('overlay') !=-1) {
               token = id.split('overlay_')[1];

               this.tooltipOptions == false ? this.tooltipBody = token : false;

                // выходит справа 
               if ((event.layerX + 40 + tooltipSize.width) > csvgSize.width) {
                   tooltipLeft = event.layerX - 40 - tooltipSize.width;
                   linkLeft = event.layerX - 10 - linkBlockSize.width;
                   direction = 'right';
               } 

                // выходит сверху

               if ((event.layerY - 50) < 0) {
                   tooltipTop = event.layerY + 50;
                   linkTop = event.layerY;
                   if (direction == 'right') {
                       direction = 'top-right';
                   } else {
                      direction = 'top-left'; 
                   }
                   
               } 

               // выходи снизу

               if ((event.layerY - 50 + tooltipSize.height) > csvgSize.height) {
                   tooltipTop = event.layerY - 50 - tooltipSize.height;
               }

               this.$refs.tooltip.style.top = `${tooltipTop}px`;
               this.$refs.tooltip.style.left = `${tooltipLeft}px`;
               this.$refs.link.parentElement.style.top =  `${linkTop}px`;
               this.$refs.link.parentElement.style.left = `${linkLeft}px`;

               this.linkCanvasShow = true;
               this.tooltipShow = true;
             

               this.setOver(token);
               this.setLink(direction);
           }
           
       })

       this.$refs.csvg.addEventListener('mouseout', event => {
           let id = event.target.getAttribute('id');
           if(id && id.indexOf('overlay') !=-1) {
               if (!this.tooltipPress) {
                   this.tooltipShow = false;
                   this.linkCanvasShow = false;
               }
           }
           
       })

       this.$refs.tooltip.addEventListener('click', event => {
            if(event.target.classList.contains('tooltip-button')) {
                this.setEvents(event.target.getAttribute('data-id'));
            }
        })

       this.$refs.svgBlock.addEventListener('keydown', event => {
               if(event.key == 'Control') {
                   this.tooltipPress = !this.tooltipPress;
                   if (!this.tooltipPress) {
                       this.tooltipShow = false;
                       this.linkCanvasShow = false;
                   } else {
                       this.tooltipShow = true;
                       this.linkCanvasShow = true;
                   }
               }
       })

    } 
}


</script>

<style lang="sass" > 
  
    @import '../../sass/dashCSvg.sass'

   
</style>