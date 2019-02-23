import Vue from 'vue'
import Router from 'vue-router'
import OffenceAdd from '@/components/OffenceAdd.vue'
import DeffenceAdd from '@/components/DeffenceAdd'
import OffenceShow from '@/components/OffenceShow'

Vue.use(Router)

let router =  new Router({
    mode: 'history',
    routes: [
        {
        path: '/offence-add',
        name: 'offence-add',
        component: OffenceAdd,
        },
        {
        path: '/deffence-add',
        name: 'DeffenceAdd',
        component: DeffenceAdd,
        },
        {
        path: '/offence-show',
        name: 'offence-show',
        component: OffenceShow
        }
    ]
})

export default router