<template>
  <div class="login">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs2>
          <v-img src="assets/img/white.png" width="100"></v-img>
        </v-flex>
        <v-flex xsauto>
        </v-flex>
        <v-flex xs1>
          <v-btn small flat href="/cadastro" class="white--text"><v-icon class="mr-2">person_pin</v-icon> Cadastro</v-btn>
        </v-flex>
        <v-flex xs1>
          <v-btn small flat href="/login" class="white--text"><v-icon class="mr-2">vpn_key</v-icon> Entrar</v-btn>
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
              <v-spacer></v-spacer>
              <v-btn :disabled="!valid" color="primary" @click="login">Entrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
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
    password: null
  }),
  computed:{
    ...mapState([
      'loggingIn',
      'loginError'
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
  }
};
</script>
