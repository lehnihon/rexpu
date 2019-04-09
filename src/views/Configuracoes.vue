<template>
  <div class="projects">
    <h1 class="subheading grey--text mx-4">Configurações</h1>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex md6>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">Configurações API</h3>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Endpoint"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Login"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Wordpress Senha"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex md6>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    components: {
    },
    data: () => ({
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsdW1lbi1qd3QiLCJzdWIiOjEsImlhdCI6MTU1NDgzMjc1MiwiZXhwIjoxNTU0ODM2MzUyfQ.KOBq57D9skv40g6fBmQu0UvoUE2f1u_yesuA2oAAzH0',
      response: null,
      headers: null,
    }),
    methods: {
      auth(){
        axios
          .get(process.env.VUE_APP_API_URL+"/config",{
            headers: {
              'Authorization': "Bearer " + this.token
            }
          })
          .then(response => response.data)
      },
      getConfiguracoes(){
        
      }
    },
    mounted () {
      this.auth()
    }
  }
</script>
