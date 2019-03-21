<template>
  <div class="hello">
    <h1>ユーザー名： {{ user.displayName }}</h1>
    <div class="bd-example my-4">
      <p>Menu</p>
      <router-link tag="button" to="/offence-add" class="btn btn-outline-success mx-1 btn-sm">打撃追加</router-link>
      <router-link tag="button" to="/deffence-add" class="btn btn-outline-success mx-1 btn-sm">守備追加</router-link>
      <router-link tag="button" to="/offence-show" class="btn btn-outline-success mx-1 btn-sm">打撃成績</router-link>
      <router-link :to="{ name: 'DeffenceShow', params: { id: user.displayName }}" class="btn btn-outline-success mx-1 btn-sm">守備成績</router-link>
    </div>
    <button @click="signOut">Sign out</button>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    computed: {
        user() {
            return this.$store.getters.user;
        }
    },
    name: 'Home',
    data () {
        return {
        }
    },
    methods: {
        signOut: function () {
            firebase.auth().signOut().then(() => {
                this.$router.push('/signin')
            })
        }
  }
}
</script>
