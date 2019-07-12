<template>
  <div class="painel">
    <h1 class="subheading grey--text mx-4">Painel</h1>
    <v-container grid-list-md>
      <v-layout v-if="(role.list.includes(2) || role.list.includes(3))" row wrap>
        <v-flex>
          <v-card height="100%" color="primary" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="user">R${{formatPrice(user.amount)}}</div>
                <span>SALDO</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex v-if="role.list.includes(2)">
          <v-card height="100%" color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{formatPrice(cpm.list.publisher.amount)}}</div>
                <span>CPM PUBLISHER</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex v-if="role.list.includes(3)">
          <v-card height="100%" color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{formatPrice(cpm.list.redator.amount)}}</div>
                <span>CPM REDATOR</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex>
          <v-card height="100%" color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{this.config.perc_member}}%</div>
                <span>INDICAÇÃO</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex v-if="role.list.includes(2)">
          <v-card height="100%" color="success" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">{{clicks_publisher}}</div>
                <span>CLICKS PUBLISHER</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex v-if="role.list.includes(3)">
          <v-card height="100%" color="success" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">{{clicks_redator}}</div>
                <span>CLICKS REDATOR</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex v-if="role.list.includes(2)">
          <v-card height="100%" color="success" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{formatPrice(value_publisher)}}</div>
                <span>GANHO PUBLISHER</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex v-if="role.list.includes(3)">
          <v-card height="100%" color="success" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline" v-if="cpm.list.publisher">R${{formatPrice(value_redator)}}</div>
                <span>GANHO REDATOR</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-if="(role.list.includes(2) || role.list.includes(3))" row wrap>
        <v-flex>
          <v-card height="100%" color="primary" class="white--text">
            <v-card-title primary-title>
              <div>
                <div v-if="user && config">{{indication_link+"/"+user.indication_hash}}</div>
                <span>LINK CONVITE</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout  row wrap v-if="(role.list.includes(1))">
        <v-flex xs v-if="memberAproved.new">
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Aprovar Membros</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="memberAproved.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="memberAproved.headers" :items="memberAproved.list" :search="memberAproved.search" :loading="memberAproved.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>
                        <v-btn small fab flat @click="dialog = true;memberAproved.currentId = props.item.id">
                          <v-icon> 
                            check_circle
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
        <v-flex xs>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Visitas de hoje</h3>
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
                      <td>R${{ props.item.clickspub }}</td>
                      <td>R${{ props.item.clicksred }}</td>
                      <td>{{ props.item.clickpub }}</td>
                      <td>{{ props.item.clickred }}</td>  
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
    <v-snackbar v-model="snackbar" bottom :timeout=1000>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Fechar</v-btn>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline justify-center">Aprovar Usuário?</v-card-title>

        <v-card-actions class="justify-center">

          <v-btn
            color="primary"
            flat="flat"
            @click="aproveMember(memberAproved.currentId)"
          >
            Sim
          </v-btn>

          <v-btn
            color="primary"
            flat="flat"
            @click="disapproveMember(memberAproved.currentId)"
          >
            Não
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    dialog:false,
    indication_link:null,
    cpm:{
      list:[],
      loading:true
    },
    config:{
      perc_member:'',
      loading:true
    },
    memberAproved:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        { text: 'Ações', sortable: false }
      ],
      loading:true,
      currentId:'',
      new:false,
      form:{
        name:'',
        email:'',
        password:''
      }
    },
    member:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        {text: 'Ganho P.', value:'clickspub' },
        {text: 'Ganho R.', value:'clicksred' },
        {text: 'Visitas P.', value:'clickpub' },
        {text: 'Visitas R.', value:'clickred' }
      ],
      list:[],
      loading:true,
      new:false,
      valid:true,
      form:{
        name:'',
        email:'',
        password:''
      },
    },
    user:{
      amount:0
    },
    clicks_publisher:0,
    value_publisher:0,
    clicks_redator:0,
    value_redator:0,
  }),
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    getCPM() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/cpm/dashboard")
        .then(response => {
          this.cpm.list = response.data
          this.cpm.loading = false;
        });
    },
    getConfigurations(){
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/general-config")
        .then(response => {
          this.config = response.data
          this.config.loading = false
        }).catch((error) => {
          
        })
    },
    getMembersAccepted(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/accepted")
          .then(response => {
            if(response.data.length){
              this.memberAproved.new = true
            }else{
              this.memberAproved.new = false
            }
            this.memberAproved.list = response.data
            this.memberAproved.loading = false
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    getMembersClicks(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/clicks/user")
          .then(response => {
            this.sumClicks(response.data)
            this.member.loading = false
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    sumClicks(data){
      let sumlist = []
      for(let i = 0; i < data.length; i++){
        sumlist[i] = data[i]
        let clicksRed = 0;
        let clicksPub = 0;
        let saldoRed = 0;
        let saldoPub = 0;
        for (let click of data[i].clicks) {
          if(click.role_id == 2){
           clicksPub++
           saldoPub += click.value
          }
          if(click.role_id == 3){
           clicksRed++
           saldoRed += click.value
          }
          
        }
        sumlist[i]['clickpub'] = clicksPub
        sumlist[i]['clickred'] = clicksRed
        sumlist[i]['clickspub'] = saldoPub
        sumlist[i]['clicksred'] = saldoRed
      }
      this.member.list = sumlist
    },
    getUser(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user/full/"+this.jwt_decode.sub)
          .then(response => {
            this.user = response.data.user
            this.indication_link = window.location.origin+"/#/cadastro-indicacoes"
            this.clicks_publisher = response.data.clicks_publisher
            this.value_publisher = response.data.value_publisher
            this.clicks_redator = response.data.clicks_redator
            this.value_redator = response.data.value_redator
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    aproveMember(id){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/user/accepted/"+id)
          .then(response => {
            this.getMembersAccepted()
            this.snackbarText = "Aprovado!"
            this.snackbar = true
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
      this.dialog = false
    },
    disapproveMember(id){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/user/naccepted/"+id)
          .then(response => {
            this.getMembersAccepted()
            this.snackbarText = "Não Aprovado!"
            this.snackbar = true
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
      this.dialog = false
    }
    
  },

  created() {
    this.getRole()
    if(this.role.list.includes(1)){
      this.getMembersClicks()
      this.getMembersAccepted()
    }
    this.getCPM()
    this.getConfigurations()
    this.getUser()
  }
}
</script>
