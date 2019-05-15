<template>
  <div class="financeiro">
    <h1 class="subheading grey--text mx-4">Financeiro</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Lista de Saque</h3>
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
                      <td>R${{ props.item.amount }}</td>
                      <td>
                        <v-btn class="mx-0" small fab flat @click="showTransaction(props.item)">
                          <v-icon> 
                            search
                          </v-icon>
                        </v-btn>
                        <v-btn class="mx-0" small fab flat @click="aproveTransaction(props.item.id)">
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
        <v-flex md6 v-show="financial.new">
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
                    mask="##########"
                    :rules="[v => !!v || 'Obs é obrigatório']"
                    v-model="financial.form.amount"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!financial.valid" @click="saveFinancial" depressed color="primary">Solicitar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6 v-show="financial.newAdm">
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
                  <v-textarea
                    label="Obs"
                    :rules="[v => !!v || 'Obs é obrigatório']"
                    v-model="financial.form.obs"
                  ></v-textarea>
                </v-flex>
              </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!financial.validAdm" @click="saveTransaction()" depressed color="primary">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="primary" dark fixed bottom right fab @click="financial.new = true">
      <v-icon>add</v-icon>
    </v-btn>
    <v-snackbar v-model="snackbar" bottom :timeout=1500>
      {{ snackbarText }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          
          <v-toolbar-title>Detalhes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-list-tile avatar>  
            <v-list-tile-action class="headline mr-3">
              ID
            </v-list-tile-action>
            <v-list-tile-content>
             {{financial.show.id}}
            </v-list-tile-content> 
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile avatar>  
            <v-list-tile-action class="headline mr-3">
              Estado
            </v-list-tile-action>
            <v-list-tile-content>
             {{financial.show.title}}
            </v-list-tile-content> 
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile avatar>  
            <v-list-tile-action class="headline mr-3">
              Valor
            </v-list-tile-action>
            <v-list-tile-content>
             R${{financial.show.amount}}
            </v-list-tile-content> 
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile avatar>  
            <v-list-tile-action class="headline mr-3">
              Obs
            </v-list-tile-action>
            <v-list-tile-content>
             {{financial.show.obs}}
            </v-list-tile-content> 
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile avatar>  
            <v-list-tile-action class="headline mr-3">
              Recibo
            </v-list-tile-action>
            <v-list-tile-content>
              <v-btn target="_blank" :href="financial.show.link" depressed>Baixar</v-btn>
            </v-list-tile-content> 
          </v-list-tile>
        </v-list>
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
    dialog: false,
    financial:{
      headers: [
        { text: "ID", value: "id" },
        { text: "Título", value: "question" },
        { text: "Valor", value: "amount" },
        { text: "Ações", sortable: false }
      ],
      show:{
        id:'',
        obs:'',
        amount:'',
        title:'',
        link:''
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
      loading:true
    }
  }),
  methods: {
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
        this.financial.form.title = "Saque Solicitado";
        this.financial.form.user_id = this.jwt_decode.sub
        this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/financial",this.financial.form)
          .then(response => {
            this.snackbarText = "Salvo com sucesso!"
            this.snackbar = true
            this.$refs.financialNew.reset()
            this.getFinancial()
            this.financial.new = false
          })
      }
    },
    aproveTransaction(id){
      this.financial.newAdm = true
      this.financial.form.financial_id = id
    },
    showTransaction(transaction){
      this.dialog = true
      this.financial.show.id = transaction.id
      this.financial.show.link = process.env.VUE_APP_API_URL+"/receipts/"+transaction.receipt
      this.financial.show.title = transaction.title
      this.financial.show.amount = transaction.amount
      this.financial.show.obs = transaction.obs
    },
    saveTransaction(){
      if (this.$refs.financial.validate()) {
        if(this.financial.aproved == '1'){
          this.financial.form.title = "Saque Aprovado";
        }else{
          this.financial.form.title = "Saque Não Aprovado";
        }
        var formData =  new FormData()   
        formData.append('title',this.financial.form.title);
        formData.append('receipt',this.financial.form.receipt);
        formData.append('obs',this.financial.form.obs);
        this.$axiosAPI({
          method: 'post',
          url: process.env.VUE_APP_API_URL+"/financial/"+this.financial.form.financial_id,
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
        })
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
    this.getFinancial()
  }
}
</script>