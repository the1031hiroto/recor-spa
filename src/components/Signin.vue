<template>
  <div class="signin">
    <h2>ログイン</h2>
    <input type="text" placeholder="Username" v-model="username">
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
        username: '',
        password: ''
        }
    },
    methods: {
        signIn: function () {
          firebase.auth().signInWithEmailAndPassword(this.username, this.password)
          .then(user => {
              // TODO: userでできるはず
              var user1 = firebase.auth().currentUser;
              user1 = user1 ? user1 : {};
              store.commit('onAuthStateChanged', user1);
              store.commit('onUserStatusChanged', user1.uid ? true : false);
              alert('Success login', user.displayName)
            this.$router.push('/')
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
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
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