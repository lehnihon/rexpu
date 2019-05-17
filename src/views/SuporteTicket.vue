<template>
  <div class="suporte-ticket">
    <h1 class="subheading grey--text mx-4">Suporte/Ticket</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Tickets</h3>
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
        <v-flex md6 v-show="ticket.new">
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
                    <v-textarea :rules="[v => !!v || 'Descrição é obrigatório']" label="Descrição" v-model="ticket.form.description"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!ticket.valid" @click="saveSuportTicket" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md12 v-show="ticketDetails.new">
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
                  <v-flex xs12>
                    <span>{{ticketDetails.item.description}}</span>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea :rules="[v => !!v || 'Resposta é obrigatório']" label="Resposta" v-model="ticketDetails.form.obs"></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
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
                            {{item.ticket.user.name}}
                          </v-flex>

                          <v-flex xs12>
                            {{item.obs}}
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
    <v-btn color="primary" dark fixed bottom right fab @click="ticket.new = true">
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
  components: {},
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    ticket: {
      headers: [
        { text: "ID", value: "id" },
        { text: "Título", value: "title" },
        { text: "Data", value: "created_at" },
        { text: "Ações", sortable: false }
      ],
      list: [],
      search: "",
      new: false,
      loading: true,
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
      form: {
        obs: "",
        ticket_id: "",
        user_id:""
      }
    }
  }),
  methods: {
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
        this.ticket.form.user_id = this.jwt_decode.sub;
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL + "/ticket", this.ticket.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!";
            this.snackbar = true;
            this.$refs.ticket.reset()
            this.getSuportTicket();
            this.ticket.new = false
          });
      }
    },
    saveSuportTicketObs(ticket) {
      if (this.$refs.ticketDetails.validate()) {
        this.ticketDetails.form.ticket_id = ticket;
        this.ticketDetails.form.user_id = this.jwt_decode.sub;
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL + "/ticket-obs", this.ticketDetails.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!";
            this.snackbar = true;
            this.$refs.ticketDetails.reset()
            this.getSuportTicketObs(ticket);
          });
      }
    },
    showDetails(ticket) {
      this.ticketDetails.new = true;
      this.ticketDetails.item = ticket;
      this.getSuportTicketObs(ticket.id);
    }
  },

  created() {
    this.getRole();
    this.getSuportTicket();
  }
};
</script>
