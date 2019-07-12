<template>
  <div class="esqueci-senha">
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
          <h1 class="my-5">Bem vindo a WinUP!</h1>
          <v-card class="elevation-12 py-3">
            
            <v-card-text>
              <p class="text-xs-center">Atualize sua senha!</p>
              <v-form ref="member" v-model="valid" lazy-validation >
                <v-text-field
                  v-model="form.passwordb"
                  prepend-icon="lock"
                  name="senhaa"
                  label="Senha"
                  type="password"
                  :rules="[v => !!v || 'Senha é obrigatório']"
                ></v-text-field>
                <v-text-field
                  v-model="form.password"
                  prepend-icon="lock"
                  name="senhab"
                  label="Confirmar senha"
                  type="password"
                  :rules="[v => v == form.passwordb || 'As senha precisam ser iguais',v => !!v || 'Confirmar senha é obrigatório']"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :loading="btnLoading" :disabled="!valid" color="primary" @click="updatePass">Cadastrar Nova Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=3000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
  </div>
</template>

<style scoped>
h1{
  color:#FFF;
  text-align: center;
}
.esqueci-senha{
  background-color:#421065;
  min-height: 100vh;
}
</style>

<script>
import axios from 'axios'
import router from '../router'

export default {
  components: {},
  data: () => ({
    snackbar: false,
    snackbarText: '',
    valid: false,
    username:'',
    btnLoading:false,
    form:{
      password:null,
      passwordb:null,
      pass_hash:null
    }
  }),
  methods: {
    updatePass(){
      if (this.$refs.member.validate()) {
        this.valid = false
        this.btnLoading = true
        axios
            .put(process.env.VUE_APP_API_URL+"/user/forgot",{pass_hash:this.form.pass_hash, password:this.form.password})
            .then(response => {
              this.valid = true
              this.btnLoading = false
              this.snackbarText = "Senha Alterada com sucesso!"
              this.snackbar = true
              this.$refs.member.reset()
              setTimeout(function () {
                router.push('/login');
              }, 2000);
              
            }).catch(error => {
              this.valid = true
              this.btnLoading = false
              this.snackbarText = "Erro ao gravar, link inválido!"
              this.snackbar = true
              this.$refs.member.reset()
            })
      }
    }
  },
  mounted(){
    this.form.pass_hash = this.$route.params.hash
  }
};
</script>
