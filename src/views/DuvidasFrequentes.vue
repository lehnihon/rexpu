<template>
  <div class="duvidas-frequentes">
    <h1 class="subheading grey--text mx-4">Dúvidas Frequentes</h1>
    <v-container grid-list-md>
      <v-layout row wrap v-if="(role.list.includes(1))">
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Dúvidas Frequentes</h3>
              <v-btn class="ml-auto" v-if="(role.list.includes(1))" color="primary" dark @click="showAskedQ">
                <v-icon>add</v-icon> NOVA DÚVIDA
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="asked_questions.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="asked_questions.headers" :items="asked_questions.list" :search="asked_questions.search" :loading="asked_questions.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td v-html="props.item.question"></td>
                      <td><v-btn small fab flat @click="deleteAskedQuestions(props.item.id)">
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
        <v-flex md6 v-show="asked_questions.new" ref="asked_questionsForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastro Dúvidas Frequentes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="asked_questions.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="asked_questions"
                v-model="asked_questions.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="asked_questions.form.question"
                    :editorToolbar="customToolbar"
                    placeholder="Pergunta"
                    ></vue-editor>
                  </v-flex>
                  <v-flex xs12>
                    <vue-editor 
                    v-model="asked_questions.form.answer"
                    :editorToolbar="customToolbar"
                    placeholder="Resposta"
                    ></vue-editor>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="asked_questions.btnLoading" :disabled="!asked_questions.valid" @click="saveAskedQuestions" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex md12>
          <v-card>

            <v-list>
              <v-list-group
                v-for="item in asked_questions.list"
                :key="item.id"
                :prepend-icon="item.action"
                no-action
              >
                <template v-slot:activator>
                  <v-layout class="mt-2" row wrap >
                    <v-flex class="ml-3" xs shrink>
                      <v-icon>question_answer</v-icon>
                    </v-flex>
                    <v-flex xs v-html="item.question"></v-flex>
                  </v-layout>
                </template>
                <v-layout class="mt-2" row wrap >
                  <v-flex class="pl-3" xs12 v-html="item.answer"></v-flex>
                </v-layout>
              </v-list-group>
            </v-list>
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
  components: {
    VueEditor
  },
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    customToolbar:[
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
    asked_questions:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Pergunta", value: "question" },
        { text: 'Ações', sortable: false }
      ],
      list:[],
      search:'',
      items: [],
      new:false,
      valid:true,
      form:{
        question:'',
        answer:''
      },
      loading:true,
      btnLoading:false
    }
  }),
  methods: {
    getAskedQuestions() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/asked-questions")
        .then(response => {
          this.asked_questions.list = response.data
          this.makeList(response.data)
          this.asked_questions.loading = false;
        });
    },
    makeList(qalist){
      this.asked_questions.items = []
      qalist.map((item)=>{
        this.asked_questions.items.push({
          action: 'question_answer',
          title: item.question,
          items: [
            { title: item.answer }
          ]
        })
      })
    },
    showAskedQ(){
      this.asked_questions.new = true
      setTimeout(() => {
        this.$refs.asked_questionsForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    deleteAskedQuestions(id){
      if(confirm("Deletar?")){
        this.$axiosAPI
          .delete(process.env.VUE_APP_API_URL+"/asked-questions/"+id)
          .then(response => {
            this.snackbarText = "Deletado com sucesso!"
            this.snackbar = true
            this.getAskedQuestions()
          })
      }
    },
    saveAskedQuestions(){
      if (this.$refs.asked_questions.validate()){
        if(this.asked_questions.form.question != '' && this.asked_questions.form.answer != ''){
          this.asked_questions.valid = false
          this.asked_questions.btnLoading = true
          this.$axiosAPI
            .post(process.env.VUE_APP_API_URL+"/asked-questions",this.asked_questions.form)
            .then(response => {
              this.snackbarText = "Salvo com sucesso!"
              this.snackbar = true
              this.$refs.asked_questions.reset()
              this.asked_questions.form.question = ''
              this.asked_questions.form.answer = ''
              this.getAskedQuestions()
              this.asked_questions.new = false
            }).catch((error) => {
              this.snackbarText = "Erro ao gravar!"
              this.snackbar = true   
            }).finally(() => {
              this.asked_questions.valid = true
              this.asked_questions.btnLoading = false
            })
        }
      }
    }
  },

  created() {
    this.getRole()
    this.getAskedQuestions()
  }
}
</script>