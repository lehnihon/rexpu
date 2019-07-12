<template>
  <div class="login">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-img src="assets/img/white.png" width="100"></v-img>
        </v-flex>
        <v-flex xsauto>
        </v-flex>
        <v-flex xs3>
          <v-btn small flat to="/cadastro" class="white--text"><v-icon class="mr-2">person_pin</v-icon> Cadastro</v-btn>
          <v-btn small flat to="/login" class="white--text"><v-icon class="mr-2">vpn_key</v-icon> Entrar</v-btn>
        </v-flex>
      </v-layout>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-alert
          v-model="loginError"
          type="info"
          >
          {{loginError}}
        </v-alert>
          <h1 class="my-5">Bem vindo a WinUP!</h1>
          <v-card class="elevation-12 py-3">
            
            <v-card-text>
              <v-form v-model="valid" >
                <v-text-field
                  v-model="email"
                  prepend-icon="person"
                  name="login"
                  label="Login"
                  type="text"
                  :rules="[v => !!v || 'Email é obrigatório']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  :rules="[v => !!v || 'Password é obrigatório']"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs12 class="text-xs-center">
                  <v-btn :loading="loggingIn" :disabled="!valid" color="primary" @click="login">Entrar</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs4 class="text-xs-center">
                  <v-btn @click="dialog = true" flat small>Esqueci minha senha</v-btn>
                </v-flex>
                <v-flex ml-auto xs4 class="text-xs-center">
                  <v-btn to="cadastro" flat small>Criar conta</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" width="500">
      <v-card class="py-3 px-3">
        <v-text-field
          v-model="femail"
          prepend-icon="email"
          name="Email"
          label="Email"
          type="text"
          required
        ></v-text-field>
        <v-btn :loading="btnLoadingb" :disabled="btnLoadingb"  color="primary" @click="forgot">Enviar</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
h1{
  color:#FFF;
  text-align: center;
}
.login{
  background-color:#421065;
  min-height: 100vh;
}
</style>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex';

export default {
  components: {},
  data: () => ({
    valid: false,
    email: null,
    femail:null,
    password: null,
    btnLoading: false,
    dialog:false,
    btnLoadingb: false,
    snackbar: false,
    snackbarText: '',
  }),
  computed:{
    ...mapState([
      'loggingIn',
      'loginError',
    ])
  },
  methods: {
    ...mapActions([
      'doLogin'
    ]),
    login() {
      this.doLogin({
        email: this.email,
        password: this.password
      });
    },
    forgot(){
      this.btnLoadingb = true
      axios
        .post(process.env.VUE_APP_API_URL+"/user/forgot",{email:this.femail,link:window.location.origin+"/#/esqueci-senha/"})
        .then(response => {
          this.btnLoadingb = false
          this.snackbarText = "Email enviado!"
          this.snackbar = true 
          this.femail = ''
          this.dialog = false
        }).catch(error => {
          this.btnLoadingb = false
          this.snackbarText = "Erro ao enviar!"
          this.snackbar = true   
        })
    }
  }
};
</script>
