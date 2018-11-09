// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Store from './store'
import 'js/rem.js'
import 'css/reset.css'
import axios from 'js/http.js'
import 'js/util.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import FastClick from 'fastclick' //解决300毫秒延迟

FastClick.attach(document.body); //解决300毫秒延迟
Vue.prototype.axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    Store,
    components: { App },
    template: '<App/>'
})