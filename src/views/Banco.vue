<template>
  <div class="banco">
    <h1 class="subheading grey--text mx-4">Bancos</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Bancos</h3>
              <v-btn class="ml-auto" color="primary" dark @click="bank.new = true">
                <v-icon>add</v-icon> NOVO BANCO
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="bank.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="bank.headers" :items="bank.list" :search="bank.search" :loading="bank.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>
                        <v-btn small fab flat @click="editBank(props.item)">
                          <v-icon> 
                            edit
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
        <v-flex md6 v-show="bank.new">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastrar Banco</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="bank.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="bank"
                v-model="bank.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Banco"
                      :rules="[v => !!v || 'Banco é obrigatório']"
                      v-model="bank.form.name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="bank.btnLoading" :disabled="!bank.valid" @click="saveBank" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="bank.edit.new">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Editar Banco ID:{{bank.edit.form.id}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="bank.edit.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="bankEdit"
                v-model="bank.edit.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Banco"
                      :rules="[v => !!v || 'Banco é obrigatório']"
                      v-model="bank.edit.form.name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex x12>
                    <v-checkbox
                      v-model="bank.edit.form.active"
                      label="Ativo"
                      required
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="bank.edit.btnLoading" :disabled="!bank.edit.valid" @click="updateBank" depressed color="primary">Alterar</v-btn>
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
export default {
  components: {
  },
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    bank:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Banco", value: "name" },
        { text: "Ações", sortable: false }
      ],
      valid:true,
      list:[],
      search:'',
      new:false,
      form:{
        name:''
      },
      btnLoading:false,
      loading:true,
      edit:{
        valid:true,
        new:false,
        form:{
          id:null,
          name:'',
          active:false,
        },
        btnLoading:false,
        loading:true,
      }
    }
  }),
  methods: {
    getBank() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/bank")
        .then(response => {
          this.bank.list = response.data
          this.bank.loading = false;
        });
    },
    editBank(bank) {
      console.log(bank)
      this.bank.edit.new = true
      this.bank.edit.form.id = bank.id
      this.bank.edit.form.name = bank.name
      this.bank.edit.form.active = (bank.active == '0') ?  false : true
    },
    updateBank() {
      if (this.$refs.bankEdit.validate()) {
        this.bank.edit.valid  = false
        this.bank.edit.btnLoading = true
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/bank",this.bank.edit.form)
          .then(response => {
            this.snackbarText = "Atualizado com sucesso!"
            this.snackbar = true
            this.$refs.bankEdit.reset()
            this.getBank()
            this.bank.edit.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.bank.edit.valid  = true
            this.bank.edit.btnLoading = false
          })
      }
    },
    saveBank(){
      if (this.$refs.bank.validate()) {
        this.bank.valid  = false
        this.bank.btnLoading = true
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/bank",this.bank.form)
          .then(response => {
            
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
            this.$refs.bank.reset()
            this.getBank()
            this.bank.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.bank.valid  = true
            this.bank.btnLoading = false
          })
      }
    }
  },

  created() {
    this.getRole()
    this.getBank()
  }
}
</script>