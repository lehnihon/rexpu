<template>
  <div class="parceiro">
    <h1 class="subheading grey--text mx-4">Parceiros</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Parceiros</h3>
              <v-btn class="ml-auto" color="primary" dark @click="partner.new = true">
                <v-icon>add</v-icon> NOVO PARCEIRO
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="partner.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="partner.headers" :items="partner.list" :search="partner.search" :loading="partner.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>
                        <v-btn small fab flat @click="editPartner(props.item)">
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
        <v-flex md6 v-show="partner.new">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastrar Parceiro</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="partner.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="partner"
                v-model="partner.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Parceiro"
                      :rules="[v => !!v || 'Parceiro é obrigatório']"
                      v-model="partner.form.name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="partner.btnLoading" :disabled="!partner.valid" @click="savePartner" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="partner.edit.new">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Editar Parceiro ID:{{partner.edit.form.id}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="partner.edit.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="partnerEdit"
                v-model="partner.edit.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Parceiro"
                      :rules="[v => !!v || 'Parceiro é obrigatório']"
                      v-model="partner.edit.form.name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex x12>
                    <v-checkbox
                      v-model="partner.edit.form.active"
                      label="Ativo"
                      required
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="partner.edit.btnLoading" :disabled="!partner.edit.valid" @click="updatePartner" depressed color="primary">Alterar</v-btn>
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
    partner:{
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
    getPartner() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/partner")
        .then(response => {
          this.partner.list = response.data
          this.partner.loading = false;
        });
    },
    editPartner(partner) {
      this.partner.edit.new = true
      this.partner.edit.form.id = partner.id
      this.partner.edit.form.name = partner.name
      this.partner.edit.form.active = (partner.active == '0') ?  false : true
    },
    updatePartner() {
      if (this.$refs.partnerEdit.validate()) {
        this.partner.edit.valid  = false
        this.partner.edit.btnLoading = true
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/partner",this.partner.edit.form)
          .then(response => {
            this.snackbarText = "Atualizado com sucesso!"
            this.snackbar = true
            this.$refs.partnerEdit.reset()
            this.getPartner()
            this.partner.edit.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.partner.edit.valid  = true
            this.partner.edit.btnLoading = false
          })
      }
    },
    savePartner(){
      if (this.$refs.partner.validate()) {
        this.partner.valid  = false
        this.partner.btnLoading = true
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/partner",this.partner.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
            this.$refs.partner.reset()
            this.getPartner()
            this.partner.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.partner.valid  = true
            this.partner.btnLoading = false
          })
      }
    }
  },

  created() {
    this.getRole()
    this.getPartner()
  }
}
</script>