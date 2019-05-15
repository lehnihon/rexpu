import axios from 'axios';
import store from '../store'

export default function setup() {
    const axiosAPI = axios.create();
    axiosAPI.interceptors.request.use(function(config) {
        const token = store.getters.accessToken;

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, function(error) {
        return Promise.reject(error);
    });

    axiosAPI.interceptors.response.use(function (response) {
        const token = store.getters.accessToken;
        const tokenExpire = store.getters.accessTokenExpire;
        const tokenExpireTime = Date.now();

        if(tokenExpire < tokenExpireTime){
            axios.post(process.env.VUE_APP_API_URL + "/auth/refresh",{},{
                headers: {'Authorization': "Bearer " + token}
            })
            .then(response => {
                localStorage.setItem('accessToken', response.data.token);
                localStorage.setItem('accessTokenExpire', Date.now()+(60*60*1000));
                store.dispatch('fetchAccessToken');
            })
            .catch(error => {
                return Promise.reject(error);
            })
        }
        return response;
      }, function (error) {
        if(error.response != undefined){
            if(error.response.status == '401'){
                store.dispatch('logout');
            }else{
                return Promise.reject(error);
            }
        }
      });

    return axiosAPI;
}

