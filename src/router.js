import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import Login from './views/Login'
import Cadastro from './views/Cadastro'
import CadastroIndicacoes from './views/CadastroIndicacoes'
import Painel from './views/Painel'
import CPM from './views/CPM'
import Membros from './views/Membros'
import Materias from './views/Materias'
import Relatorios from './views/Relatorios'
import SuporteTicket from './views/SuporteTicket'
import DuvidasFrequentes from './views/DuvidasFrequentes'
import Bancos from './views/Banco'
import Parceiros from './views/Parceiros'
import Ganhos from './views/Ganhos'
import Financeiro from './views/Financeiro'
import Configuracoes from './views/Configuracoes'
import Indicacoes from './views/Indicacoes'


Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'painel',
      component: Painel,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: Cadastro
    },
    {
      path: '/cadastro-indicacoes/:hash',
      name: 'cadastro-indicacoes',
      component: CadastroIndicacoes
    },
    {
      path: '/cpm',
      name: 'cpm',
      component: CPM,
      beforeEnter: requireAuth
    },
    {
      path: '/membros',
      name: 'membros',
      component: Membros,
      beforeEnter: requireAuth
    },
    {
      path: '/materias',
      name: 'materias',
      component: Materias,
      beforeEnter: requireAuth
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: Relatorios,
      beforeEnter: requireAuth
    },
    {
      path: '/suporte-ticket',
      name: 'suporte-ticket',
      component: SuporteTicket,
      beforeEnter: requireAuth
    },
    {
      path: '/duvidas-frequentes',
      name: 'duvidas-frequentes',
      component: DuvidasFrequentes,
      beforeEnter: requireAuth
    },
    {
      path: '/financeiro',
      name: 'financeiro',
      component: Financeiro,
      beforeEnter: requireAuth
    },
    {
      path: '/bancos',
      name: 'bancos',
      component: Bancos,
      beforeEnter: requireAuth
    },
    {
      path: '/parceiros',
      name: 'parceiros',
      component: Parceiros,
      beforeEnter: requireAuth
    },
    {
      path: '/ganhos',
      name: 'ganhos',
      component: Ganhos,
      beforeEnter: requireAuth
    },
    {
      path: '/indicacoes',
      name: 'indicacoes',
      component: Indicacoes,
      beforeEnter: requireAuth
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: Configuracoes,
      beforeEnter: requireAuth
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})

function requireAuth(to, from, next){
  store.dispatch('fetchAccessToken');
  store.dispatch('fetchAccessWP');
  
  if (to.fullPath === '/login') {
    if (store.state.accessToken) {
      next('/');
    }
  }else{
    if (!store.state.accessToken) {
      next('/login');
    }
  }
  next();
};

export default router;