import firebase from 'firebase/app';
import 'firebase/auth';
import Vue from 'vue'
import Router from 'vue-router'
import OffenceAdd from '@/components/OffenceAdd.vue'
import DeffenceAdd from '@/components/DeffenceAdd'
import OffenceShow from '@/components/OffenceShow'
import DeffenceShow from '@/components/DeffenceShow'
import PitcherShow from '@/components/PitcherShow'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import Home from '@/components/Home'
import Members from '@/components/Members'

Vue.use(Router)

let router =  new Router({
    mode: 'history',
    routes: [

        {
            path: '/team/:team',
            name: 'Home',
            component: Home
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/signin',
            name: 'Signin',
            component: Signin
        },
        {
            path: '/offence-add',
            name: 'OffenceAdd',
            component: OffenceAdd,
            meta: { requiresAuth: true }
        },{
            path: '/deffence-add',
            name: 'DeffenceAdd',
            component: DeffenceAdd,
            meta: { requiresAuth: true }
        },{
            path: '/team/:team/offence-show/',
            name: 'OffenceShow',
            component: OffenceShow
        },{
            path: '/team/:team/deffence-show/',
            name: 'DeffenceShow',
            component: DeffenceShow,
        },{
          path: '/team/:team/pitcher-show/',
          name: 'PitcherShow',
          component: PitcherShow,
      },{
        path: '/team/:team/members/:name',
        name: 'Members',
        component: Members,
    }
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          next()
        } else {
          next({
            path: '/signin',
            query: { redirect: to.fullPath }
          })
        }
      })
    } else {
      next()
    }
})

export default router