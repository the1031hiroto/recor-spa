<template>
  <div class="signin">
    <h2>ログイン</h2>
    <input type="text" placeholder="Username" v-model="email">
    <input type="password" placeholder="Password" v-model="password">
    <button @click="signIn">ログイン</button>
    <p><router-link to="/signup">アカウント作成</router-link></p>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import store from "../store";

export default {
  name: 'Signin',
  data: function () {
      return {
      email: '',
      password: ''
      }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        user = firebase.auth().currentUser;
        store.commit('onAuthStateChanged', user);
        store.commit('onUserStatusChanged', user.uid ? true : false);
        this.$router.push('team/' + user.displayName)
      },
      err => {
          alert(err.message)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>