<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Configurações</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex v-if="role.list.includes(1)" md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Configurações Gerais</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex md12>
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
              <div>
                <h3 class="headline mb-0">Configurações Financeiro</h3>
              </div>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                      v-model="user.bank_id"
                      :items="banks"
                      :loading="user.loading" 
                      item-text="name" 
                      item-value="id"
                      label="Banco"
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Favorecido"
                    v-model="user.favored"
                    :loading="user.loading"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                      v-model="user.type"
                      :items="types"
                      :loading="user.loading" 
                      label="Tipo"
                    ></v-select>
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
                     v-mask="['###.###.###-##', '##.###.###/####-##']"
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
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  import mixin from '../mixin'
  import {mask} from 'vue-the-mask'
  export default {
    components: {
    },
    directives: {mask},
    mixins: [mixin],
    data: () => ({
      user:{
        bank_id:'',
        agency:'',
        account:'',
        cpf:'',
        loading: true,
        id: '',
        favored:'',
        type:''
      },
      config:{
        perc_member:'',
        loading: true,
      },
      banks:[],
      types:[
        {text:"Conta Corrente"},
        {text:"Conta Poupança"}
      ],
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
          }).catch(error => {
            this.snackbarText = "Erro ao carregar usuário!"
            this.snackbar = true   
          })
      },
      getConfigurations(){
        this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/general-config")
          .then(response => {
            this.config = response.data
            this.config.loading = false
          }).catch(error => {
            this.snackbarText = "Erro ao carregar configs!"
            this.snackbar = true   
          })
      },
      getBank(){
        this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/bank/active")
          .then(response => {
            this.banks = response.data 
          });
      },
      saveUser(){
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/user",{
            id: this.jwt_decode.sub,
            favored:this.user.favored,
            type:this.user.type,
            bank_id:this.user.bank_id,
            agency:this.user.agency,
            account:this.user.account,
            cpf:this.user.cpf
          })
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
          }).catch(error => {
            this.snackbarText = "Erro ao gravar!"
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
          }).catch(error => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          })
      }
    },
    
    created() {
      this.getRole()
      this.getUser()
      this.getBank()
      this.getConfigurations()
    }
  }
</script>
