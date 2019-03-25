<template>
  <div class="signup">
    <h2>Sign up</h2>
    <input type="text" placeholder="チーム名" v-model="username">
    <input type="text" placeholder="メールアドレス" v-model="email">
    <input type="password" placeholder="パスワード" v-model="password">
    <button @click="signUp">登録</button>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Signup',
  data () {
    return {
      username: '',
      password: '',
      email: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          user = firebase.auth().currentUser;
          user.updateProfile({
              displayName: this.username,
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
          }).then(function() {
              this.$router.push('/')
          }).catch(function(error) {
              alert(error.message)
          });
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signup {
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