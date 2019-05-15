<template>
  <div class="membros">
    <h1 class="subheading grey--text mx-4">Membros</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
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
        <v-flex md6 v-show="member.new" ref="memberForm">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastro de Membros</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="member.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Nome"
                    v-model="member.form.name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="E-mail"
                    v-model="member.form.email"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Senha"
                  v-model="member.form.password"
                ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveMember" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="showMember">
      <v-icon>add</v-icon>
    </v-btn>
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
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      list:[],
      loading:true,
      new:false,
      form:{
        name:'',
        email:'',
        password:''
      }
    },
  }),
  methods:{
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
    showMember(){
      this.member.new = true
      setTimeout(() => {
        this.$refs.memberForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    saveMember(){
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/user",this.member.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.clearForm(this.member.form)
          this.getMembers()
        }).catch(function (error) {
          this.snackbarText = "Erro ao gravar!"
          this.snackbar = true   
        })
    }
  },
  created() {
    this.getRole()
    this.getMembers()
  }
}
</script>
