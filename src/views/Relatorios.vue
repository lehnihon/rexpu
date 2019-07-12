<template>
  <div class="reports">
    <h1 class="subheading grey--text mx-4">Relatórios</h1>
    <v-container grid-list-md> 
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="100%">
            <v-card-title primary-title>
              <h3 class="headline mb-0">Opções</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs v-if="this.role.list.includes(1)">
                  <v-select
                    v-model="option"
                    :rules="[v => !!v || 'Tipo é obrigatório']"
                    :items="options" 
                    item-text="text" 
                    item-value="id"
                    label="Tipo"
                  ></v-select>
                </v-flex>
                <v-flex xs v-else>
                  <v-select
                    v-model="option"
                    :rules="[v => !!v || 'Tipo é obrigatório']"
                    :items="optionsb" 
                    item-text="text" 
                    item-value="id"
                    label="Tipo"
                  ></v-select>
                </v-flex>
                <v-flex xs v-if="option == 2 || option == 3 || option == 4 || option == 10">
                  <v-menu
                    ref="dt1"
                    v-model="dt1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFormatted1"
                        label="Data Início"
                        persistent-hint
                        prepend-icon="event"
                        @blur="date1 = parseDate(dateFormatted1)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" no-title @input="dt1 = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs v-if="option == 2 || option == 3 || option == 4 || option == 10">
                  <v-menu
                    ref="dt2"
                    v-model="dt2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFormatted2"
                        label="Data Final"
                        persistent-hint
                        prepend-icon="event"
                        @blur="date2 = parseDate(dateFormatted2)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" no-title @input="dt2 = false"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-btn  @click="generateRel" depressed color="primary">Gerar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- RELATORIO 1 -->

        <v-flex xs12 v-show="report.new" ref="reportForm" v-if="option == 1">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="report.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="report.headers" :items="report.list" :search="report.search" :loading="report.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>R${{ props.item.amount }}</td>
                      <td>{{ props.item.clicks_a }}</td>
                      <td>{{ props.item.clicks_b }}</td>
                      <td>{{ props.item.indication }}</td>
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td></td>
                      <td>R${{report.totalBalance}}</td>
                      <td>{{report.totalClicksA}}</td>
                      <td>{{report.totalClicksB}}</td>
                      <td>{{report.totalIndication}}</td>
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
            <v-card-actions>
              <download-excel
                :data   = "report.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- RELATORIO 2 -->

        <v-flex xs12 v-show="report.new" ref="reportFormC" v-if="option == 2">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="reportc.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="reportc.headers" :items="reportc.list" :search="reportc.search" :loading="reportc.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td>R${{ props.item.clickspub }}</td>
                      <td>R${{ props.item.clicksred }}</td>
                      <td>{{ props.item.clickpub }}</td>
                      <td>{{ props.item.clickred }}</td>  
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td></td>
                      <td>{{reportc.totalGanhoP}}</td>
                      <td>{{reportc.totalGanhoR}}</td>
                      <td>{{reportc.totalClicksP}}</td>
                      <td>{{reportc.totalClicksR}}</td>
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
            <v-card-actions>
              <download-excel
                :data   = "reportc.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- RELATORIO 3 -->

        <v-flex xs12 v-show="report.new" ref="reportFormD" v-if="option == 3">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="reportd.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="reportd.headers" :items="reportd.list" :search="reportd.search" :loading="reportd.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>R${{ props.item.value }}</td>
                      <td>{{ props.item.user.name }}</td>
                      <td>{{ formatDateTime(props.item.created_at) }}</td>
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td>R${{reportd.total}}</td>
                      <td></td>
                      <td></td>
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
            <v-card-actions>
              <download-excel
                :data   = "reportd.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>


        <!-- RELATORIO 4 -->

        <v-flex xs12 v-show="report.new" ref="reportFormE" v-if="option == 4">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="reporte.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="reporte.headers" :items="reporte.list" :search="reporte.search" :loading="reporte.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.partner.name }}</td>
                      <td>R${{ props.item.value }}</td>
                      <td>{{ formatDate(props.item.date_earning) }}</td>
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td>R${{reporte.total}}</td>
                      <td></td>
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
            <v-card-actions>
              <download-excel
                :data   = "reporte.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- RELATORIO 10 -->

        <v-flex xs12 v-show="report.new" ref="reportFormB" v-if="option == 10">
          <v-card height="100%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Relatório</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="report.new = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="reportb.search"
                    append-icon="search"
                    label="Procurar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-data-table disable-initial-sort :headers="reportb.headers" :items="reportb.list" :search="reportb.search" :loading="reportb.loading">
                    <template v-slot:items="props">
                      <td>{{ props.item.id }}</td>
                      <td>{{ props.item.title }}</td>
                      <td>{{ props.item.link }}</td>
                      <td>{{ props.item.clicks_count }}</td>
                      <td>{{ formatDateTime(props.item.created_at) }}</td>
                    </template>
                    <template v-slot:footer>
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td></td>
                      <td>{{reportb.totalClicks}}</td>
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
            <v-card-actions>
              <download-excel
                :data   = "reportb.list"
                
                class = "v-btn v-btn--depressed theme--light primary">
                Baixar Relatório
              </download-excel>
            </v-card-actions>
          </v-card>
        </v-flex>

      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" bottom :timeout=1500>
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
  data: (vm) => ({
    json_data: [
        { colA: "Hello", colB: "World" },
        {
          colA: "Multi-line",
          colB:
            "This is a long paragraph\nwith multiple lines\nthat should show in a single cell."
        },
        { colA: "Another", colB: "Regular cell" }
      ],
    snackbar: false,
    snackbarText: "",
    option:null,
    options:[
      {id:1,text:'Total Gerado na Plataforma'},
      {id:2,text:'Rendimento por Usuário'},
      {id:3,text:'Financeiro'},
      {id:4,text:'Ganhos'}
    ],
    optionsb:[
      {id:10,text:'Rendimento por Usuário'}
    ],
    report:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        {text: 'Saldo', value:'amount' },
        {text: 'Clicks P.', value:'clicks_a' },
        {text: 'Clicks R.', value:'clicks_b' },
        {text: 'Indicados', value:'indication' },
      ],
      totalBalance:0,
      totalClicksA:0,
      totalClicksB:0,
      totalIndication:0,
      new:false,
      list:[],
      loading:true,
      search:''
    },
    reportb:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Título',value:'title'},
        {text:'Link', sortable: false },
        {text: 'Clicks', value:'clicks_count' },
        {text:'Data Matéria' },
      ],
      totalClicks:0,
      new:false,
      list:[],
      loading:true,
      search:''
    },
    reportc:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Nome',value:'name'},
        {text:'E-mail',value:'email'},
        {text: 'Ganho P.', value:'clickspub' },
        {text: 'Ganho R.', value:'clicksred' },
        {text: 'Visitas P.', value:'clickpub' },
        {text: 'Visitas R.', value:'clickred' }
      ],
      totalClicks:0,
      new:false,
      list:[],
      loading:true,
      search:'',
      totalClicksP:0,
      totalClicksR:0,
      totalGanhoP:0,
      totalGanhoR:0
    },
    reportd:{
      headers:[
        {text:'ID',value:'id'},
        {text:'Título',value:'title'},
        {text:'Valor', value:'value' },
        {text: 'Usuário', value:'user.name' },
        {text: 'Data', value:'created_at' }
      ],
      new:false,
      list:[],
      loading:true,
      search:'',
      total:0
    },
    reporte:{
      headers:[
        { text: "ID", value: "id" },
        { text: "Parceiro", value: "partner.name" },
        { text: "Ganho", value: "value" },
        { text: "Data", value: "date_earning" }
      ],
      new:false,
      list:[],
      loading:true,
      search:'',
      total:0
    },
    date1: new Date().toISOString().substr(0, 10),
    dateFormatted1: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dt1: false,
    date2: new Date().toISOString().substr(0, 10),
    dateFormatted2: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dt2: false
  }),
  methods: {
    formatDateTime(dt) {
      if(dt == null){
        return '';
      }
      var bits = dt.split(/\D/);
      var date = new Date(bits[0], bits[1], bits[2], bits[3], bits[4]);
      return date.getDate() + '/' + date.getMonth() + '/' +  date.getFullYear();
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [day, month , year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    generateRel(){
      this.report.new = true
      if(this.option == 1){
        this.getMembers();
      }
      if(this.option == 2 ){
        this.getMembersClicks()
      }
      if(this.option == 3 ){
        this.getTransactions()
      }
      if(this.option == 4 ){
        this.getEarning()
      } 
      if(this.option == 10){
        this.getSubjectByUser();
      }
    },
    getEarning() {
      this.$axiosAPI
        .post(process.env.VUE_APP_API_URL+"/earning/report",{
          from:this.date1,
          to:this.date2
        })
        .then(response => {
          this.reporte.list = response.data
          this.generateTotalsE(response.data)
          this.reporte.loading = false;
        });
    },
    getMembers(){
      this.$axiosAPI
          .get(process.env.VUE_APP_API_URL+"/user")
          .then(response => {
            this.report.list = response.data
            this.generateTotals(response.data)
            this.report.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    getMembersClicks(){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/clicks/user",
            {
              from:this.date1,
              to:this.date2
            }
          )
          .then(response => {
            this.sumClicks(response.data)
            this.reportc.loading = false
          }).catch((error) => {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    sumClicks(data){
      let sumlist = []
      this.reportc.totalClicksP = 0
      this.reportc.totalClicksR = 0
      this.reportc.totalGanhoP = 0
      this.reportc.totalGanhoR = 0
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
        this.reportc.totalClicksP += clicksPub
        this.reportc.totalClicksR += clicksRed
        this.reportc.totalGanhoP += saldoPub
        this.reportc.totalGanhoR += saldoRed
        sumlist[i]['clickpub'] = clicksPub
        sumlist[i]['clickred'] = clicksRed
        sumlist[i]['clickspub'] = saldoPub
        sumlist[i]['clicksred'] = saldoRed
      }
      this.reportc.list = sumlist
    },
    getSubjectByUser(){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/subject/report",{
            user:this.jwt_decode.sub,
            from:this.date1,
            to:this.date2
          })
          .then(response => {
            this.reportb.list = response.data
            this.generateTotalsB(response.data)
            this.reportb.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    getTransactions(){
      this.$axiosAPI
          .post(process.env.VUE_APP_API_URL+"/transaction",{
            from:this.date1,
            to:this.date2
          })
          .then(response => {
            this.reportd.list = response.data
            this.generateTotalsC(response.data)
            this.reportd.loading = false
          }).catch(function (error) {
            this.snackbarText = "Erro ao consultar!"
            this.snackbar = true
          })
    },
    generateTotals(list){
      this.report.totalBalance = 0;
      this.report.totalClicksA = 0;
      this.report.totalClicksB = 0;
      this.report.totalIndication = 0;
      for (let val of list) {
        this.report.totalBalance += val.amount
        this.report.totalClicksA += val.clicks_a
        this.report.totalClicksB += val.clicks_b
        this.report.totalIndication += val.indication
      }
    },
    generateTotalsB(list){
      this.reportb.totalClicks = 0;
      for (let val of list) {
        this.reportb.totalClicks += val.clicks_count
      }
    },
    generateTotalsC(list){
      this.reportd.total = 0;
      for (let val of list) {
        this.reportd.total += val.value
      }
    },
    generateTotalsE(list){
      this.reporte.total = 0;
      for (let val of list) {
        this.reporte.total += val.value
      }
    },
  },
  watch: {
    date1 (val) {
      this.dateFormatted1 = this.formatDate(this.date1)
    },
    date2 (val) {
      this.dateFormatted2 = this.formatDate(this.date2)
    }
  },
  created() {
    this.getRole()
  }
}
</script>
