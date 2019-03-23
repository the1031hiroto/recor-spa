<template>
  <div id="app" class="container-fluid">
    <router-view/>
    <div id="menu" class="bd-example my-4" v-if="isSignedIn">
        <p>Menu</p>
        <router-link tag="button" to="/offence-add" class="btn btn-outline-success mx-1 btn-sm">打撃追加</router-link>
        <router-link tag="button" to="/deffence-add" class="btn btn-outline-success mx-1 btn-sm">守備追加</router-link>
        <button @click="link('OffenceShow')" class="btn btn-outline-success mx-1 btn-sm">打撃成績</button>
        <button @click="link('DeffenceShow')" class="btn btn-outline-success mx-1 btn-sm">守備成績</button>
        <router-link tag="button" to="/" class="btn btn-outline-success mx-1 btn-sm">HOME</router-link>
        <button @click="signOut" v-if="isSignedIn">ログアウト</button>
    </div>
    <h3>他チームの成績</h3>
    <h4>打撃成績</h4>
    <button @click="link('OffenceShow', 'WSKf7MiSevOyeMp6y7iorZyt4pk2', '本牧野球大好きーズ')" class="btn btn-outline-success mx-1 btn-sm">本牧野球大好きーズ</button>
    <button @click="link('OffenceShow', 'sB01dccqK5fSvXJy0wuvEXAaXwr1', 'team1')" class="btn btn-outline-success mx-1 btn-sm">team1</button>
    <br>
    <h4>守備成績</h4>
    <button @click="link('DeffenceShow', 'WSKf7MiSevOyeMp6y7iorZyt4pk2', '本牧野球大好きーズ')" class="btn btn-outline-success mx-1 btn-sm">本牧野球大好きーズ</button>
    <button @click="link('DeffenceShow', 'sB01dccqK5fSvXJy0wuvEXAaXwr1', 'team1')" class="btn btn-outline-success mx-1 btn-sm">team1</button>
    <br>
    <div v-if="!isSignedIn">
      成績追加する為にはログインが必要です。<router-link tag="button" to="/signin">ログイン</router-link>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/auth';
// import store from "./store";

export default {
  name: 'App',
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
        this.$store.commit('onAuthStateChanged', null);
        this.$store.commit('onUserStatusChanged', false);
        this.$store.commit('order', []);
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
</style>