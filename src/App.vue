<template>
  <div id="app">
    <router-view/>
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
          this.$store.commit('onUcurrentTeamChanged', team[0]);
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