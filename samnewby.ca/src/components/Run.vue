<template>
  <v-container class="grey darken-3 my-2">
    <v-row>
      <v-col class="d-flex justify-space-between">
        <div class="d-flex flex-column">
          <h3 class="indigo--text text--lighten-4">
            <span style="text-decoration: underline">Date:</span><br />{{
              run.Date
            }}
          </h3>
          <h3 class="indigo--text text--lighten-4">
            <span style="text-decoration: underline;">Distance:</span><br />{{
              run.Distance
            }}km
          </h3>
        </div>
        <div class="d-flex justify-end">
          <v-btn icon small color="grey lighten-1" @click="deleteRun()"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    run: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteRun() {
      this.$store.dispatch("removeRun", this.run);
    },
  },
};
</script>

<style lang="scss" scoped></style>
