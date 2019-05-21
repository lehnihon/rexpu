<template>
  <div class="painel">
    <h1 class="subheading grey--text mx-4">Painel</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md3>
          <v-card color="primary" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="user">R${{user.amount}}</div>
                <span>SALDO</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md3>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{cpm.list.publisher.amount}}</div>
                <span>CPM PUBLISHER</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md3>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{cpm.list.redator.amount}}</div>
                <span>CPM REDATOR</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md3>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{this.config.perc_member}}%</div>
                <span>INDICAÇÃO</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink pa-1 v-if="memberAproved.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Aprovar Membros</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="memberAproved.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="memberAproved.headers" :items="memberAproved.list" :search="memberAproved.search" :loading="memberAproved.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>
                        <v-btn small fab flat @click="dialog = true;memberAproved.currentId = props.item.id">
                          <v-icon> 
                            check_circle
                          </v-icon>
                        </v-btn>
                      </td>
                    </template>
                    <v-alert
                      v-slot:no-results
                      :value="true"
                      color="error"
                      icon="warning"
                    >Your search for "{{ search }}" found no results.</v-alert>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex grow pa-1>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Membros</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="member.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="member.headers" :items="member.list" :search="member.search" :loading="member.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>R${{ props.item.amount }}</td>
                      <td>{{ props.item.clicks_a }}</td>
                      <td>{{ props.item.clicks_b }}</td>
                    </template>
                    <v-alert
                      v-slot:no-results
                      :value="true"
                      color="error"
                      icon="warning"
                    >Your search for "{{ search }}" found no results.</v-alert>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline justify-center">Aprovar Usuário?</v-card-title>

        <v-card-actions class="justify-center">

          <v-btn
            color="primary"
            flat="flat"
            @click="aproveMember(memberAproved.currentId)"
          >
            Sim
          </v-btn>

          <v-btn
            color="primary"
            flat="flat"
            @click="disapproveMember(memberAproved.currentId)"
          >
            Não
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import mixin from "../mixin";
export default {
  components: {
  },
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    dialog:false,
    cpm:{
      list:[],
      loading:true
    },
    config:{
      perc_member:'',
      loading:true
    },
    memberAproved:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      loading:true,
      currentId:'',
      new:false,
      form:{
        name:'',
        email:'',
        password:''
      }
    },
    member:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        {text: 'Saldo', value:'amount' },
        {text: 'Clicks P.', value:'clicks_a' },
        {text: 'Clicks R.', value:'clicks_b' },
      ],
      list:[],
      loading:true,
      new:false,
      valid:true,
      form:{
        name:'',
        email:'',
        password:''
      }
    },
    user:{
    }
  }),
  methods: {
    getCPM() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/cpm/dashboard")
        .then(response => {
          this.cpm.list = response.data
          this.cpm.loading = false;
        });
    },
    getConfigurations(){
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/general-config")
        .then(response => {
          this.config.perc_member = response.data.perc_member
          this.config.loading = false
        }).catch(function (error) {
          
        })
    },
    getMembersAccepted(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/accepted")
          .then(response => {
            if(response.data.length){
              this.memberAproved.new = true
            }else{
              this.memberAproved.new = false
            }
            this.memberAproved.list = response.data
            this.memberAproved.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    getMembers(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user")
          .then(response => {
            this.member.list = response.data
            this.member.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    getUser(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/"+this.jwt_decode.sub)
          .then(response => {
            this.user = response.data
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    aproveMember(id){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/user/accepted/"+id)
          .then(response => {
            this.getMembersAccepted()
            this.snackbarText = "Aprovado!"
            this.snackbar = true
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
      this.dialog = false
    },
    disapproveMember(id){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/user/naccepted/"+id)
          .then(response => {
            this.getMembersAccepted()
            this.snackbarText = "Não Aprovado!"
            this.snackbar = true
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
      this.dialog = false
    }
    
  },

  created() {
    this.getRole()
    this.getCPM()
    this.getConfigurations()
    this.getMembers()
    this.getMembersAccepted()
    this.getUser()
  }
}
</script>
