<template>
  <div class="hello">
    <h1>チーム名： {{ user.displayName }}</h1>
  </div>
</template>

<script>
export default {
    computed: {
        user() {
            const displayName = this.$store.getters.user ? this.$store.getters.user : 'No Name'
            return displayName;
        },

    },
    name: 'Home',
    data () {
        return {
        }
    }
}
</script>
