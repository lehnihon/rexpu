<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Configurações</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex v-if="role.list.includes(1)" md12>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Configurações Gerais</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex md6>
                  <v-text-field
                    label="% Indicação"
                    v-model="config.perc_member"
                    :loading="config.loading"
                    mask="###"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="saveConfigurations" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Configurações API</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress ID"
                    v-model="user.wp_user"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Login"
                    v-model="user.wp_login"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Senha"
                    v-model="user.wp_password"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="saveUser" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Configurações Financeiro</h3>
              </div>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Banco"
                    v-model="user.bank"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Agência"
                    v-model="user.agency"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Conta"
                    v-model="user.account"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="CPF"
                    v-model="user.cpf"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="saveUser" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      bottom
      :timeout=1000
    >
      {{ snackbarText }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  import mixin from '../mixin'
  export default {
    components: {
    },
    mixins: [mixin],
    data: () => ({
      user:{
        wp_user:'',
        wp_login:'',
        wp_password:'',
        bank:'',
        agency:'',
        account:'',
        cpf:'',
        loading: true,
        id: '',
      },
      config:{
        perc_member:'',
        loading: true,
      },
      snackbar: false,
      snackbarText: '',
    }),
    methods: {
      getUser(){
        this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/"+this.jwt_decode.sub)
          .then(response => {
            this.user = response.data
            this.user.loading = false
          }).catch(function (error) {
            
          })
      },
      getConfigurations(){
        this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/general-config")
          .then(response => {
            this.config = response.data
            this.config.loading = false
          }).catch(function (error) {
            
          })
      },
      saveUser(){
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/user",{
            id: this.jwt_decode.sub,
            wp_user: this.user.wp_user,
            wp_login:this.user.wp_login,
            wp_password:this.user.wp_password,
            bank:this.user.bank,
            agency:this.user.agency,
            account:this.user.account,
            cpf:this.user.cpf
          })
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
          })
      },
      saveConfigurations(){
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/general-config",{
            perc_member: this.config.perc_member
          })
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
          })
      }
    },
    
    mounted () {
      this.getRole()
      this.getUser()
      this.getConfigurations()
    }
  }
</script>
