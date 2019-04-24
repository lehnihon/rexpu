import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: null,
    loggingIn: false,
    loginError: null,
    accessTokenWP:null,
    accessTokenExpire:null,
    userWP:null
  },
  getters: {
    accessToken: state =>{
      return state.accessToken
    },
    accessTokenExpire: state =>{
      return state.accessTokenExpire
    }
  },
  mutations: {
    loginStart: state => state.loggingIn = true,
    loginStop: (state, errorMessage) => {
      state.loggingIn = false;
      state.loginError = errorMessage;
    },
    updateAccessToken: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    updateAccessTokenExpire: (state, accessTokenExpire) => {
      state.accessTokenExpire = accessTokenExpire;
    },
    logout: (state) => {
      state.accessToken = null;
      state.accessTokenWP = null;
    },
    updateAccessTokenWP: (state, accessTokenWP) => {
      state.accessTokenWP = accessTokenWP;
    },
    updateUserWP: (state, userWP) => {
      state.userWP = userWP;
    }
  },
  actions: {
    doLogin({ commit, dispatch }, loginData) {
      commit('loginStart');

      axios.post(process.env.VUE_APP_API_URL + "/auth/login", {
        ...loginData
      })
        .then(response => {
          const expire = Date.now()+(60*60*1000);
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('accessTokenExpire', expire );
          commit('loginStop', null);
          commit('updateAccessToken', response.data.token);
          commit('updateAccessTokenExpire', expire );
          dispatch('doLoginWP');
        })
        .catch(error => {
          commit('loginStop', error.response.data.error);
          commit('updateAccessToken', null);
        })
    },
    doLoginWP({ commit }) {
      axios
        .get(process.env.VUE_APP_API_URL + "/config", {
          headers: {
            'Authorization': "Bearer " + this.state.accessToken
          }
        })
        .then(response => {
          localStorage.setItem('accessTokenWP', btoa(response.data.wp_login+":"+response.data.wp_password));
          localStorage.setItem('userWP', response.data.wp_user);
          commit('updateAccessTokenWP', btoa(response.data.wp_login+":"+response.data.wp_password));
          commit('updateUserWP', response.data.wp_user);
        })
        router.push('/configuracoes');
    },
    fetchAccessToken({ commit }) {
      commit('updateAccessToken', localStorage.getItem('accessToken'));
      commit('updateAccessTokenExpire', localStorage.getItem('accessTokenExpire'));
    },
    fetchAccessWP({ commit }) {
      commit('updateAccessTokenWP', localStorage.getItem('accessTokenWP'));
      commit('updateUserWP', localStorage.getItem('userWP'));
    },
    logout({ commit }) {
      localStorage.removeItem('accessToken');
      commit('logout');
      router.push('/login');
    }
  }
})