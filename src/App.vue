<template>
  <div id="app">
    <router-view/>
    <div id="app" class="container-fluid">
      <div class="row justify-content-end" v-if="isSignedIn">
          <p class="col-3">Menu</p>
      </div>
      <div class="row" v-if="isSignedIn">
        <div class="col-12">
          <div class="row justify-content-end">
            <div class="col-auto">
              <router-link tag="button" to="/offence-add" class="btn btn-outline-success btn-sm">打撃追加</router-link>
            </div>
            <div class="col-auto">
              <router-link tag="button" to="/deffence-add" class="btn btn-outline-success btn-sm">守備追加</router-link>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row justify-content-end">
            <div class="col-auto my-2">
              <button @click="link('OffenceShow')" class="btn btn-outline-info btn-sm">打撃成績</button>
            </div>
            <div class="col-auto my-2">
              <button @click="link('DeffenceShow')" class="btn btn-outline-info btn-sm">守備成績</button>
            </div>
            <div class="col-auto my-2">
              <button @click="link('PitcherShow')" class="btn btn-outline-info btn-sm">投手成績</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-3 justify-content-end">
        <div class="col-auto">
          <button @click="signOut" v-if="isSignedIn" class="btn btn-outline-warning">ログアウト</button>
        </div>
        <div class="col-auto">
          <router-link tag="button" to="/" class="btn btn-outline-success">HOME</router-link>
        </div>
      </div>
      <h3>成績一覧</h3>
      <h4>打撃成績</h4>
      <button v-for="(team, index) in teamList" :key="`first-${index}`"
        @click="link('OffenceShow', team['uid'], team['チーム名'])"
        class="btn btn-outline-success mx-1 btn-sm">
        {{ team['チーム名'] }}
      </button>
      <br>
      <h4>守備成績</h4>
      <button v-for="(team, index) in teamList" :key="`second-${index}`"
        @click="link('DeffenceShow', team['uid'], team['チーム名'])"
        class="btn btn-outline-success mx-1 btn-sm">
        {{ team['チーム名'] }}
      </button>
      <br>
      <h4>投手成績</h4>
      <button v-for="(team, index) in teamList" :key="`third-${index}`"
        @click="link('PitcherShow', team['uid'], team['チーム名'])"
        class="btn btn-outline-success mx-1 btn-sm">
        {{ team['チーム名'] }}
      </button>
      <br>
      <div v-if="!isSignedIn">
        成績追加する為にはログインが必要です。<router-link tag="button" to="/signin">ログイン</router-link>
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
    user() {
        return this.$store.getters.user;
    },
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    }
  },
  methods: {
    signOut: function () {
        firebase.auth().signOut().then(() => {
            this.$router.push('/signin')
        })
        this.$store.commit('destroySession', this.$store.state);
        // this.$store.commit('onAuthStateChanged', null);
        // this.$store.commit('onUserStatusChanged', false);
        // this.$store.commit('state', []);
    },
    link: function (to, uid, team) {
      this.$store.uid = uid ? uid : this.user.uid
      const teamName = team ? team : this.user.displayName
      this.$router.replace({ name: to, params: { team: teamName }})
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