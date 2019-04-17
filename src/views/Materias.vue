<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Matérias</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md12>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Matérias</h3>
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
                  <v-data-table :headers="headers" :items="materiasList" :search="search">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title.rendered }}</td>
                      <td>{{ props.item.status }}</td>
                      <td>
                        <v-icon
                          small
                          class="mr-2"
                          @click="editItem(props.item)"
                        >
                          edit
                        </v-icon>
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
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import mixin from "../mixin";
export default {
  components: {},
  mixins: [mixin],
  data: () => ({
    headers: null,
    snackbar: false,
    snackbarText: "",
    headers:[
      {text:'ID',value:'id'},
      {text:'Título',value:'title.rendered'},
      {text:'Status',value:'status'},
      { text: 'Ações', sortable: false }
    ],
    materiasList:[]
  }),
  computed: {
    ...mapState(["accessToken", "accessTokenWP"])
  },
  methods: {
    getMaterias(){
      axios
        .get(process.env.VUE_APP_WP_URL + "/wp-json/wp/v2/posts", {
          headers: {
            'Authorization': "Basic " + this.accessTokenWP
          }
        })
        .then(response => {
          this.materiasList = response.data
        })
    }
  },

  mounted() {
    this.getMaterias()
  }
};
</script>
