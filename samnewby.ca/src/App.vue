<template>
  <v-app>
    <v-app-bar app class="grey darken-3">
      <v-container>
        <v-row>
          <v-col class="d-flex justify-center">
            <h2 class="indigo--text text--lighten-4">Sam Newby</h2>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main class="fluid grey darken-1">
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
