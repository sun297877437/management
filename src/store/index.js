import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
      city: '公共数据'
  },
  action: {
      changeCity (ctx, city) { 
        ctx.commit('next', city)    
        //组件通过this.$store.dispatch('changeCity', city)调用action
        //action通过commit调用mutations
        //或者组件this.$store.commit('changeCity', city)调用mutations，不用action，因为这次操作简单，没异步操作
      },
      a({commit},city) {
        commit('next',city);
        commit('next',city);
      }
  },
  mutations: {
      next (state, city) {
          state.city = city
      }
  }
})