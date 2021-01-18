<template>
  <v-container class="fluid grey darken-1">
    <v-row>
      <v-col class="d-flex flex-column justify-center align-center">
        <h1 class="indigo--text text--lighten-4 text-center">
          Michelles Running challenge
        </h1>
        <h2 class="indigo--text text--lighten-4">
          {{ $store.state.total_ran }} steps out of {{ $store.state.goal }} steps
        </h2>
        <h2 class="indigo--text text--lighten-4">
          Only {{ $store.state.goal - $store.state.total_ran }} steps to go!!
        </h2>
        <v-progress-linear
          :value="$store.getters.percentToGoal"
          height="25"
          color="amber"
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-column" cols="12" md="6" lg="4">
        <h2 class="text-center indigo--text text--lighten-4">Runners</h2>
        <div v-if="show_runners == true">
          <v-btn
            v-if="$store.state.current_runner.total_ran != -1"
            class="grey darken-3 indigo--text text--lighten-4"
            block
            @click="show_runners = false"
            >Hide all runners</v-btn
          >
          <div v-for="runner in $store.state.runners" :key="runner.name">
            <Runner :runner="runner" v-on:hideRunners="show_runners = false" />
          </div>
        </div>
        <div v-else>
          <v-btn
            class="grey darken-3 indigo--text text--lighten-4"
            block
            @click="show_runners = true"
            >Show all runners</v-btn
          >
          <Runner :runner="this.$store.state.current_runner" />
        </div>
        <v-btn
          @click="show_add_runner = true"
          class="grey darken-3 indigo--text text--lighten-4"
          >Add Runner</v-btn
        >
        <v-dialog v-model="show_add_runner" width="400px">
          <v-card class="grey darken-3">
            <v-card-title class="headline indigo--text text--lighten-4">
              Add new runner
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Runner name"
                dark
                color="indigo lighten-4"
                v-model="runner_name"
                @keydown.enter="NewRunner()"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo lighten-4" text @click="NewRunner()"
                >Add Runner</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="8"
        v-if="this.$store.state.current_runner.total_ran != -1"
        class="d-flex flex-column"
      >
        <h2 class="text-center indigo--text text--lighten-4">Runs</h2>
        <div
          class="d-flex grey darken-3 mt-2 px-2 flex-column align-center py-0"
        >
          <h3 class="indigo--text text--lighten-4 py-0 my-0">Add a new run</h3>
          <v-col cols="12" class="d-flex flex-column">
            <v-dialog
              ref="dialog"
              v-model="show_date_menu"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Run date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  dark
                  class="ml-2"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                scrollable
                @input="show_date_menu = false"
              ></v-date-picker>
            </v-dialog>
            <v-text-field
              class="ml-2"
              dark
              label="Run distance"
              prepend-icon="mdi-shoe-sneaker"
              v-model.number="new_run_length"
              @keydown.enter="NewRun()"
            ></v-text-field>
          </v-col>
        </div>
        <div class="d-flex justify-end grey darken-3 pr-3 pb-2">
          <v-btn text small color="blue-grey lighten-4" @click="NewRun()"
            ><v-icon>mdi-plus</v-icon>Add run</v-btn
          >
        </div>
        <div
          v-for="run in this.$store.state.current_runner.runs"
          :key="run.Date + run.Distance"
        >
          <Run :run="run" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Runner from "../components/Runner";
import Run from "../components/Run";
import { mapActions } from "vuex";

export default {
  components: {
    Runner,
    Run,
  },
  data() {
    return {
      new_run_length: 0,
      date: new Date().toISOString().substring(0, 10),
      show_date_menu: false,
      show_add_runner: false,
      runner_name: "",
      show_runners: true,
    };
  },
  methods: {
    ...mapActions(["setupRunners", "addNewRun", "addNewRunner"]),
    NewRun() {
      console.log("Adding run on date " + this.date);
      try {
        var foo = new Date(this.date);
        var new_run_date = new Date(
          foo.getTime() - foo.getTimezoneOffset() * -60000
        ).toDateString();
        var float_run_length = parseFloat(this.new_run_length);
        console.log(/^-?\d+(?:[.,]\d*?)?$/.test(this.new_run_length));
        if (
          float_run_length == null ||
          float_run_length <= 0 ||
          !/^-?\d+(?:[.,]\d*?)?$/.test(this.new_run_length)
        ) {
          throw "Run length must be a number";
        }
      } catch (err) {
        console.log(err);
        alert("Run length must be a number bigger than 0");
        return;
      }
      console.log(
        "Got date " + new_run_date + " with length " + float_run_length
      );
      this.addNewRun({
        Date: new_run_date,
        Distance: float_run_length,
      });
      this.date = new Date().toISOString().substring(0, 10);
    },
    NewRunner() {
      this.show_add_runner = false;
      console.log("Adding new runner with name " + this.runner_name);
      if (this.runner_name.length == 0) {
        alert("Runner name cannot be empty");
        return false;
      }
      this.addNewRunner(this.runner_name);
      this.runner_name = "";
    },
  },
  created() {
    console.log("Running component created");
    this.setupRunners();
  },
};
</script>

<style scoped>
.new_run_length input {
  color: #c5cae9 !important;
}
</style>
