<template>
  <div id="home" v-if="isSignedIn">
    <h2>チーム名： {{ user.displayName }}</h2>
    <form @submit.prevent="isConfirm = true">
      <input type="text" class="form-control" placeholder="選手名" v-model="name" required>
      <input type="number" class="form-control" placeholder="背番号" v-model="uniNum" required>
      <button type="submit" class="btn btn-outline-primary my-1">選手追加</button>
    </form>
    <button v-if="!isGameOn" @click="isGameOn = true" class="btn btn-outline-primary my-1">試合開始</button>

    <div v-if="isGameOn" class="border-bottom my-2 py-2">
      <h3>オーダー</h3>
      <draggable :list="batters" class="dragArea" element="ul">
          <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
      </draggable>
      <button @click="reduceBatter" type="button" class="btn btn-outline-warning">最後のバッターを除外</button>
      <br>
      <button @click="isConfirmOrder = true" type="button" class="btn btn-outline-success my-1">オーダー確定</button>
    </div>

    <div v-if="isConfirmOrder" class="border-bottom my-2 py-2">
      <h3>守備位置</h3>
      <draggable :list="deffences" class="dragArea" element="ul">
          <li v-for="(deffence, index) in deffences" :key="index">{{ deffence['選手名'] }}</li>
      </draggable>
      <button @click="reduceDeffence" type="button" class="btn btn-outline-warning">最後の守備を除外</button>
      <br>
      <button @click="isConfirmDeffence = true" type="button" class="btn btn-outline-success my-1">守備位置確定</button>
    </div>

    <div v-if="isConfirmDeffence" class="border-bottom my-2 py-2">
      <h3>対戦相手</h3>
      <select v-model="versus" class="custom-select my-1">
        <option v-for="(team, index) in teamList" v-bind:value="team" :key="index">
            {{ team['チーム名'] }}{{ team['uid'] }}
        </option>
      </select>
      <br>
      <button @click="isConfirmGame = true" type="button" class="btn btn-outline-success my-1">対戦相手確定</button>
    </div>

    <div v-if="isConfirmGame" class="modal1">
      <div>
        <p class="list-group-item">対戦相手{{ versus.name }}</p>
        <P>オーダー</P>
        <ul class="list-group mb-4">
            <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
        </ul>
        <P>守備位置</P>
        <ul class="list-group mb-4">
            <li v-for="(deffence, index) in deffences" :key="index">{{ deffence['選手名'] }}</li>
        </ul>
        <button class="btn btn-primary mx-1" @click="submitGame">確定</button>
        <button @click="isConfirmGame = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
      </div>
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
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import draggable from 'vuedraggable'
import moment from 'moment'

export default {
  name: 'Home',
  components: {
    draggable,
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },
    user() {
        const displayName = this.$store.getters.user ? this.$store.getters.user : 'No Name'
        return displayName;
    },

  },
  mounted() {
    if (this.isSignedIn) {
      const team = this.$store.getters.user.uid
      const directory = '/members'
      const membersList = firebase.database().ref(team + directory)
      membersList.on('value', (snapshot) => {
        const members = Object.values(snapshot.val())
        this.batters = Array.from(members);
        this.deffences = Array.from(members);
      })

      const teamList = firebase.database().ref('/teams')
      teamList.on('value', (snapshot) => {
        this.teamList = Object.values(snapshot.val())
      })
    }
  },
  data () {
      return {
        isConfirm: false,
        isConfirmGame: false,
        isConfirmDeffence: false,
        isGameOn: false,
        isConfirmOrder: false,
        isConfirmVersus: false,
        batters: [],
        deffences: [],
        name: '',
        uniNum: '',
        versus: '',
        teamList: []
      }
  },
  methods: {
    submit: function () {
      const result = {
          "選手名": this.name,
          "背番号": this.uniNum

      }
      // const team = "WSKf7MiSevOyeMp6y7iorZyt4pk2"
      const team = this.$store.getters.user.uid
      const directory = '/members'
      const db = firebase.database().ref(team + directory)
      db.push(result)

      this.name = ''
      this.uniNum = ''
      this.isConfirm = false
    },
    submitGame: function () {
      this.$store.state.versus = this.versus
      this.$store.state.order = this.batters
      let i = 0
      for (i in this.batters) {
        let result = {
            "試合日": moment(new Date()).format('YYYY/MM/DD'),
            "選手名": this.batters[i]['選手名'],
            "試合": 1
        }
        // this.updateDB(result)
        const team = this.$store.getters.user.uid
        const directory = '/offence'
        const db = firebase.database().ref(team + directory)
        db.push(result)
      }

      const uid = this.$store.getters.user.uid
      const directory = '/order'
      const db = firebase.database().ref(uid + directory)
      db.set(this.deffences)

      this.$router.push({ name: 'OffenceAdd' })
    },
    reduceBatter: function () {
      this.batters.pop()
    },
    reduceDeffence: function () {
      this.deffences.pop()
    },
  },
}
</script>
<style>
.dragArea {
    width: 10rem;
}
.dragArea li,
.modal1 li {
    list-style-type: decimal;
}
</style>
