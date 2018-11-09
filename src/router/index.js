import Vue from 'vue'
import Router from 'vue-router'
import merchant from './modules/merchant' //品牌库
import brand from './modules/brand.js' //品牌库

Vue.use(Router)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: resolve => require(['@/page/all/Login'], resolve)
    }, {
        path: '/home',
        name: 'Home',
        component: resolve => require(['@/common/Home'], resolve),
        meta: {
            role: 'admin',
            requiresAuth: true,
            title: '主菜单'
        },
        children: [{
                path: '/index',
                name: 'Index',
                component: resolve => require(['@/page/all/Index'], resolve),
                meta: {
                    requiresAuth: true,
                    title: '主页'
                }
            },
            merchant,
            brand
        ]
    },
]

const router = new Router({
    mode: 'history',
    routes
})

// router.beforeEach((to, from, next) => {
//     let token = localStorage.getItem('userInfo')
//     if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
//         next({
//             path: '/'
//         })
//     } else {
//         next()
//     }
// })

export default router