<template>
  <div class="financeiro">
    <h1 class="subheading grey--text mx-4">CPM</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de CPM</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="cpm.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="cpm.headers" :items="cpm.list" :search="cpm.search" :loading="cpm.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.role.role }}</td>
                      <td>R${{ props.item.amount }}</td>
                      <td>{{ props.item.created_at }}</td>
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
        <v-flex md6 v-show="cpm.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastrar CPM</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="cpm.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                    v-model="cpm.form.role_id"
                    :rules="[v => !!v || 'Tipo é obrigatório']"
                    :items="cpm.tipos" 
                    item-text="text" 
                    item-value="id"
                    label="Tipo"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Valor"
                    :rules="[v => !!v || 'Valor é obrigatório']"
                    prefix="R$"
                    :mask="cpm.maskamount"
                    v-model="cpm.form.amount"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveCPM" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="cpm.new = true">
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
    snackbarText: "",
    cpm:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Tipo", value: "question" },
        { text: "Valor", value: "amount" },
        { text: "Data", value: "created_at" }
      ],
      list:[],
      search:'',
      new:false,
      maskamount:'##########',
      tipos:[
        {id:2,text:'Publisher'},
        {id:3,text:'Redator'}
      ],
      form:{
        role_id:'',
        amount:'',
      },
      loading:true
    }
  }),
  methods: {
    getCPM() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/cpm")
        .then(response => {
          this.cpm.list = response.data
          this.cpm.loading = false;
        });
    },
    saveCPM(){
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/cpm",this.cpm.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.clearForm(this.cpm.form)
          this.getCPM()
        })
    }
  },

  created() {
    this.getRole()
    this.getCPM()
  }
}
</script>