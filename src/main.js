import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

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
  render: h => h(App)
}).$mount('#app')