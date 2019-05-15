<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Matérias</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Matérias</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="subject.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table :headers="subject.headers" :items="subject.list" :search="subject.search" :loading="subject.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.created_at }}</td>
                      <td>
                        <v-btn :loading="linkLoading" small fab flat @click="gerarLink(props.item.link)">
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
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Sugestões</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="suggestion.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table :headers="suggestion.headers" :items="suggestion.list" :search="suggestion.search" :loading="suggestion.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.link }}</td>
                      <td>
                        <v-btn class="mx-0" small fab flat @click="mostrarMateria(props.item.id)" v-if="(role.list.includes(1) || role.list.includes(2))">
                          <v-icon> 
                            computer
                          </v-icon>
                        </v-btn>
                      </td>
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
          </v-card>
        </v-flex>
        <v-flex md6 v-show="suggestion.new" ref="sugestaoForm">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastro de Sugestão</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="suggestion.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Título"
                    v-model="suggestion.form.title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Link sugestão"
                    v-model="suggestion.form.link"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                  label="Descrição"
                  v-model="suggestion.form.description"
                ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="gravarSugestao" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="subject.new" ref="materiaForm">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastro de Matéria</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="subject.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Título"
                    v-model="subject.form.title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Link matéria"
                    v-model="subject.form.link"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                  label="Observações"
                  v-model="subject.form.obs"
                ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="gravarMateria" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="mostrarSugestao">
      <v-icon>add</v-icon>
    </v-btn>
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
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import mixin from '../mixin'
export default {
  components: {},
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: '',
    linkAtual: '',
    linkModal: false,
    linkLoading:false,
    suggestion:{
      search: '',
      headers:[
        {text:'ID',value:'id'},
        {text:'Título',value:'title'},
        {text:'Link',value:'link'},
        { text: 'Ações', sortable: false }
      ],
      list:[],
      loading:true,
      new:false,
      form:{
        title:'',
        description:'',
        link:'',
        user_id:''
      }
    },
    subject:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Título',value:'title'},
        {text:'Data',value:'created_at'},
        { text: 'Ações', sortable: false }
      ],
      list:[],
      loading:true,
      new:false,
      form:{
        title:'',
        link:'',
        obs:'',
        user_id:'',
        suggestion_id:'',
      }
    }
  }),
  methods: {
    getMaterias(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/subject")
          .then(response => {
            this.subject.list = response.data
            this.subject.loading = false
          }).catch(function (error) {
            
          })
    },
    gerarLink(link){
      this.linkLoading = true
      axios
        .get("https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url="+link)
        .then(response => {
          this.linkLoading = false
          this.linkAtual = response.data
          this.linkModal = true
        })
      
    },
    mostrarSugestao(){
      this.suggestion.new = true
      setTimeout(() => {
        this.$refs.sugestaoForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    getSugestao(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/suggestion")
          .then(response => {
            this.suggestion.list = response.data
            this.suggestion.loading = false
          }).catch(function (error) {
            
          })
    },
    gravarSugestao(){
      this.suggestion.form.user_id = this.jwt_decode.sub
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/suggestion",this.suggestion.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
        })
    },
    gravarMateria(){
      this.subject.form.user_id = this.jwt_decode.sub
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/subject",this.subject.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
        })
    },
    mostrarMateria(suggestion_id){
      this.subject.new = true
      this.subject.form.suggestion_id = suggestion_id
      setTimeout(() => {
        this.$refs.materiaForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    }
  },

  created() {
    this.getRole()
    this.getMaterias()
    this.getSugestao()
  }
};
</script>
