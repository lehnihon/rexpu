<template>
  <div class="reports">
    <h1 class="subheading grey--text mx-4">Relatórios</h1>
    <v-container grid-list-md> 
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Opções</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                    v-model="option"
                    :rules="[v => !!v || 'Tipo é obrigatório']"
                    :items="options" 
                    item-text="text" 
                    item-value="id"
                    label="Tipo"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn  @click="generateRel" depressed color="primary">Gerar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 v-show="report.new" ref="reportForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="report.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="report.headers" :items="report.list" :search="report.search" :loading="report.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>R${{ props.item.amount }}</td>
                      <td>{{ props.item.clicks_a }}</td>
                      <td>{{ props.item.clicks_b }}</td>
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td></td>
                      <td>R${{report.totalBalance}}</td>
                      <td>{{report.totalClicksA}}</td>
                      <td>{{report.totalClicksB}}</td>
                    </template>
                    <v-alert
                      v-slot:no-results
                      :value="true"
                      color="error"
                      icon="warning"
                    >Your search for "{{ sugestoesSearch }}" found no results.</v-alert>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <download-excel
                :data   = "report.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=1500>
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
    json_data: [
        { colA: "Hello", colB: "World" },
        {
          colA: "Multi-line",
          /* Multi-line value: */
          colB:
            "This is a long paragraph\nwith multiple lines\nthat should show in a single cell."
        },
        { colA: "Another", colB: "Regular cell" }
      ],
    snackbar: false,
    snackbarText: "",
    option:null,
    options:[
      {id:1,text:'Total Gerado na Plataforma'}
    ],
    report:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        {text: 'Saldo', value:'amount' },
        {text: 'Clicks P.', value:'clicks_a' },
        {text: 'Clicks R.', value:'clicks_b' },
      ],
      totalBalance:0,
      totalClicksA:0,
      totalClicksB:0,
      new:false,
      list:[],
      loading:true,
      search:''
    }
  }),
  methods: {
    downloadPDF(){

    },
    generateRel(){
      this.report.new = true
      if(this.option == 1){
        this.getMembers();
      }
    },
    getMembers(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user")
          .then(response => {
            this.report.list = response.data
            this.generateTotals(response.data)
            this.report.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    generateTotals(list){
      for (let val of list) {
        this.report.totalBalance += val.amount
        this.report.totalClicksA += val.clicks_a
        this.report.totalClicksB += val.clicks_b
      }
    }
  },
  created() {
    this.getRole()
  }
}
</script>
