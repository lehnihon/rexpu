import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Configuracoes from './views/Configuracoes'
import Team from './views/Team'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: Configuracoes
    },
    {
      path: '/team',
      name: 'team',
      component: Team
    }
  ]
})
