<template>
  <div class="membros">
    <h1 class="subheading grey--text mx-4">Indicações</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md12>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Indicações</h3>
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
                      <td>{{ props.item.user.name }}</td>
                      <td>{{ props.item.indicated.name }}</td>
                      <td>{{ props.item.clicks }}</td>
                      <td>{{ formatMoney(props.item.amount) }}</td>
                      <td>
                        <v-btn small fab flat @click="aproveIndication(props.item.id)">
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
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
    snackbarText: '',
    member:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Usuário',value:'name'},
        {text:'Indicado',value:'email'},
        {text:'Clicks',value:'email'},
        {text:'Valor',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      list:[],
      loading:true
    },
  }),
  methods:{
    formatMoney(money){
      return "R$"+money.toString().replace(".",",")
    },
    getIndications(){
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/indication")
        .then(response => {
          this.member.list = response.data
          this.member.loading = false
        }).catch(function (error) {
          this.snackbarText = "Erro ao consultar!"
          this.snackbar = true
        })
    },
    aproveIndication(id){
      if (confirm("Aprovar crédito?")) {
      this.$axiosAPI
        .put(process.env.VUE_APP_API_URL+"/indication/"+id)
        .then(response => {
          this.snackbarText = "Aprovado com sucesso!"
          this.snackbar = true
          this.getIndications()
        }).catch(function (error) {
          this.snackbarText = "Erro ao gravar!"
          this.snackbar = true   
        })
      }
    },
    checkDays(dateitem){
      var date = new Date(dateitem);
      date.setDate(date.getDate()+30);
      var datenow = new Date();
      if(datenow > date){
        return true
      }else{
        return false
      }
    }
  },
  created() {
    this.getRole()
    this.getIndications()
  }
}
</script>
