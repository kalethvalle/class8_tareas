import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import firebase from 'firebase/app';
import 'firebase/firestore'
import VueTextareaAutosize from 'vue-textarea-autosize';
Vue.use(VueTextareaAutosize);

Vue.use(VueAxios, axios)

const firebaseConfig = {
    apiKey: "AIzaSyCwUVF8V0TmHqX8VQrvpStW0p1VPDs8nDk",
    authDomain: "vue-calendario-ef756.firebaseapp.com",
    databaseURL: "https://vue-calendario-ef756.firebaseio.com",
    projectId: "vue-calendario-ef756",
    storageBucket: "vue-calendario-ef756.appspot.com",
    messagingSenderId: "805711527421",
    appId: "1:805711527421:web:a6fad73183148f0407ed94"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

Vue.config.productionTip = false

const ignoreWarnMessage = ' El modificador .native para v-on solo es válido en componentes pero se usó en <div>. ';
Vue.config.warnHandler = function(msg, vm, trace) {
    // `trace` es el seguimiento de la jerarquía de componentes 
    if (msg === ignoreWarnMessage) {
        msg = nulo;
        vm = nulo;
        trace = nulo;
    }
}

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')