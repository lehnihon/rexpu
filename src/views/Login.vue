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
              <v-form>
                <v-text-field
                  v-model="email"
                  prepend-icon="person"
                  name="login"
                  label="Login"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login()">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      bottom
      timeout="6000"
    >
    {{ snackbarText }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex';

export default {
  components: {},
  data: () => ({
      email: null,
      password: null,
      snackbar: false,
      snackbarText: ''
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
