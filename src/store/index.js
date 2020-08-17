import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
  },
  mutations: {
    LOADING(state, status) {
      state.isLoading = status
    },
    // STORES(state, payload) {
    //   state.stores = payload
    // }
  },
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status)
    },
    // getStores(context) {
    //   const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    //   context.commit('updateLoading', true)
    //   this.$http.get(api).then((response) => {
    //     context.commith('updateLoading', false)
    //     this.data = response.data.features;
    //     this.updateMap();
    //   });
    // }
  },
  modules: {}
})