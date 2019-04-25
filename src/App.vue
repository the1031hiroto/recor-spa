<template>
  <div id="app">
    <router-view/>
    <div id="app" class="container-fluid">
      <div class="row justify-content-end">
          <p class="col-3">Menu</p>
      </div>
      <div v-if="this.$route.params.team" class="row">
        <div class="col-12">
          <div class="row justify-content-end">
            <div class="col-auto my-2">
              <button @click="linkPush('OffenceShow')" class="btn btn-outline-info btn-sm">打撃成績</button>
            </div>
            <div class="col-auto my-2">
              <button @click="linkPush('DeffenceShow')" class="btn btn-outline-info btn-sm">守備成績</button>
            </div>
            <div class="col-auto my-2">
              <button @click="linkPush('PitcherShow')" class="btn btn-outline-info btn-sm">投手成績</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isSignedIn" class="row my-3 justify-content-end">
        <div class="col-auto">
          <button @click="signOut" class="btn btn-outline-warning">ログアウト</button>
        </div>
        <div class="col-auto">
          <button @click="linkHome('Home')" class="btn btn-outline-success">HOME</button>
        </div>
      </div>
      <div class="row my-3">
        <div class="col-12">
          <h3>チーム一覧</h3>
        </div>
        <div v-for="(team, index) in teamList" :key="index" @click="link('Home', team['チーム名'])" class="col-auto my-1">
          <button
            class="btn btn-outline-success mx-1 btn-sm">
            {{ team['チーム名'] }}
          </button>
        </div>
      </div>
      <div v-if="!isSignedIn">
        <h4 class="font-weight-bold">成績追加する為にはログインが必要です。</h4>
        <router-link tag="button" to="/signin" class="btn btn-outline-info font-weight-bold">ログイン</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/auth';
// import store from "./store";

export default {
  name: 'App',
  mounted() {
    const teamList = firebase.database().ref('/teams')
    teamList.on('value', (snapshot) => {
      this.teamList = Object.values(snapshot.val())
    })
  },
  data () {
      return {
        teamList: []
      }
  },
  computed: {
    user: function() {
        return this.$store.getters.user;
    },
    isSignedIn: function() {
      return this.$store.getters.isSignedIn;
    },
  },
  methods: {
    signOut: function () {
      firebase.auth().signOut().then(() => {
          this.$router.replace('/signin')
      })
      this.$store.commit('destroySession', this.$store.state);
      // this.$store.commit('onAuthStateChanged', null);
      // this.$store.commit('onUserStatusChanged', false);
      // this.$store.commit('state', []);
    },
    linkHome: function (to) {
      this.$router.replace({ name: to, params: { team: this.user.displayName }})
    },
    linkPush: function (to) {
      this.getTeams()
      this.$router.push({ name: to })
    },
    link: function (to, team) {
      this.getTeams()
      this.$router.replace({ name: to, params: { team: team }})
    },
    getTeams: function(){
      const directory = '/teams'
      const allRawData = firebase.database().ref(directory)
      let teamList = []
      allRawData.on('value', (snapshot) => {
          const teamData = snapshot.val()
          Object.keys(teamData).forEach(function (k, i) {
              teamList[i] = teamData[k]
          })
          const teamName = this.$route.params.team
          const team = teamList.filter(item => item['チーム名'] == teamName)
          store.commit('onUcurrentTeamChanged', team[0]);
          // this.$store.currentTeam = team[0]
      })
    }
  }
};
</script>
<style>
table {
  font-size: .5rem;
}
table th {
  background-color: #42b983;
  color: white;
  text-align: center !important;
}
/*modal*/
.modal1 {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal1 div {
  padding: 2rem;
  background: white;
  overflow: scroll;
  height: 100vh;
}
</style>