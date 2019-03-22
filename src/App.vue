<template>
  <div id="app" class="container-fluid">
    <router-view/>
    <div id="menu" class="bd-example my-4" v-if="isSignedIn">
        <p>Menu</p>
        <router-link tag="button" to="/offence-add" class="btn btn-outline-success mx-1 btn-sm">打撃追加</router-link>
        <router-link tag="button" to="/deffence-add" class="btn btn-outline-success mx-1 btn-sm">守備追加</router-link>
        <router-link tag="button" :to="{ name: 'OffenceShow', params: { team: user.uid }}" class="btn btn-outline-success mx-1 btn-sm">打撃成績</router-link>
        <router-link tag="button" :to="{ name: 'DeffenceShow', params: { team: user.uid }}" class="btn btn-outline-success mx-1 btn-sm">守備成績</router-link>
        <router-link tag="button" to="/" class="btn btn-outline-success mx-1 btn-sm">HOME</router-link>
        <button @click="signOut" v-if="isSignedIn">ログアウト</button>
    </div>
    <h3>他チームの成績</h3>
    <h4>打撃成績</h4>
    <router-link :to="{ name: 'OffenceShow', params: { team: 'WSKf7MiSevOyeMp6y7iorZyt4pk2' }}" class="btn btn-outline-success mx-1 btn-sm">本牧野球大好きーズ</router-link>
    <router-link :to="{ name: 'OffenceShow', params: { team: 'sB01dccqK5fSvXJy0wuvEXAaXwr1' }}" class="btn btn-outline-success mx-1 btn-sm">team1</router-link>
    <br>
    <h4>守備成績</h4>
    <router-link :to="{ name: 'DeffenceShow', params: { team: 'WSKf7MiSevOyeMp6y7iorZyt4pk2' }}" class="btn btn-outline-success mx-1 btn-sm">本牧野球大好きーズ</router-link>
    <router-link :to="{ name: 'DeffenceShow', params: { team: 'sB01dccqK5fSvXJy0wuvEXAaXwr1' }}" class="btn btn-outline-success mx-1 btn-sm">team1</router-link>
    <br>
    <router-link tag="button" to="/signin" v-if="!isSignedIn">ログイン</router-link>
  </div>
</template>
<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import store from "./store";

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
        store.commit('onAuthStateChanged', null);
        store.commit('onUserStatusChanged', false);
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