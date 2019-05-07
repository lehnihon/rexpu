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
                      <td>{{ props.item.title }}</td>
                      <td>R${{ props.item.amount }}</td>
                      <td>
                        <v-icon class="mr-2">search</v-icon>
                        <v-icon>edit</v-icon>
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
        <v-flex md6 v-show="cpm.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Solicitar Saque</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="cpm.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Valor"
                    prefix="R$"
                    :mask="cpm.maskamount"
                    v-model="cpm.form.amount"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveCPM" depressed color="primary">Solicitar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="cpm..new = true">
      <v-icon>add</v-icon>
    </v-btn>
    <v-snackbar v-model="snackbar" bottom>
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
        { text: "Título", value: "question" },
        { text: "Valor", value: "amount" },
        { text: "Ações", sortable: false }
      ],
      list:[],
      search:'',
      new:false,
      maskamount:'##########',
      form:{
        title:'',
        amount:'',
        done:false,
        error:false,
        error_obs:'',
        user_id:''
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