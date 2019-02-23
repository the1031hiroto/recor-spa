import Vue from 'vue'
import Router from 'vue-router'
import OffenceAdd from '@/components/OffenceAdd.vue'
import Signup from '@/components/Signup'
import OffenceShow from '@/components/OffenceShow'

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
        path: '/offence-show',
        name: 'offence-show',
        component: OffenceShow
        }
    ]
})

export default router