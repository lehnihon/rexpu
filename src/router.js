import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Configuracoes from './views/Configuracoes'
import Team from './views/Team'
import Materias from './views/Materias'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/login',
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
    },
    {
      path: '/materias',
      name: 'materias',
      component: Materias
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
      next('/configuracoes');
    }
  }
  next();
});

export default router;