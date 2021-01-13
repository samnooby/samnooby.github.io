import Vue from "vue";
import Vuex from "vuex";

const axios = require("axios");
const BASE_URL = "http://localhost:8888/";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    runners: [],
    total_ran: 0,
    current_runner: { total_ran: -1 },
  },
  mutations: {
    //addRunner adds a new runner to the state
    addRunner(state, runners) {
      state.runners = state.runners.concat(runners);
    },
    //setRunner sets the current runner to the passed in runner
    setCurrentRunner(state, runner) {
      console.log("Setting current runner to " + runner);
      state.current_runner = runner;
    },
    addRun(state, run) {
      state.current_runner.total_ran += parseInt(run.Distance);
      state.current_runner.runs.push(run);
      console.log(state.current_runner);
    },
    setRuns(state, runs) {
      var run;
      state.current_runner.total_ran = 0;
      state.current_runner.runs = [];
      console.log("Here");
      console.log(state.current_runner);
      for (run of runs) {
        console.log(run);
        state.current_runner.total_ran += run.Distance;
        state.current_runner.runs.push(run);
        console.log(state.current_runner);
      }
    },
  },
  actions: {
    //setupRunners gets the runners from the api and adds them to the state
    setupRunners({ commit }) {
      console.log("Setting up runners");
      axios
        .get(BASE_URL + "runners")
        .then((response) => {
          console.log(response);
          commit("addRunner", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNewRunner({ commit }, runner_name) {
      console.log("Adding runner " + runner_name);
      var form_data = new FormData();
      form_data.append("name", runner_name);
      axios
        .post(BASE_URL + "runners", form_data)
        .then((resp) => {
          console.log(resp);
          commit("addRunner", { name: runner_name, total_ran: 0, runs: [] });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNewRun({ state, commit }, run) {
      var form_data = new FormData();
      form_data.append("Date", run.Date);
      form_data.append("Distance", run.Distance);
      axios
        .post(BASE_URL + "runs/" + state.current_runner.name, form_data)
        .then((resp) => {
          commit("addRun", run);
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeRun({ state, commit }, run) {
      var form_data = new FormData();
      form_data.append("Date", run.Date);
      form_data.append("Distance", run.Distance);
      axios
        .post(
          BASE_URL + "runs/" + state.current_runner.name + "/delete",
          form_data
        )
        .then((resp) => {
          console.log(resp);
          commit("setRuns", resp.data);
        });
    },
  },
  getters: {
    currentRunner(state) {
      return state.runners[state.current_runner];
    },
  },
  modules: {},
});
