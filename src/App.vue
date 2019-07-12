<template>
  <v-app class="grey lighten-4">
    <Navbar v-if="['esqueci-senha'].indexOf($route.name) && ['login'].indexOf($route.name) && ['cadastro'].indexOf($route.name) && ['cadastro-indicacoes'].indexOf($route.name)"/>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  },
  data() {
    return {
      //
    };
  }
};
</script>
