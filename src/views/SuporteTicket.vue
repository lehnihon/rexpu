<template>
  <div class="suporte-ticket">
    <h1 class="subheading grey--text mx-4">Suporte/Ticket</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Tickets</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table :headers="headers" :items="suporteTicketList" :search="search" :loading="suporteTicketLoadingTable">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.created_at }}</td>
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
        <v-flex xs12 v-show="novoTicket">
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastro de Ticket</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="novoTicket = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Título"
                    v-model="m_title"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-btn color="primary" dark fixed bottom right fab @click="novoTicket = true">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex'
import mixin from "../mixin";
export default {
  components: {},
  mixins: [mixin],
  data: () => ({
    headers: null,
    snackbar: false,
    snackbarText: "",
    headers: [
      { text: "ID", value: "id" },
      { text: "Título", value: "title" },
      { text: "Data", value: "created_at" },
      { text: "Ações", sortable: false }
    ],
    role: "",
    suporteTicketList: [],
    search: "",
    suporteTicketLoadingTable:true,
    novoTicket:false
  }),
  computed: {
    ...mapState([
      'accessToken',
    ])
  },
  methods: {
    getSuporteTicket() {
      this.jwt_decode = this.decodeJWT(this.accessToken);
      this.role = this.jwt_decode.role;
      axios
        .get(process.env.VUE_APP_API_URL+"/ticket")
        .then(response => {
          this.suporteTicketList = response.data;
          this.suporteTicketLoadingTable = false;
        });
    }
  },

  created() {
    this.getSuporteTicket();
  }
};
</script>
