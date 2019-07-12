<template>
  <div class="cadastro">
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
              <p class="text-xs-center">Registre sua conta abaixo!</p>
              <v-form ref="member" v-model="valid" lazy-validation >
                <v-text-field
                  v-model="form.name_inc"
                  prepend-icon="person"
                  name="nome"
                  label="Nome"
                  type="text"
                  :rules="[v => !!v || 'Nome é obrigatório']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.surname"
                  prepend-icon="person"
                  name="sobrenome"
                  label="Sobrenome"
                  type="text"
                  :rules="[v => !!v || 'Sobrenome é obrigatório']"
                ></v-text-field>
                <v-text-field
                  v-model="form.email"
                  prepend-icon="email"
                  name="email"
                  label="Email"
                  type="text"
                  :rules="[v => /.+@.+/.test(v) || 'Email inválido']"
                ></v-text-field>
                <v-text-field
                  v-model="form.phone"
                  prepend-icon="phone"
                  name="whatsapp"
                  label="WhatsApp"
                  mask="(##) #####-####"
                  type="text"
                ></v-text-field>
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
                <h4>ATENÇÃO:</h4>
                <p>
                  Se estiver se cadastrando para ser divulgador, preencha abaixo os links das mídias sociais que você usará para divulgar nossos links ex:<br>
                  facebook.com/minhapagina<br>
                  instagram.com/meuinstagram<br>
                  Caso queira <strong>redigir</strong> matérias, insira o link de algum artigo seu publicado na internet.
                </p>
                <v-textarea
                  v-model="form.fonts"
                  prepend-icon="desktop_windows"
                  name="fontes"
                  label="Fontes de tráfego"
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :loading="btnLoading" :disabled="!valid" color="primary" @click="saveMember">Criar Conta</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<style scoped>
h1{
  color:#FFF;
  text-align: center;
}
.cadastro{
  background-color:#421065;
  min-height: 100vh;
}
</style>

<script>
import axios from 'axios'

export default {
  components: {},
  data: () => ({
    snackbar: false,
    snackbarText: '',
    valid: false,
    username:'',
    btnLoading:false,
    form:{
      name: null,
      surname: null,
      name_inc:null,
      email:null,
      phone:null,
      password:null,
      passwordb:null,
      fonts:null,
      wp_user:'',
      wp_login:'',
      wp_password:''
    }
  }),
  methods: {
    saveMember(){
      if (this.$refs.member.validate()) {
        this.valid = false
        this.btnLoading = true
        this.form.name = this.form.name_inc+" "+this.form.surname
        this.username = Math.random().toString(36).substr(2, 20)
        axios
        .post(process.env.VUE_APP_WP_URL + "wp-json/wp/v2/users",{
            username:this.username,
            name:this.form.name,
            email:this.form.email,
            password:this.form.password,
            roles:[ "contributor" ]
          },
          {
          headers: {
            'Authorization': "Basic " + btoa(process.env.VUE_APP_WP_ADMIN)
          }
        }).then(response => {
          this.form.wp_user = response.data.id
          this.form.wp_login = this.username
          this.form.wp_password = this.form.password
          axios
            .post(process.env.VUE_APP_API_URL+"/user",this.form)
            .then(response => {
              this.valid = true
              this.btnLoading = false
              this.snackbarText = "Conta criada com sucesso!"
              this.snackbar = true
              this.$refs.member.reset()
            }).catch(error => {
              this.valid = true
              this.btnLoading = false
              this.snackbarText = "Erro ao gravar!"
              this.snackbar = true   
            })
        }).catch(error => {
          console.log(error)
          this.btnLoading = false
          this.valid = true
          this.snackbarText = "Email já existe!"
          this.snackbar = true   
        })
      }
    }
  }
};
</script>
