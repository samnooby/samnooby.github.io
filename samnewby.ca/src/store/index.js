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
    goal: 1000000,
    num_runners: 0,
  },
  mutations: {
    //addRunner adds a new runner to the state
    addRunner(state, runners) {
      state.runners = state.runners.concat(runners);
      runners.forEach((runner) => {
        state.total_ran += parseFloat(runner.total_ran);
      });
    },
    //setRunner sets the current runner to the passed in runner
    setCurrentRunner(state, runner) {
      console.log("Setting current runner to " + runner);
      state.current_runner = runner;
    },
    addRun(state, run) {
      state.current_runner.total_ran += parseFloat(run.Distance);
      state.total_ran += parseFloat(run.Distance);
      state.current_runner.runs.push(run);
      console.log(state.current_runner);
    },
    addRuns(state, runs) {
      state.total_ran -= state.current_runner.total_ran;
      state.current_runner.total_ran = 0;
      state.current_runner.runs = runs;
      console.log(runs);
      for (var i = 0; i < runs.length; i++) {
        state.current_runner.total_ran =
          state.current_runner.total_ran + parseFloat(runs[i].Distance);
      }
      state.total_ran += state.current_runner.total_ran;
    },
    resetState(state) {
      state.current_runner.total_ran = 0;
      state.current_runner.runs = [];
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
          commit("addRuns", resp.data);
        });
    },
    getRunnerData({ commit }) {
      axios
        .get(BASE_URL + "/run")
        .then((resp) => {
          console.log(resp);
          commit("setupRunnerData", resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  getters: {
    currentRunner(state) {
      return state.runners[state.current_runner];
    },
    percentToGoal(state) {
      return (state.total_ran / state.goal) * 100;
    },
  },
  modules: {},
});
