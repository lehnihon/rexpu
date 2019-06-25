<template>
  <div class="fincial">
    <h1 class="subheading grey--text mx-4">Financeiro</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Saque</h3>
              <v-btn class="ml-auto" color="primary" dark @click="showFinancial">
                <v-icon>add</v-icon> NOVO SAQUE
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="financial.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="financial.headers" :items="financial.list" :search="financial.search" :loading="financial.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.user.name }}</td>
                      <td>{{ formatMoney(props.item.amount) }}</td>
                      <td>{{ formatDate(props.item.created_at) }}</td>
                      <td>
                        <v-btn class="mx-0" small fab flat @click="showTransaction(props.item)">
                          <v-icon> 
                            search
                          </v-icon>
                        </v-btn>
                        <v-btn v-if="role.list.includes(1) && !props.item.done" class="mx-0" small fab flat @click="aproveTransaction(props.item.id)">
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
        <v-flex md6 v-show="financial.new" ref="financialForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Solicitar Saque</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="financial.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="financialNew"
                v-model="financial.valid"
                lazy-validation
              >
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Valor"
                    prefix="R$"
                    v-money="money"
                    :rules="[v => !!v || 'Valor é obrigatório']"
                    v-model.lazy="financial.form.amount"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="financial.btnLoading" :disabled="!financial.valid" @click="saveFinancial" depressed color="primary">Solicitar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="financial.newAdm" ref="financialAdmForm">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Aprovar Saque ID:{{financial.form.financial_id}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="financial.newAdm = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form
                ref="financial"
                v-model="financial.validAdm"
                lazy-validation
              >
              <v-layout row wrap>
                <v-flex xs12>
                  <v-radio-group :rules="[v => !!v || 'Tipo é obrigatório']" v-model="financial.aproved" row>
                    <v-radio label="Sim" value="1"></v-radio>
                    <v-radio label="Não" value="0"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Comprovante" @click='pickFile' v-model='financial.imageName' prepend-icon='attach_file'></v-text-field>
                  <input
                    type="file"
                    style="display: none"
                    ref="image"
                    accept="image/*"
                    @change="onFilePicked"
                  >
                </v-flex>
                <v-flex xs12>
                  <vue-editor 
                    v-model="financial.form.obs"
                    :editorToolbar="customToolbar"
                    placeholder="Observações"
                    ></vue-editor>
                </v-flex>
              </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="financial.btnAdmLoading" :disabled="!financial.validAdm" @click="saveTransaction()" depressed color="primary">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    
    <v-snackbar v-model="snackbar" bottom :timeout=2500>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    
    <v-dialog v-model="dialog" width="500">
      <v-card class="py-3 px-3">
        <v-layout row wrap>
          <v-flex xs12 class="mb-2"><strong>ID: </strong> {{financial.show.id}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>USUÁRIO: </strong>  {{financial.show.user.name}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>FAVORECIDO: </strong>  {{financial.show.user.favored}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user.bank"><strong>BANCO: </strong>  {{financial.show.user.bank.name}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>TIPO: </strong>  {{financial.show.user.type}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>AGÊNCIA: </strong>  {{financial.show.user.agency}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>CONTA: </strong>  {{financial.show.user.account}}</v-flex>
          <v-flex xs12 class="mb-2" v-if="financial.show.user"><strong>CPF: </strong>  {{financial.show.user.cpf}}</v-flex>
          <v-flex xs12 class="mb-2"><strong>STATUS: </strong>  {{financial.show.title}}</v-flex>
          <v-flex xs12 class="mb-2"><strong>VALOR: </strong>{{formatMoney(financial.show.amount)}}</v-flex>
          <v-flex xs12 class="mb-2" v-html="financial.show.obs"></v-flex>
          <v-flex xs12 class="mb-2"><strong>RECIBO: </strong> <v-btn v-if="financial.show.link" target="_blank" :href="financial.show.link" depressed>VER</v-btn> </v-flex>
        </v-layout>
    
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import mixin from "../mixin";
import { VueEditor } from "vue2-editor";
import {VMoney} from 'v-money'
export default {
  components: {VueEditor},
  mixins: [mixin],
  data: () => ({
    snackbar: false,
    snackbarText: "",
    dialog: false,
    customToolbar:[
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
    financial:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Título", value: "title" },
        { text: "Usuário", value: "user.name" },
        { text: "Valor", value: "amount" },
        { text: "Data", value: "created_at" },
        { text: "Ações", sortable: false }
      ],
      show:{
        id:'',
        obs:'',
        amount:'',
        title:'',
        link:'',
        user:{
          bank:{
            name:''
          }
        }
      },
      list:[],
      search:'',
      new:false,
      newAdm:false,
      imageName: '',
      imageUrl: '',
      aproved:'',
      validAdm:true,
      valid:true,
      form:{
        financial_id:'',
        title:'',
        amount:'',
        done:false,
        receipt:'',
        obs:'',
        user_id:''
      },
      loading:true,
      btnLoading:false,
      btAdmLoading:false
    },
    money: {
      decimal: ',',
      precision: 2
    }
  }),
  directives: {money: VMoney},
  methods: {
    formatMoney(money){
      return "R$"+money.toString().replace(".",",")
    },
    formatDate(dt) {
      if(dt == null){
        return '';
      }
      var bits = dt.split(/\D/);
      var date = new Date(bits[0], bits[1], bits[2], bits[3], bits[4]);
      return date.getDate() + '/' + date.getMonth() + '/' +  date.getFullYear();
    },
    getFinancialAdmin() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/financial")
        .then(response => {
          this.financial.list = response.data
          this.financial.loading = false;
        });
    },
    getFinancial() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/financial/user/"+this.jwt_decode.sub)
        .then(response => {
          this.financial.list = response.data
          this.financial.loading = false;
        });
    },
    saveFinancial(){
      if (this.$refs.financialNew.validate()) {
        this.financial.valid = false
        this.financial.btnLoading = true
        this.financial.form.title = "Saque Solicitado";
        this.financial.form.user_id = this.jwt_decode.sub
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/financial",this.financial.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
            this.$refs.financialNew.reset()
            this.financial.form.obs = ''
            this.getFinancial()
            this.financial.new = false
          }).catch((error) => {
            if(error.response){
              this.snackbarText = error.response.data.error
              this.snackbar = true
            }else{
              this.snackbarText = "Erro ao consultar!"
              this.snackbar = true
            }
          }).finally(() => {
            this.financial.valid = true
            this.financial.btnLoading = false
          })
      }
    },
    aproveTransaction(id){
      this.financial.newAdm = true
      setTimeout(() => {
        this.$refs.financialAdmForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
      this.financial.form.financial_id = id
    },
    showFinancial(){
      this.financial.new = true
      setTimeout(() => {
        this.$refs.financialForm.scrollIntoView({block:"end",behavior:"smooth"})
      }, 250);
    },
    showTransaction(transaction){
      this.dialog = true
      this.financial.show = transaction
      if(transaction.receipt != ''){
        this.financial.show.link = process.env.VUE_APP_API_URL+"/receipts/"+transaction.receipt
      }
      console.log(this.financial.show)
    },
    saveTransaction(){
      if (this.$refs.financial.validate()) {
        var formData =  new FormData()   
        formData.append('receipt',this.financial.form.receipt);
        formData.append('obs',this.financial.form.obs);

        if(this.financial.aproved == '1'){
          this.financial.validAdm = false
          this.financial.btnAdmLoading = true
          this.financial.form.title = "Saque Aprovado";
          formData.append('title',this.financial.form.title);
          this.$axiosAPI({
            method: 'post',
            url: process.env.VUE_APP_API_URL+"/financial/aproved/"+this.financial.form.financial_id,
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(response => {
            this.snackbarText = "Aprovado!"
            this.snackbar = true
            this.getFinancial()
            this.$refs.financial.reset()
            this.financial.newAdm = false
          }).catch(error => {
            if(error.response){
              this.snackbarText = error.response.data.error
              this.snackbar = true
            }else{
              this.snackbarText = "Erro ao consultar!"
              this.snackbar = true
            }
          }).finally(() => {
            this.financial.validAdm = true
            this.financial.btnAdmLoading = false
          })
        }else{
          this.financial.validAdm = false
          this.financial.btnAdmLoading = true
          this.financial.form.title = "Saque Não Aprovado";
          formData.append('title',this.financial.form.title);
          this.$axiosAPI({
            method: 'post',
            url: process.env.VUE_APP_API_URL+"/financial/naproved/"+this.financial.form.financial_id,
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(response => {
            this.snackbarText = "Aprovado!"
            this.snackbar = true
            this.getFinancial()
            this.$refs.financial.reset()
            this.financial.newAdm = false
          }).catch(error => {
            if(error.response){
              this.snackbarText = error.response.data.error
              this.snackbar = true
            }else{
              this.snackbarText = "Erro ao consultar!"
              this.snackbar = true
            }
          }).finally(() => {
            this.financial.validAdm = true
            this.financial.btnAdmLoading = false
          })
        }
      }
    },
    pickFile() {
      this.$refs.image.click()
    },
		
		onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.financial.imageName = files[0].name
				if(this.financial.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.financial.imageUrl = fr.result
          this.financial.form.receipt = files[0] 
        })
			} else {
				this.financial.imageName = ''
				this.financial.form.receipt = ''
				this.financial.imageUrl = ''
			}
		}
  },

  created() {
    this.getRole()
    if(this.role.list.includes(1)){
      this.getFinancialAdmin()
    }else{
      this.getFinancial()
    }
  }
}
</script>