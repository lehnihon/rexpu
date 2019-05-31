<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Matérias</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md12 v-if="(role.list.includes(1) || role.list.includes(2))">
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
                  <v-data-table disable-initial-sort :headers="subject.headers" :items="subject.list" :search="subject.search" :loading="subject.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ linkReal+props.item.users[0].pivot.link_hash }}</td>
                      <td>{{ props.item.created_at }}</td>
                      <td>
                        <v-btn :loading="linkLoading" small fab flat @click="generateLink(props.item.users[0].pivot.link_hash)">
                          <v-icon> 
                            insert_link
                          </v-icon>
                        </v-btn>
                        <v-btn :loading="linkLoading" small fab flat @click="deleteSubject(props.item.id)">
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
        <v-flex md12>
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
                  <v-data-table disable-initial-sort :headers="suggestion.headers" :items="suggestion.list" :search="suggestion.search" :loading="suggestion.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.link }}</td>
                      <td>
                        <v-btn v-if="(role.list.includes(1) || role.list.includes(3))" class="mx-0" small fab flat @click="showSubject(props.item.id)">
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
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastro de Sugestão</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="suggestion.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="suggestion"
                v-model="suggestion.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Título"
                      v-model="suggestion.form.title"
                      :rules="[v => !!v || 'Título é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Link sugestão"
                      v-model="suggestion.form.link"
                      :rules="[v => !!v || 'Link é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="suggestion.form.description"
                    :editorToolbar="customToolbar"
                    placeholder="Descrição"
                    ></vue-editor>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!suggestion.valid" @click="saveSuggestion" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="subject.new" ref="materiaForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastro de Matéria ID:{{this.subject.form.suggestion_id}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="subject.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="subject"
                v-model="subject.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Título"
                      v-model="subject.form.title"
                      :rules="[v => !!v || 'Título é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Link matéria"
                      v-model="subject.form.link"
                      :rules="[v => !!v || 'Link é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="subject.form.obs"
                    :editorToolbar="customToolbar"
                    placeholder="Observações"
                    ></vue-editor>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!subject.valid" @click="saveSubject" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn v-if="(role.list.includes(1) || role.list.includes(2))" color="primary" dark fixed bottom right fab @click="showSuggestion">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="linkModal" max-width="500px">
      <v-alert
        value="true"
        v-model="linkModal"
        dismissible
        type="info"
      >
        <p>
          <strong>Link Curto:</strong> {{linkTiny}}
        </p>
      </v-alert>
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
import { VueEditor } from "vue2-editor";
export default {
  components: {VueEditor},
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: '',
    linkTiny: '',
    linkReal:'',
    linkModal: false,
    linkLoading:false,
    customToolbar:[
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
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
      valid:true,
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
        {text:'Link', sortable: false},
        {text:'Data',value:'created_at'},
        { text: 'Ações', sortable: false }
      ],
      list:[],
      loading:true,
      new:false,
      valid:true,
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
    getSubject(){
      this.linkReal = process.env.VUE_APP_API_URL+"link/";
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/subject/user/"+this.jwt_decode.sub)
          .then(response => {
            this.subject.list = response.data
            this.subject.loading = false
          }).catch(function (error) {
            
          })
    },
    generateLink(link){
      this.linkLoading = true
      axios
        .get("https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url="+process.env.VUE_APP_API_URL+"/link/"+link)
        .then(response => {
          this.linkLoading = false
          this.linkTiny = response.data
          this.linkModal = true
        })
    },

    getSuggestion(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/suggestion")
          .then(response => {
            this.suggestion.list = response.data
            this.suggestion.loading = false
          }).catch(function (error) {
            
          })
    },
    saveSuggestion(){
      if (this.$refs.suggestion.validate()) {
      this.suggestion.form.user_id = this.jwt_decode.sub
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/suggestion",this.suggestion.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.$refs.suggestion.reset()
          this.getSuggestion()
          this.suggestion.new = false
        })
      }
    },
    saveSubject(){
      if (this.$refs.subject.validate()) {
      this.subject.form.user_id = this.jwt_decode.sub
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/subject",this.subject.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.$refs.subject.reset()
          this.getSubject()
          this.subject.new = false
        })
      }
    },
    showSubject(suggestion_id){
      this.subject.new = true
      this.subject.form.suggestion_id = suggestion_id
      setTimeout(() => {
        this.$refs.materiaForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    showSuggestion(){
      this.suggestion.new = true
      setTimeout(() => {
        this.$refs.sugestaoForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    deleteSubject(idSubject){
      if(confirm("Desativar?")){
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/subject/disable",{id:idSubject})
          .then(response => {
            this.snackbarText = "Desativado com sucesso!"
            this.snackbar = true
            this.getSubject()
          })
      }
    }
  },
  created() {
    this.getRole()
    this.getSubject()
    this.getSuggestion()
  }
};
</script>
