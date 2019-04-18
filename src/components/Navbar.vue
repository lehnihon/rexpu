<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon class="grey--text" @click="drawer= !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Win</span>
        <span>Up</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" flat color="grey">
        <span>Logout</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer :mini-variant.sync="mini" v-model="drawer"  fixed app class="primary">
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>
          <v-list-tile-content class="white--text">
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider class="deep-purple mx-2"></v-divider>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
              <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      mini: true,
      drawer:false,
      links:[
          { icon: 'dashboard', text: 'Painel', route: '/' },
          { icon: 'person_pin', text: 'Membros', route: '/membros' },
          { icon: 'computer', text: 'Matérias', route: '/materias' },
          { icon: 'assignment', text: 'Relatórios', route: '/relatorios' },
          { icon: 'question_answer', text: 'Suporte/Ticket', route: '/suporte-ticket' },
          { icon: 'help_outline', text: 'Dúvidas Frequentes', route: '/duvidas-frequentes' },
          { icon: 'monetization_on', text: 'Financeiro', route: '/financeiro' },
          { icon: 'build', text: 'Configurações', route: '/configuracoes' },
      ]
    };
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
};
</script>