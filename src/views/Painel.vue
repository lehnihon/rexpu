<template>
  <div class="painel">
    <h1 class="subheading grey--text mx-4">Painel</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md4>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">R${{cpm.list.publisher.amount}}</div>
                <span>CPM PUBLISHER HOJE</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">R${{cpm.list.redator.amount}}</div>
                <span>CPM REDATOR HOJE</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{this.config.perc_member}}%</div>
                <span>INDICAÇÃO</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md6>
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
                      <td>
                        <v-btn small fab flat @click="gerarLink(props.item.link)">
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
    </v-layout>
    </v-container>
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
    cpm:{
      list:[],
      loading:true
    },
    config:{
      perc_member:'',
      loading:true
    },
    member:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      loading:true,
      form:{
        name:'',
        email:'',
        password:''
      }
    },
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
    getMembers(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/accepted")
          .then(response => {
            this.member.list = response.data
            this.member.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    }
  },

  created() {
    this.getRole()
    this.getCPM()
    this.getConfigurations()
    this.getMembers()
  }
}
</script>
