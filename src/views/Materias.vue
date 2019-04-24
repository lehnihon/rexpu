<template>
  <div class="projects">
    <v-progress-linear height="3" style="position:fixed; z-index:1000" v-show="loading"  :indeterminate="true"></v-progress-linear>
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
                  <v-data-table :headers="headers" :items="materiasList" :search="search" :loading="materiasLoadingTable">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title.rendered }}</td>
                      <td>{{ props.item.status }}</td>
                      <td>
                        <v-btn :loading="linkLoading" small fab flat @click="gerarLink(props.item.link)" v-if="([1,2,3].includes(role))">
                          <v-icon> 
                            insert_link
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
      </v-layout>
    </v-container>
    <v-dialog v-model="linkModal" max-width="500px">
      <v-card>
        <v-card-title>
          Link: {{linkAtual}}
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click="linkModal=false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    snackbarText: '',
    headers:[
      {text:'ID',value:'id'},
      {text:'Título',value:'title.rendered'},
      {text:'Status',value:'status'},
      { text: 'Ações', sortable: false }
    ],
    role:'',
    materiasList:[],
    search:'',
    materiasLoadingTable:true,
    linkAtual: '',
    linkModal: false,
    loading:false
  }),
  computed: {
    ...mapState(["accessToken", "accessTokenWP"])
  },
  methods: {
    getMaterias(){
      this.jwt_decode = this.decodeJWT(this.accessToken)
      this.role = this.jwt_decode.role.id
      this.$axiosAPI
        .get(process.env.VUE_APP_WP_URL + "/wp-json/wp/v2/posts")
        .then(response => {
          this.materiasList = response.data
          this.materiasLoadingTable = false
        })
    },
    gerarLink(link){
      this.loading = true
      axios
        .get("https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url="+link)
        .then(response => {
          this.linkLoading = false
          this.linkAtual = response.data
          this.linkModal = true
          this.loading = false
        })
      
    }
  },

  created() {
    this.getMaterias()
  }
};
</script>
