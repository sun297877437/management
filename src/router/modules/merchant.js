// 商户
const merchant = {
    path: '/merchant',
    name: 'Merchant',
    redirect: '/brandList',
    children: [{
        path: '/merchantList',
        name: 'MerchantList',
        component: resolve => require(['@/page/merchant/MerchantList'], resolve)
    }]
}

export default merchant;