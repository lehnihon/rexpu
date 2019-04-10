import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import Login from './views/Login'
import Configuracoes from './views/Configuracoes'
import Team from './views/Team'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
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
      path: '*',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('fetchAccessToken');

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