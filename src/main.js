import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import interceptorsSetup from './helpers/interceptor'

Vue.component('downloadExcel', JsonExcel)
Vue.prototype.$axiosAPI = interceptorsSetup()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
