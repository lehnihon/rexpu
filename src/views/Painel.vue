<template>
  <div class="painel">
    <h1 class="subheading grey--text mx-4">Painel</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">R${{cpm.list.publisher.amount}}</div>
                <span>CPM PUBLISHER HOJE</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md6>
          <v-card color="error" class="white--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">R${{cpm.list.redator.amount}}</div>
                <span>CPM REDATOR HOJE</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
    </v-layout>
    </v-container>
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
    cpm:{
      list:[],
      loading:true
    }
  }),
  methods: {
    getCPM() {
      this.$axiosAPI
        .get(process.env.VUE_APP_API_URL+"/cpm/dashboard")
        .then(response => {
          this.cpm.list = response.data
          this.cpm.loading = false;
        });
    }
  },

  created() {
    this.getRole()
    this.getCPM()
  }
}
</script>
