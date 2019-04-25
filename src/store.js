import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    status: false,
    order: {},
    versus: {},
    currentTeam: ''
  },
  mutations: {
    onAuthStateChanged(state, user) {
      state.user = user; //firebaseが返したユーザー情報
    },
    onUserStatusChanged(state, status) {
      state.status = status; //ログインしてるかどうか true or false
    },
    onUcurrentTeamChanged(state, currentTeam) {
      state.currentTeam = currentTeam;
    },
    destroySession(state) {
      for (let key in state) {
        state[key] = null;
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
    order(state) {
      return state.order;
    },
    currentTeam(state) {
      return state.currentTeam;
    }
  },
  plugins: [createPersistedState()]
});
