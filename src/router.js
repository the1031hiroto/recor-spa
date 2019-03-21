import firebase from 'firebase/app';
import 'firebase/auth';
import Vue from 'vue'
import Router from 'vue-router'
import OffenceAdd from '@/components/OffenceAdd.vue'
import DeffenceAdd from '@/components/DeffenceAdd'
import OffenceShow from '@/components/OffenceShow'
import DeffenceShow from '@/components/DeffenceShow'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import Home from '@/components/Home'

Vue.use(Router)

let router =  new Router({
    mode: 'history',
    routes: [

        {
            path: '/',
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
            name: 'offence-add',
            component: OffenceAdd,
        },{
            path: '/deffence-add',
            name: 'DeffenceAdd',
            component: DeffenceAdd,
        },{
            path: '/offence-show',
            name: 'offence-show',
            component: OffenceShow
        },{
            path: '/deffence-show/:id',
            name: 'DeffenceShow',
            component: DeffenceShow,
        }
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth) {
      // このルートはログインされているかどうか認証が必要です。
      // もしされていないならば、ログインページにリダイレクトします。
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
      next() // next() を常に呼び出すようにしてください!
    }
})

export default router