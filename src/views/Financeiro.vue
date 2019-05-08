<template>
  <div class="financeiro">
    <h1 class="subheading grey--text mx-4">Financeiro</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Saque</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="financial.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="financial.headers" :items="financial.list" :search="financial.search" :loading="financial.loading">
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
        <v-flex md6 v-show="financial.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Solicitar Saque</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="financial.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Valor"
                    prefix="R$"
                    mask="##########"
                    v-model="financial.form.amount"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveFinancial" depressed color="primary">Solicitar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="financial.new = true">
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
    financial:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Título", value: "question" },
        { text: "Valor", value: "amount" },
        { text: "Ações", sortable: false }
      ],
      list:[],
      search:'',
      new:false,
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
    getFinancial() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/financial/user/"+this.jwt_decode.sub)
        .then(response => {
          this.financial.list = response.data
          this.financial.loading = false;
        });
    },
    saveFinancial(){
      this.financial.form.title = "Solicitar Saque";
      this.financial.form.user_id = this.jwt_decode.sub
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/financial",this.financial.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.clearForm(this.financial.form)
          this.getFinancial()
        })
    }
  },

  created() {
    this.getRole()
    this.getFinancial()
  }
}
</script>