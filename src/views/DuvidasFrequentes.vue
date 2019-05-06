<template>
  <div class="duvidas-frequentes">
    <h1 class="subheading grey--text mx-4">Dúvidas Frequentes</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Dúvidas Frequentes</h3>
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
                      <td>{{ props.item.question }}</td>
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
        <v-flex md6 v-show="asked_questions.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Cadastro de Dúvidas Frequentes</h3>
            </v-card-title>
            <v-btn flat fab color="primary" style="position:absolute; right:0; top:0" @click="asked_questions.new = false">
              <v-icon>close</v-icon>
            </v-btn>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-textarea
                    label="Pergunta"
                    v-model="asked_questions.form.question"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                  label="Resposta"
                  v-model="asked_questions.form.answer"
                ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveAskedQuestions" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md12>
          <v-card>

            <v-list>
              <v-list-group
                v-for="item in asked_questions.items"
                :key="item.title"
                v-model="item.active"
                :prepend-icon="item.action"
                no-action
              >
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>

                <v-list-tile
                  v-for="subItem in item.items"
                  :key="subItem.title"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-icon>{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="asked_questions.new = true">
      <v-icon>add</v-icon>
    </v-btn>
    <v-snackbar v-model="snackbar" bottom>
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
    asked_questions:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Pergunta", value: "question" },
        { text: "Data", value: "created_at" },
        { text: "Ações", sortable: false }
      ],
      list:[],
      search:'',
      items: [],
      new:false,
      form:{
        question:'',
        answer:''
      },
      loading:true
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
    saveAskedQuestions(){
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/asked-questions",this.asked_questions.form)
        .then(response => {
          this.snackbarText = "Salvo com sucesso!"
          this.snackbar = true
          this.clearForm(this.asked_questions.form)
          this.getAskedQuestions()
        })
    }
  },

  created() {
    this.getRole()
    this.getAskedQuestions()
  }
}
</script>
