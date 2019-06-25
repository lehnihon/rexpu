<template>
  <div class="ganho">
    <h1 class="subheading grey--text mx-4">Ganhos</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Ganhos</h3>
              <v-btn class="ml-auto" color="primary" dark @click="earning.new = true">
                <v-icon>add</v-icon> NOVO GANHO
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="earning.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="earning.headers" :items="earning.list" :search="earning.search" :loading="earning.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.partner.name }}</td>
                      <td>{{ formatMoney(props.item.value) }}</td>
                      <td>{{ formatDate(props.item.date_earning) }}</td>
                      <td>
                        <v-btn v-if="role.list.includes(1)" small fab flat @click="deleteEarning(props.item.id)">
                          <v-icon> 
                            delete
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
        <v-flex md6 v-show="earning.new">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastrar Ganho</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="earning.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="earning"
                v-model="earning.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-select
                      v-model="earning.form.partner_id"
                      :items="partner.list"
                      :loading="partner.loading" 
                      item-text="name" 
                      item-value="id"
                      label="Parceiro"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Ganho"
                      :rules="[v => !!v || 'Ganho é obrigatório']"
                      prefix="R$"
                      v-model.lazy="earning.form.value"
                      v-money="money"
                    ></v-text-field>
                  </v-flex>
                  <v-flex x12>

                    <v-menu
                    ref="dt1"
                    v-model="dt1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFormatted1"
                        label="Data"
                        persistent-hint
                        prepend-icon="event"
                        @blur="date1 = parseDate(dateFormatted1)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" no-title @input="dt1 = false"></v-date-picker>
                  </v-menu>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="earning.btnLoading" :disabled="!earning.valid" @click="saveEarning" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
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
import {VMoney} from 'v-money'

export default {
  components: {
  },
  mixins: [mixin],
  data: (vm) => ({
    snackbar: false,
    snackbarText: "",
    earning:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Parceiro", value: "partner.name" },
        { text: "Ganho", value: "value" },
        { text: "Data", value: "date_earning" },
        { text: "Ações", sortable: false }
      ],
      valid:true,
      list:[],
      search:'',
      new:false,
      form:{
        value:'',
        partner_id:0,
        date_earning:''
      },
      btnLoading:false,
      loading:true,
    },
    partner:{
      loading:true,
      list:[]
    },
    money: {
      decimal: ',',
      precision: 2
    },
    date1:new Date().toISOString().substr(0, 10),
    dateFormatted1: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dt1: false
  }),
  directives: {money: VMoney},
  methods: {
    formatMoney(money){
      return "R$"+money.toString().replace(".",",")
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [day, month , year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getEarning() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/earning")
        .then(response => {
          this.earning.list = response.data
          this.earning.loading = false;
        });
    },
    getPartner() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/partner")
        .then(response => {
          this.partner.list = response.data
          this.partner.loading = false;
        });
    },
    saveEarning(){
      if (this.$refs.earning.validate()) {
        this.earning.valid  = false
        this.earning.btnLoading = true
        this.earning.form.date_earning = this.date1
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/earning",this.earning.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
            this.$refs.earning.reset()
            this.getEarning()
            this.earning.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.earning.valid  = true
            this.earning.btnLoading = false
          })
      }
    },
    deleteEarning(id){
      if(confirm("Deletar?")){
        this.$axiosAPI
          .delete(process.env.VUE_APP_API_URL+"/earning/"+id)
          .then(response => {
            this.snackbarText = "Deletado com sucesso!"
            this.snackbar = true
            this.getEarning()
          })
      }
    }
  },
  watch: {
    date1 (val) {
      this.dateFormatted1 = this.formatDate(this.date1)
    }
  },
  created() {
    this.getRole()
    this.getPartner()
    this.getEarning()
  }
}
</script>