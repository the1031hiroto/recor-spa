import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.config.productionTip = false

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC4YNqGejhAF4FAmpMEYNi-FW7CtWQ6cK0",
  authDomain: "recor-spa.firebaseapp.com",
  databaseURL: "https://recor-spa.firebaseio.com",
  projectId: "recor-spa",
  storageBucket: "recor-spa.appspot.com",
  messagingSenderId: "894451295048"
};
firebase.initializeApp(config);

new Vue({
  router,
  store,
  // firebase,
  render: h => h(App)
}).$mount('#app')

import jQuery from 'jquery'
global.jquery = jQuery
global.$ = jQuery
window.$ = window.jQuery = require('jquery')
