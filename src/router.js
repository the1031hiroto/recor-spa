import Vue from 'vue'
import Router from 'vue-router'
import OffenceAdd from '@/components/OffenceAdd.vue'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
 
Vue.use(Router)
 
let router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'offence-add',
      component: OffenceAdd,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ]
})
 
 
export default router