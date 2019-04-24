import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import interceptorsSetup from './helpers/interceptor'

Vue.prototype.$axiosAPI = interceptorsSetup()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
