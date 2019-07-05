<template>
  <div class="membros">
    <h1 class="subheading grey--text mx-4">Membros</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Membros</h3>
              <v-btn class="ml-auto" color="primary" dark @click="showMember">
                <v-icon>add</v-icon> NOVO MEMBRO
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="member.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="member.headers" :items="member.list" :search="member.search" :loading="member.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>
                        <v-btn small fab flat @click="editMember(props.item)">
                          <v-icon> 
                            edit
                          </v-icon>
                        </v-btn>
                        <v-icon v-if="props.item.cpm_a || props.item.cpm_b" small color="primary">
                          star
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
        <v-flex md6 v-show="member.new" ref="memberForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Cadastro de Membros</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="member.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="member"
                v-model="member.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field
                      label="Nome"
                      v-model="member.form.name"
                      :rules="[v => !!v || 'Nome é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="E-mail"
                      v-model="member.form.email"
                      :rules="[
                        v => !!v || 'E-mail is obrigatório',
                        v => /.+@.+/.test(v) || 'E-mail inválido'
                      ]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                    label="Senha"
                    v-model="member.form.password"
                    :rules="[v => !!v || 'Senha é obrigatório']"
                  ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="member.btnLoading" :disabled="!member.valid" @click="saveMember" depressed color="primary">Gravar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="member.edit.new" ref="memberEditForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Edição de Membros ID:{{member.edit.form.id}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="member.edit.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="memberEdit"
                v-model="member.edit.valid"
                lazy-validation
              >
                <v-layout row wrap>
                  <v-flex md4>
                   <v-checkbox
                      v-model="member.edit.form.role.adm"
                      label="Administrador"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex md4>
                   <v-checkbox
                      v-model="member.edit.form.role.pub"
                      label="Publisher"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex md4>
                   <v-checkbox
                      v-model="member.edit.form.role.red"
                      label="Redator"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Novo Nome"
                      v-model="member.edit.form.name"
                      :rules="[v => !!v || 'Nome é obrigatório']"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="WhatsApp"
                      v-model="member.edit.form.phone"
                      mask="(##) #####-####"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Novo E-mail"
                      v-model="member.edit.form.email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Nova Senha"
                      v-model="member.edit.form.password"
                    ></v-text-field>
                   </v-flex>
                  <v-flex xs12>
                    <v-checkbox
                      v-model="member.edit.form.accepted"
                      label="Aprovado"
                      required
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12>
                    <v-checkbox
                      v-model="member.edit.form.active"
                      label="Ativo"
                      required
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12>
                    <v-checkbox
                      v-model="member.edit.star"
                      label="Estrela"
                      required
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 v-if="member.edit.star">
                    <v-text-field
                      label="CPM Publisher"
                      v-model="member.edit.form.cpm_a"
                      mask="######"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 v-if="member.edit.star">
                    <v-text-field
                      label="CPM Redator"
                      v-model="member.edit.form.cpm_b"
                      mask="######"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="member.edit.btnLoading" :disabled="!member.edit.valid" @click="updateMember" depressed color="primary">Alterar</v-btn>
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
    snackbarText: '',
    member:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      edit:{
        form:{
          id:'',
          name:'',
          email:'',
          password:'',
          accepted:'',
          active:'',
          phone:'',
          role:{
            adm:false,
            pub:false,
            red:false
          }
        },
        valid:true,
        new:false,
        star:false,
        btnLoading:false
      },
      list:[],
      loading:true,
      btnLoading:false,
      new:false,
      valid:true,
      username:'',
      form:{
        name:'',
        email:'',
        password:'',
        wp_user:'',
        wp_login:'',
        wp_password:''
      }
    },
  }),
  methods:{
    getMembers(){
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/user")
        .then(response => {
          this.member.list = response.data
          this.member.loading = false
        }).catch(function (error) {
          this.snackbarText = "Erro ao consultar!"
          this.snackbar = true
        })
    },
    showMember(){
      this.member.new = true
      setTimeout(() => {
        this.$refs.memberForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    saveMember(){
      if (this.$refs.member.validate()) {
        this.member.valid = false
        this.member.btnLoading = true
        this.member.username = Math.random().toString(36).substr(2, 20)
        axios
        .post(process.env.VUE_APP_WP_URL + "wp-json/wp/v2/users",{
            username:this.member.username,
            name:this.member.form.name,
            email:this.member.form.email,
            password:this.member.form.password,
            roles:[ "contributor" ]
          },
          {
          headers: {
            'Authorization': "Basic " + btoa(process.env.VUE_APP_WP_ADMIN)
          }
        }).then(response => {
          this.member.form.wp_user = response.data.id
          this.member.form.wp_login = this.member.username
          this.member.form.wp_password = this.member.form.password
          this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/user",this.member.form)
            .then(response => {
              this.snackbarText = "Salvo com sucesso!"
              this.snackbar = true
              this.$refs.member.reset()
              
              this.getMembers()
              this.member.new = false
            }).catch((error) => {
              this.snackbarText = "Erro ao gravar!"
              this.snackbar = true   
            })
        }).catch((error) => {
          this.snackbarText = "Email já existe!"
          this.snackbar = true   
        }).finally(() => {
          this.member.valid = true
          this.member.btnLoading = false
        })
      }
    },
    editMember(member){
      setTimeout(() => {
        this.$refs.memberEditForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
      this.member.edit.form.id = member.id
      this.member.edit.form.name = member.name
      this.member.edit.form.phone = member.phone
      this.member.edit.form.accepted = (member.accepted == '0') ?  false : true
      this.member.edit.form.active = (member.active == '0') ? false : true
      this.member.edit.form.cpm_a = member.cpm_a
      this.member.edit.form.cpm_b = member.cpm_b
      this.member.edit.form.role.adm = false
      this.member.edit.form.role.pub = false
      this.member.edit.form.role.red = false
      for(var i in member.role){
        if(member.role[i].role == 'Administrador'){
          this.member.edit.form.role.adm = true
        }
        if(member.role[i].role == 'Publisher'){
          this.member.edit.form.role.pub = true
        }
        if(member.role[i].role == 'Redator'){
          this.member.edit.form.role.red = true
        }
      }
      if(this.member.edit.form.cpm_a != '0' || this.member.edit.form.cpm_b != '0'){
        this.member.edit.star = true
      }else{
        this.member.edit.star = false
      }
      this.member.edit.new = true
    },
    updateMember(){
      if (this.$refs.memberEdit.validate()) {
        this.member.edit.valid = false
        this.member.edit.btnLoading = true
        if(!this.member.edit.star){
          this.member.edit.form.cpm_a = '0'
          this.member.edit.form.cpm_b = '0'
        }
        this.$axiosAPI
          .put(process.env.VUE_APP_API_URL+"/user",this.member.edit.form)
          .then(response => {
            this.snackbarText = "Alterado com sucesso!"
            this.snackbar = true
            this.$refs.memberEdit.reset()
            this.getMembers()
            this.member.edit.new = false
          }).catch((error) => {
            this.snackbarText = "Erro ao gravar!"
            this.snackbar = true   
          }).finally(() => {
            this.member.edit.valid = true
            this.member.edit.btnLoading = false
          })
      }
    }
  },
  created() {
    this.getRole()
    this.getMembers()
  }
}
</script>
