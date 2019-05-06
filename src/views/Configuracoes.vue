<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Configurações</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
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
                    v-model="m_wp_user"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Login"
                    v-model="m_wp_login"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Senha"
                    v-model="m_wp_password"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="gravarWP" depressed color="primary">Gravar</v-btn>
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
                    v-model="m_bank"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Agência"
                    v-model="m_agency"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Conta"
                    v-model="m_account"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="CPF"
                    v-model="m_cpf"
                    loading:="loading"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="gravarWP" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      bottom
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
  import router from '../router';
  import mixin from '../mixin'
  export default {
    components: {
    },
    mixins: [mixin],
    data: () => ({
      response: false,
      headers: null,
      m_wp_user:'',
      m_wp_login:'',
      m_wp_password:'',
      m_bank:'',
      m_agency:'',
      m_account:'',
      m_cpf:'',
      loading: true,
      user_id: '',
      jwt_decode: '',
      snackbar: false,
      snackbarText: '',
    }),
    methods: {
      getConfiguracoes(){
        this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/config")
          .then(response => {
            this.m_wp_user = response.data.wp_user
            this.m_wp_login = response.data.wp_login
            this.m_wp_password = response.data.wp_password
            this.m_bank = response.data.bank
            this.m_agency = response.data.agency
            this.m_account = response.data.account
            this.m_cpf = response.data.cpf
            this.loading = false
          }).catch(function (error) {
            
          })
      },
      gravarWP(){
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/config",{
            user_id: this.jwt_decode.sub,
            wp_user: this.m_wp_user,
            wp_login:this.m_wp_login,
            wp_password:this.m_wp_password,
            bank:this.m_bank,
            agency:this.m_agency,
            account:this.m_account,
            cpf:this.m_cpf
          })
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
          })
      }
    },
    
    mounted () {
      this.getRole()
      this.getConfiguracoes()
    }
  }
</script>
