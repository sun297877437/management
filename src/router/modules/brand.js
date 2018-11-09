// 商品库
const brand = {
    path: '/brand',
    name: 'Brand',
    redirect: '/brandList',
    children: [{
        path: '/brandList',
        name: 'BrandList',
        component: resolve => require(['@/page/brand/BrandList'], resolve)
    }]
}

export default brand;