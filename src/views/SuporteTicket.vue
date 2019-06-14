<template>
  <div class="suporte-ticket">
    <h1 class="subheading grey--text mx-4">Suporte/Ticket</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Tickets</h3>
              <v-btn class="ml-auto" color="primary" dark @click="showTicket">
                <v-icon>add</v-icon> NOVO TICKET
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="ticket.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table
                    disable-initial-sort
                    :headers="ticket.headers"
                    :items="ticket.list"
                    :search="ticket.search"
                    :loading="ticket.loading"
                  >
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.user.name }}</td>
                      <td>{{ props.item.created_at }}</td>
                      <td>
                        <v-btn small fab flat @click="showDetails(props.item)">
                          <v-icon class="mr-2">search</v-icon>
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
        <v-flex md6 v-show="ticket.new" ref="ticketForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastro de Ticket</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="ticket.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="ticket"
                v-model="ticket.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field :rules="[v => !!v || 'Título é obrigatório']" label="Título" v-model="ticket.form.title"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="ticket.form.description"
                    :editorToolbar="customToolbar"
                    placeholder="Descrição"
                    ></vue-editor>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="ticket.btnLoading" :disabled="!ticket.valid" @click="saveSuportTicket" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md12 v-show="ticketDetails.new" ref="ticketDetailsForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{ticketDetails.item.title}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="ticketDetails.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="ticketDetails"
                v-model="ticketDetails.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12 v-html="ticketDetails.item.description">
                  </v-flex>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="ticketDetails.form.obs"
                    :editorToolbar="customToolbar"
                    placeholder="Resposta"
                    ></vue-editor>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
                      :loading="ticketDetails.btnLoading"
                      :disabled="!ticketDetails.valid"
                      @click="saveSuportTicketObs(ticketDetails.item.id)"
                      depressed
                      color="primary"
                    >Responder</v-btn>
                  </v-flex>
                  <v-flex xs12>
                    <v-list>
                      <template v-for="(item,index) in ticketDetails.list">
                        <v-layout row wrap :key="item.obs">
                          <v-flex xs12 class="font-weight-bold mr-3">
                            {{item.user.name}}
                          </v-flex>

                          <v-flex xs12 v-html="item.obs">
                          </v-flex>
                        </v-layout>
                        <v-divider class="my-2" v-if="(ticketDetails.list.length-1) != index" :key="index" inset></v-divider>
                      </template>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-form>
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
import { VueEditor } from "vue2-editor";
export default {
  components: {VueEditor},
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    customToolbar:[
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
    ticket: {
      headers: [
        { text: "ID", value: "id" },
        { text: "Título", value: "title" },
        { text: "Usuário", value: "user.name" },
        { text: "Data", value: "created_at" },
        { text: "Ações", sortable: false }
      ],
      list: [],
      search: "",
      new: false,
      loading: true,
      btnLoading:false,
      valid:true,
      form: {
        title: "",
        description: "",
        user_id: ""
      }
    },
    ticketDetails: {
      new: false,
      item: {
        title: "",
        description: "",
        user_id: ""
      },
      list: [],
      valid:true,
      btnLoading:false,
      form: {
        obs: "",
        ticket_id: "",
        user_id:""
      }
    }
  }),
  methods: {
    getSuportTicketAdmin() {
      this.$axiosAPI
        .get(
          process.env.VUE_APP_API_URL + "/ticket"
        )
        .then(response => {
          this.ticket.list = response.data;
          this.ticket.loading = false;
        });
    },
    getSuportTicket() {
      this.$axiosAPI
        .get(
          process.env.VUE_APP_API_URL + "/ticket/user/" + this.jwt_decode.sub
        )
        .then(response => {
          this.ticket.list = response.data;
          this.ticket.loading = false;
        });
    },
    getSuportTicketObs(ticket) {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL + "/ticket-obs/ticket/" + ticket)
        .then(response => {
          this.ticketDetails.list = response.data;
          this.ticketDetails.loading = false;
        });
    },
    saveSuportTicket() {
      if (this.$refs.ticket.validate()) {
        this.ticket.valid = false
        this.ticket.btnLoading = true
        this.ticket.form.user_id = this.jwt_decode.sub;
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL + "/ticket", this.ticket.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!";
            this.snackbar = true;
            this.$refs.ticket.reset()
            this.ticket.form.description = ''
            this.getSuportTicket();
            this.ticket.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.ticket.valid = true
            this.ticket.btnLoading = false
          })
      }
    },
    saveSuportTicketObs(ticket) {
      if (this.$refs.ticketDetails.validate()) {
        if(this.ticketDetails.form.obs != ''){
          this.ticketDetails.valid = false
          this.ticketDetails.btnLoading = true
          this.ticketDetails.form.ticket_id = ticket;
          this.ticketDetails.form.user_id = this.jwt_decode.sub;
          this.$axiosAPI
            .post(process.env.VUE_APP_API_URL + "/ticket-obs", this.ticketDetails.form)
            .then(response => {
              this.snackbarText = "Salvo com sucesso!";
              this.snackbar = true;
              this.$refs.ticketDetails.reset()
              this.ticketDetails.form.obs = '';
              this.getSuportTicketObs(ticket);
            }).catch((error) => {
              this.snackbarText = "Erro ao gravar!"
              this.snackbar = true   
            }).finally(() => {
              this.ticketDetails.valid = true
              this.ticketDetails.btnLoading = false
            })
        }
      }  
    },
    showTicket(){
      this.ticket.new = true
       setTimeout(() => {
        this.$refs.ticketForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    showDetails(ticket) {
      this.ticketDetails.new = true;
      setTimeout(() => {
        this.$refs.ticketDetailsForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
      this.ticketDetails.item = ticket;
      this.getSuportTicketObs(ticket.id);
    }
  },

  created() {
    this.getRole();
    if(this.role.list.includes(1)){
      this.getSuportTicketAdmin();
    }else{
      this.getSuportTicket();
    }
  }
};
</script>
