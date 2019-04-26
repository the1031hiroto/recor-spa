<template>
  <div id="home" class="container-fluid" v-if="isSignedIn">
    <h2>チーム名： {{ this.$route.params.team }}</h2>
    <div v-if="isMyPage" class="row border-bottom py-2 justify-content-end">
      <div class="col-4">
        <button v-if="!isGameOn" @click="gameOn" class="btn btn-outline-primary my-1">試合開始</button>
      </div>
    </div>

    <div v-if="isGameOn" class="row border-bottom my-2 py-2">
      <div class="col-12">
        <div class="row justify-content-end">
          <div class="col-auto">
            <h3>オーダー</h3>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row justify-content-end">
          <div class="col-7">
            <draggable :list="batters" class="dragArea" element="ul">
                <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
            </draggable>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row my-1 justify-content-end">
          <div class="col-auto">
            <button @click="reduceBatter" type="button" class="btn btn-outline-warning">最後のバッターを除外</button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row my-1 justify-content-end">
          <div class="col-auto">
            <button @click="isConfirmOrder = true; isGameOn = false" type="button" class="btn btn-outline-success">オーダー確定</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isConfirmOrder" class="row border-bottom my-2 py-2">
      <div class="col-12">
        <div class="row justify-content-end">
          <div class="col-auto">
            <h3>守備位置</h3>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row justify-content-end">
          <div class="col-7">
            <draggable :list="deffences" class="dragArea" element="ul">
              <li v-for="(deffence, index) in deffences" :key="index">{{ deffence['選手名'] }}</li>
          </draggable>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row my-1 justify-content-end">
          <div class="col-auto">
            <button @click="reduceDeffence" type="button" class="btn btn-outline-warning">最後の守備を除外</button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row my-1 justify-content-end">
          <div class="col-auto">
            <button @click="isConfirmDeffence = true; isConfirmOrder = false" type="button" class="btn btn-outline-success my-1">守備位置確定</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isConfirmDeffence" class="row border-bottom my-2 py-2">
      <div class="col-12">
        <div class="row justify-content-end">
          <div class="col-auto">
            <h3>対戦相手</h3>
          </div>
        </div>
      </div>
      <div class="col-12 my-1">
        <select v-model="versus" class="custom-select">
          <option v-for="(team, index) in teamList" v-bind:value="team" :key="index">
              {{ team['チーム名'] }}
          </option>
        </select>
      </div>
      <div class="col-12">
        <div class="row my-1 justify-content-end">
          <div class="col-auto">
            <button @click="isConfirmGame = true" type="button" class="btn btn-outline-success my-1">対戦相手確定</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isConfirmGame" class="modal1">
      <div>
        <p class="list-group-item">対戦相手{{ versus }}</p>
        <P>オーダー</P>
        <ul class="list-group mb-4">
            <li v-for="(batter, index) in batters" :key="index">{{ batter['選手名'] }}</li>
        </ul>
        <P>守備位置</P>
        <ul class="list-group mb-4">
            <li v-for="(deffence, index) in deffences" :key="index">{{ deffence['選手名'] }}</li>
        </ul>
        <button class="btn btn-primary mx-1" @click="submitGame">確定</button>
        <button @click="isConfirmGame = false; isGameOn = true" type="button" class="btn btn-outline-warning mx-1">キャンセル</button>
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

    <form v-if="isMyPage" @submit.prevent="isConfirm = true" class="row border-bottom my-2 py-2 justify-content-end">
      <div class="col-4">
        <input type="text" class="form-control" placeholder="選手名" v-model="name" required>
      </div>
      <div class="col-4">
        <input type="number" class="form-control" placeholder="背番号" v-model="uniNum" required>
      </div>
      <div class="col-4">
        <button type="submit" class="btn btn-outline-primary">選手追加</button>
      </div>
    </form>

    <form v-if="isMyPage" @submit.prevent="chengeName()" class="row border-bottom my-2 py-2 justify-content-end">
      <div class="col-4">
        <input type="text" class="form-control" placeholder="チーム名" v-model="teamName" required>
      </div>
      <div class="col-5">
        <button type="submit" class="btn btn-outline-primary">チーム名変更</button>
      </div>
    </form>

    <div class="row" v-if="isMyPage">
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
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
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
    currentUser() {
      return this.$store.getters.user;
    },
    currentTeam: function() {
      return this.$store.getters.currentTeam;
    }
  },
  mounted() {
    this.checkMyPage()
  },
  data () {
      return {
        isMyPage: false,
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
        teamList: [],
        teamName: ''
      }
  },
  methods: {
    gameOn: function () {
      const team = this.currentUser['uid']
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

      this.isGameOn = true
    },
    submit: function () {
      const result = {
          "選手名": this.name,
          "背番号": this.uniNum

      }
      const team = this.currentUser['uid']
      const directory = '/members'
      const db = firebase.database().ref(team + directory)
      db.push(result)

      this.name = ''
      this.uniNum = ''
      this.isConfirm = false
    },
    submitGame: function () {
      this.$store.commit('onOrderStatusChanged', this.batters)
      this.$store.commit('onVersusChanged', this.versus)
      let i = 0
      const team = this.currentUser['uid']
      for (i in this.batters) {
        let result = {
            "試合日": moment(new Date()).format('YYYY/MM/DD'),
            "選手名": this.batters[i]['選手名'],
            "試合": 1
        }
        const offenceDirectory = '/offence'
        const offenceDB = firebase.database().ref(team + offenceDirectory)
        offenceDB.push(result)
      }

      const orderDirectory = '/order'
      const orderDB = firebase.database().ref(team + orderDirectory)
      orderDB.set(this.deffences)

      this.$router.push({ name: 'OffenceAdd' })
    },
    reduceBatter: function () {
      this.batters.pop()
    },
    reduceDeffence: function () {
      this.deffences.pop()
    },
    chengeName: function () {
      let currentTeam = ''
      let user = firebase.auth().currentUser
      user.updateProfile({
          displayName: this.teamName,
      }).then(function() {
        const uid = user.uid
        const directory = '/teams'
        const allRawData = firebase.database().ref(directory)
        allRawData.on('value', function(snapshot) {
          const teamData = snapshot.val()
          var teamUid = Object.keys(teamData).filter(function(team) {
            return teamData[team]['uid'] == uid
          })
          const db = firebase.database().ref(directory + '/' + teamUid[0] + '/チーム名')
          db.set(user.displayName)

          currentTeam = teamUid[0]
        })
        // TODO ちゃんとメッセージだす
        alert('done')
      }).catch(function(error) {
        alert(error.message)
      });

      this.$store.commit('onUcurrentTeamChanged', currentTeam)
      user = firebase.auth().currentUser
      this.$store.commit('onAuthStateChanged', user);
      // this.$router.replace({ name: 'Home', params: { team: currentTeam['チーム名'] }})
    },
    checkMyPage: function () {
      if (this.isSignedIn) {
        this.isMyPage = this.$route.params.team == this.currentUser.displayName ? true : false
      }
    }
  },
  watch: {
    '$route': function () {
      this.checkMyPage()
    }
  }
}
</script>
<style>
.dragArea li,
.modal1 li {
    list-style-type: decimal;
}
</style>
