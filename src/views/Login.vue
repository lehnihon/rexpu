<template>
  <div class="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-alert
          v-model="loginError"
          type="info"
        >
          {{loginError}}
        </v-alert>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="valid" >
                <v-text-field
                  v-model="email"
                  prepend-icon="person"
                  name="login"
                  label="Login"
                  type="text"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!valid" color="primary" @click="login()">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex';

export default {
  components: {},
  data: () => ({
    valid: false,
    email: null,
    emailRules:[
      (v) => !!v || 'Email é obrigatório',
    ],
    password: null,
    passwordRules:[
      (v) => !!v || 'Password é obrigatório',
    ],
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
