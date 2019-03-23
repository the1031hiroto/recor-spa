<template>
  <div class="hello">
    <h2>チーム名： {{ user.displayName }}</h2>
    <form @submit.prevent="isConfirm = true">
      <input type="text" class="form-control" placeholder="選手名" v-model="name" required>
      <input type="number" class="form-control" placeholder="背番号" v-model="uniNum" required>
      <button type="submit" class="btn btn-outline-primary my-1">選手追加</button>
    </form>
    <div class="border-bottom my-2 py-2">
      <h3>オーダー</h3>
      <draggable :list="batters" class="dragArea" element="ul">
          <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
      </draggable>
      <button @click="reduceBatter" type="button" class="btn btn-outline-warning">最後のバッターを除外</button>
      <br>
      <button @click="isConfirmOrder = true" type="button" class="btn btn-outline-success my-1">オーダー確定</button>
    </div>
    <div v-if="isConfirm" class="modal1">
      <div>
        <ul class="list-group mb-4">
            <li class="list-group-item">選手名：{{ name }}</li>
            <li class="list-group-item">背番号：{{ uniNum }}</li>
        </ul>
        <button class="btn btn-primary mx-1" @click="submit">確定</button>
        <button @click="isConfirm = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
      </div>
    </div>
    <div v-if="isConfirmOrder" class="modal1">
      <div>
        <ul class="list-group mb-4">
            <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
        </ul>
        <button class="btn btn-primary mx-1" @click="submitOrder">確定</button>
        <button @click="isConfirmOrder = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  computed: {
    user() {
        const displayName = this.$store.getters.user ? this.$store.getters.user : 'No Name'
        return displayName;
    },

  },
  name: 'Home',
  mounted() {
    const team = this.$store.getters.user.uid
    const directory = '/members'
    const membersList = firebase.database().ref(team + directory)
    membersList.on('value', (snapshot) => {
        this.batters = Object.values(snapshot.val())
    })
  },
  data () {
      return {
        isConfirm: false,
        isConfirmOrder: false,
        batters: [],
        name: '',
        uniNum: ''
      }
  },
  methods: {
    submit: function () {
      let result = {
          "選手名": this.name,
          "背番号": this.uniNum

      }
      // const team = "WSKf7MiSevOyeMp6y7iorZyt4pk2"
      const team = this.$store.getters.user.uid
      const directory = '/members'
      const commentsRef = firebase.database().ref(team + directory)
      commentsRef.push(result)

      this.name = ''
      this.uniNum = ''
      this.isConfirm = false
    },
    submitOrder: function () {
      this.$store.state.order = this.batters
      // let i = 0
      // for (i in this.batters) {
      //     let result = {
      //         "試合日": moment(new Date()).format('YYYY/MM/DD'),
      //         "選手名": this.batters[i],
      //         "試合": 1
      //     }
      //     this.updateDB(result)
      // }
      this.isConfirmOrder = false
    },
    reduceBatter: function () {
      this.batters.pop()
    },
  },
}
</script>
