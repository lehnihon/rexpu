import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import Login from './views/Login'
import Painel from './views/Painel'
import Membros from './views/Membros'
import Materias from './views/Materias'
import Relatorios from './views/Relatorios'
import SuporteTicket from './views/SuporteTicket'
import DuvidasFrequentes from './views/DuvidasFrequentes'
import Financeiro from './views/Financeiro'
import Configuracoes from './views/Configuracoes'


Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'painel',
      component: Painel
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/membros',
      name: 'membros',
      component: Membros
    },
    {
      path: '/materias',
      name: 'materias',
      component: Materias
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: Relatorios
    },
    {
      path: '/suporte-ticket',
      name: 'suporte-ticket',
      component: SuporteTicket
    },
    {
      path: '/duvidas-frequentes',
      name: 'duvidas-frequentes',
      component: DuvidasFrequentes
    },
    {
      path: '/financeiro',
      name: 'financeiro',
      component: Financeiro
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: Configuracoes
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('fetchAccessToken');
  store.dispatch('fetchAccessWP');
  
  if (to.fullPath !== '/login') {
    if (!store.state.accessToken) {
      next('/login');
    }
  }
  
  if (to.fullPath === '/login') {
    if (store.state.accessToken) {
      next('/');
    }
  }
  next();
});

export default router;