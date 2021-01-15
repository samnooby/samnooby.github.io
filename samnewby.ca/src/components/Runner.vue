<template>
  <v-container
    class="my-2"
    :class="isSelected"
    style="cursor: pointer;"
    @click="selectRunner()"
  >
    <v-row>
      <v-col>
        <h3 class="text-center">{{ runner.name }}</h3>
        <p class="text-center">Total ran: {{ runner.total_ran }}km</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    runner: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectRunner() {
      this.$store.commit("setCurrentRunner", this.runner);
      console.log("Hiding runners");
      if (window.innerWidth < 600) {
        this.$emit("hideRunners");
      }
    },
  },
  computed: {
    isSelected() {
      if (
        this.$store.state.current_runner != null &&
        this.$store.state.current_runner.name == this.runner.name
      ) {
        return "grey lighten-1";
      }
      return "grey darken-3 indigo--text text--lighten-4";
    },
  },
};
</script>

<style lang="scss" scoped></style>
