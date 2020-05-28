<template >
    <v-app class="application-aut" >
       <v-content>
           <v-container  class="main-container container-app" :style="{backgroundColor:color.back}">  
               <div class="aut-container">
                <v-card class="card-aut"  ref="authForm" :style="{backgroundColor:color.backElement}">
                    <v-card-title class="title-aut" :style="{color:color.text}">Авторизация</v-card-title>
                    <v-card-text class="text-aut" :style="{color:color.text}">
                        <v-text-field label="Логин" :color="color.controls" class="field-aut" v-model="user.username" outlined  hide-details clearable></v-text-field>
                        <v-text-field label="Пароль" :color="color.controls"  class="field-aut"  v-model="user.password" type="password" outlined  hide-details clearable></v-text-field>
                        <div class="error-msg" :style="{color:color.controlsActive}" :class="{errormsgshow:msg}">{{msgText}}</div>
                    </v-card-text>
                    <v-card-actions>
                            <v-btn class="btn-aut" :color="color.controlsSystem" @click="sendAut">  Подтвердить </v-btn>
                    </v-card-actions>
                    <div class="example" v-html="msgg"></div>
                </v-card>
               </div>
           </v-container> 
        </v-content>
        <footer-bottom></footer-bottom>
    </v-app>
</template>


<script>


export default {
 
    data () {
        return {
            user: {},
            msg: false,
            msgText: '',
            msgg: '',
            color: { 
                back: '#060606',
                backElement: '#191919',
                text: '#DADADA',
                controls: '#6e96c5',
                controlsSystem: '#004799',
                controlsActive: '#41C4FF',
                controlsInsideDash: '#DADADA',
                panel: '#0D0D0D',
                border: '#454545',
            },
        } 
    },
     computed: { 
     },  
     methods: {
        sendAut: async function() { 
            // if (this.user.login == 'admin'){
            //     this.unicid = {'role':'admin','login':'admin','response':'success'};
            // } else if (this.user.login == 'user') {
            //     this.unicid = {'role':'user','login':'user','response':'success'};
            // } 

            // this.$router.push(`/main`); 

        if (this.user.username && this.user.username.length != 0 && this.user.password && this.user.password.length != 0) {
            // let formData = new FormData();  // формируем объект для передачи RESTу
            // formData.append('username', this.user.username);
            // formData.append('password', this.user.password);

            let response = await fetch(`/api/auth/login`, {  // сперва нужно подать post запрос
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify(this.user),
                // mode: 'no-cors'
                
            })
            .catch (error => {
                console.log(error);
                return {status: 300, result: 'Post не создался, возможно из-за неточностей в запросе'}
            }) 

          

            // if(await responseDB == 'success') {
            //     this.msgg = await this.$store.auth.getters.getLog();
            // }

            
            
            if (response.status == 200) {  // если получилось
                    await response.json().then( res => {  // переводим полученные данные из json в нормальный объект
                            this.$store.auth.getters.putLog(`status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}&nbsp;&nbsp;login: ${this.user.username}`);
                            this.$store.commit('clearState');
                            this.$router.push(`/main`);
                    }) 
            } else {
                this.$store.auth.getters.putLog(`status: ${response.status}&nbsp;&nbsp;url: ${response.url}&nbsp;&nbsp;statusText: ${response.statusText}`);
                this.msgText = "Логин или пароль введены неверно";
                this.msg = true;
                setTimeout( () => {
                    this.msg = false;
                },2000);
            }
        } else {
            this.msgText = "Логин или пароль не могут быть пустыми";
            this.msg = true;

            setTimeout( () => {
                this.msg = false;
            },2000);
        }

        // this.$router.push(`/main`);


        //  let xhr = new XMLHttpRequest();
        //     xhr.open("POST", "/api/auth/login");
        //     xhr.withCredentials = true;
        //     xhr.send(formData);    
            

        //     xhr.onload = () => {
        //         console.log(xhr.getAllResponseHeaders());
        //         console.log(document.cookie);
        //     }
        
            // this.unicid.response = 'success';
            
            // if (this.unicid.response == 'success') {
            //    // document.cookie = `eva-unicid=${JSON.stringify(this.unicid)}; max-age=3600`;
            //     document.cookie = `eva-token=${this.key}; max-age=3600`;
            //     this.$router.push(`/main`);
            // } else {
            //     this.msg = true;
            //     setTimeout( () => {
            //         this.msg = false;
            //     },2000);
            // }
        },
         getCookie: function() {
                if(this.$jwt.hasToken()) {
                   // token = this.$jwt.getToken();
                    // this.unicid = (this.$jwt.decode());
                     this.$router.push(`/main`);
                } 
         },
        
    },
    mounted() {
        this.getCookie();
        this.$refs.authForm.$el.addEventListener ("keypress", event =>{
            if (event.keyCode == 13) {
                this.sendAut();
            }
        });
    } 
}


</script>

<style lang="sass" > 
  
   @import '../../sass/autorization.sass'

   
</style>