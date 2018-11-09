import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [{
        path: '/',
        name: 'Login',
        component: resolve => require(['@/page/Login'], resolve),
        meta: { role: 'A' }
    },
    {
        path: '/Index',
        name: 'Index',
        component: resolve => require(['@/page/Index'], resolve),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/Home',
        name: 'Home',
        component: resolve => require(['@/page/Home'], resolve),
        redirect: '/Order',
        meta: { requiresAuth: true, title: '主菜单' },
        children: [{
                path: '/Account',
                name: 'Account',
                component: resolve => require(['@/page/Account'], resolve),
                meta: {
                    requiresAuth: true,
                    title: '账户余额'
                }
            },
            {
                path: '/Classify',
                name: 'Classify',
                component: resolve => require(['@/page/Classify'], resolve),
                meta: {
                    requiresAuth: true,
                    title: '商品管理'
                }
            },
            {
                path: '/Finance',
                name: 'Finance',
                component: () =>
                    import ('@/page/Finance'),
                meta: {
                    requiresAuth: true,
                    title: '财务分析'
                }
            },
            {
                path: '/Member',
                name: 'Member',
                component: resolve => require(['@/page/Member'], resolve),
                meta: {
                    requiresAuth: true,
                    title: '会员信息'
                }
            },
            {
                path: '/Order',
                name: 'Order',
                component: resolve => require(['@/page/Order'], resolve),
                meta: {
                    requiresAuth: true,
                    title: '定单信息'
                }
            }
        ]
    }
]

const router = new Router({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('userInfo')
    if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
        next({
            path: '/'
        })
    } else {
        next()
    }
})

export default router