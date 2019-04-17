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
                    v-model="wp_user"
                    :loading="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Login"
                    v-model="wp_login"
                    :loading="loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Senha"
                    v-model="wp_password"
                    :loading="loading"
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
                <h3 class="headline mb-0">Configurações Conta</h3>
              </div>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Banco"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Agência"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Conta"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="CPF"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn depressed color="primary">Gravar</v-btn>
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
  import { mapState } from 'vuex'
  import mixin from '../mixin'
  export default {
    components: {
    },
    mixins: [mixin],
    data: () => ({
      response: false,
      headers: null,
      wp_user:'',
      wp_login:'',
      wp_password:'',
      loading: true,
      user_id: '',
      jwt_decode: '',
      snackbar: false,
      snackbarText: '',
    }),
    computed: {
      ...mapState([
        'accessToken',
      ])
    },
    methods: {
      auth(){
        this.jwt_decode = this.decodeJWT(this.accessToken)
        axios
          .get(process.env.VUE_APP_API_URL+"/config",{
            headers: {
              'Authorization': "Bearer " + this.accessToken
            }
          })
          .then(response => {
            this.wp_user = response.data.wp_user
            this.wp_login = response.data.wp_login
            this.wp_password = response.data.wp_password
            setTimeout(() => {
              this.loading = false
              this.snackbarText = "Dados carregados!"
              this.snackbar = true
            }, 1000);
          })
      },
      gravarWP(){
        axios
          .put(process.env.VUE_APP_API_URL+"/config",{
            id_user: this.jwt_decode.sub,
            wp_user: this.wp_user,
            wp_login:this.wp_login,
            wp_password:this.wp_password
          },
          {
            headers: {
              'Authorization': "Bearer " + this.accessToken
            }
          }
          )
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
          })
      }
    },
    
    mounted () {
      this.auth()
    }
  }
</script>
