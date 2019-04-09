<template>
    <div id="offence-add">
        <h2>打撃追加</h2>
        <div class="border-bottom my-2 py-2">
            <h3>打撃成績</h3>
            <form @submit.prevent="validate">
                <select v-model="batter" class="custom-select my-1" required>
                    <option v-for="(batter, index) in batters" v-bind:value="batter['選手名']" :key="index">
                        {{ batter['選手名'] }}
                    </option>
                </select>
                <select v-model="hit" class="custom-select my-1">
                    <option v-for="(hitOption, index) in hitOptions" v-bind:value="hitOption.value" :key="index">
                        {{ hitOption.text }}
                    </option>
                </select>

                <select v-model="out" class="custom-select my-1">
                    <option v-for="(outOption, index) in outOptions" v-bind:value="outOption.value" :key="index">
                        {{ outOption.text }}
                    </option>
                </select>

                <select v-model="onBall" class="custom-select my-1">
                    <option v-for="(onBallOption, index) in onBallOptions" v-bind:value="onBallOption" :key="index">
                        {{ onBallOption.value }}
                    </option>
                </select>

                <select v-model="daten" class="custom-select my-1">
                    <option v-for="(datenOption, index) in datenOptions" v-bind:value="datenOption.value" :key="index">
                        {{ datenOption.text }}
                    </option>
                </select>

                <div id='option' class="custom-checkbox my-1">
                    オプション：
                    <label v-for="(option, index) in recordOptions" :for="option.value" :key="index">
                        <input :id="option.value" :value="option.value" v-model="optionResult" type="checkbox"/>
                        {{ option.text }}
                    </label>
                </div>

                <button type="submit" class="btn btn-outline-primary my-1">追加</button>
            </form>
        </div>
        <div class="border-bottom my-2 py-2">
            <h3>その他</h3>
            <form @submit.prevent="isConfirmOther = true">
                <select v-model="batter" class="custom-select my-1" required>
                    <option v-for="(batter, index) in batters" v-bind:value="batter['選手名']" :key="index">
                        {{ batter['選手名'] }}
                    </option>
                </select>

                <select v-model="other" class="custom-select my-1" required>
                    <option v-for="(otherOption, index) in otherOptions" v-bind:value="otherOption.value" :key="index">
                        {{ otherOption.text }}
                    </option>
                </select>

                <button type="submit" class="btn btn-outline-primary my-1">追加</button>
            </form>
        </div>
        <div v-if="isConfirm" class="modal1">
            <div>
                <ul class="list-group mb-4">
                    <li v-if="batter" class="list-group-item">バッター：{{ batter }}</li>
                    <li v-if="hit" class="list-group-item">ヒット：{{ hit }}</li>
                    <li v-if="out" class="list-group-item">アウト：{{ out }}</li>
                    <li v-if="onBall" class="list-group-item">打球：{{ onBall.value }}</li>
                    <li v-if="optionResult.length" class="list-group-item">オプション：{{ optionResult }}</li>
                    <li v-if="daten" class="list-group-item">打点：{{ daten }}</li>
                </ul>
                <button class="btn btn-primary mx-1" @click="submit">確定</button>
                <button @click="isConfirm = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
            </div>
        </div>
        <div v-if="isConfirmOther" class="modal1">
            <div>
                <ul class="list-group mb-4">
                    <li class="list-group-item">バッター：{{ batter }}</li>
                    <li class="list-group-item">{{ other }}を追加</li>
                </ul>
                <button class="btn btn-primary mx-1" @click="submitOther">確定</button>
                <button @click="isConfirmOther = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
            </div>
        </div>
        <div v-if="message" class="modal1">
            <div>
                {{ message }}
                <button @click="message = false" type="button" class="btn btn-outline-warning mx-1">閉じる</button>
            </div>
        </div>
    </div>
</template>


<script>
import firebase from 'firebase/app';
import 'firebase/database';
import moment from 'moment'

export default {
    name: "offence-add",
    mounted() {
        const team = this.$store.getters.user.uid
        const directory = '/members'
        const membersList = firebase.database().ref(team + directory)
        membersList.on('value', (snapshot) => {
            this.batters = Object.values(snapshot.val())
        })

        this.batters = this.$store.state.order

        const versus = this.$store.state.versus.uid
        const directoryOrder = '/order'
        const orders = firebase.database().ref(versus + directoryOrder)
        orders.on('value', (snapshot) => {
            this.versusOrder = Object.values(snapshot.val())
        })
    },
    data() {
        return {
            message: "",
            batters: [],
            hitOptions: [
                { text: '出塁', value: '' },
                { text: '1塁打', value: '1塁打' },
                { text: '2塁打', value: '2塁打' },
                { text: '3塁打', value: '3塁打' },
                { text: '本塁打', value: '本塁打' },
                { text: '四球', value: '四球' },
                { text: '死球', value: '死球' },
                { text: '失策出', value: '失策出' },
                { text: 'ゲッツー崩れ', value: 'ゲッツー崩れ' }
            ],
            outOptions: [
                { text: 'アウト', value: '' },
                { text: 'ゴロアウト', value: 'ゴロアウト' },
                { text: 'フライアウト', value: 'フライアウト' },
                { text: '三振', value: '三振' },
                { text: '犠打', value: '犠打' },
                { text: '犠飛', value: '犠飛' },
                { text: '併殺打', value: '併殺打' }
            ],
            onBallOptions: [
                { text: '打球', value: '' },
                { id: 0, value: 'ピッチャー' },
                { id: 1, value: 'キャッチャー' },
                { id: 2, value: '1塁' },
                { value: '1塁線' },
                { value: '2塁間' },
                { id: 3, value: '2塁' },
                { value: '2遊間' },
                { id: 5, value: 'ショート' },
                { value: '3遊間' },
                { id: 4, value: '3塁' },
                { value: '3塁線' },
                { id: 8, value: 'ライト' },
                { value: '右中間' },
                { id: 7, value: 'センター' },
                { value: 'ラ左中間イト' },
                { id: 6, value: 'レフト' }
            ],
            recordOptions: [
                { text: '得点圏', value: '得点圏' },
                { text: '走者有', value: '走者有' },
                { text: '進塁打', value: '進塁打' },
                { text: '公式戦', value: '公式戦' },
            ],
            datenOptions: [
                { text: '打点', value: '' },
                { text: '1打点', value: 1 },
                { text: '2打点', value: 2 },
                { text: '3打点', value: 3 },
                { text: '4打点', value: 4 }
            ],
            otherOptions: [
                { text: 'その他', value: '' },
                { text: '得点', value: '得点' },
                { text: '盗塁', value: '盗塁' },
                { text: '盗塁死', value: '盗塁死' },
            ],
            batter: "",
            hit: "",
            onBall: "",
            out: "",
            optionResult: [],
            daten: 0,
            isConfirm: false,
            isConfirmOther: false,
            showData: [0],
            other: "",
            versusOrder: []
        };
    },
    methods: {
        validate: function () {
            this.hit || this.out? this.isConfirm = true : this.message = "打席結果が選択されていません。"
        },
        submit: function () {
            let result = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "打席数": 1,
                "選手名": this.batter
            }

            this.hit? result[this.hit] = 1 : result[this.out] = 1

            if (!(this.hit == "四球" || this.hit == "死球" || this.out == "犠打" || this.out != "犠飛")) {
                result["打数"] = 1
            }

            if (!(this.hit == "四球" || this.hit == "死球" || this.out == "三振") && this.onBall) {
                result["打球"] = this.onBall.value
            }

            if (this.optionResult) {
                this.optionResult.map(item => { result[item] = 1});
            }

            if (this.daten) {
                result["打点"] = this.daten
            }

            this.updateDB(result)
            if (this.$store.state.versus.uid) {
                this.updateVersusPitcher()

                if (this.out || this.hit == "失策出" || this.hit == "ゲッツー崩れ") {
                    this.defineVersusDeffence()
                }
            }

            this.hit = ""
            this.onBall = ""
            this.out = ""
            this.optionResult = []
            this.daten = 0
            this.isConfirm = false
        },
        submitOther: function () {
            let result = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "選手名": this.batter
            }
            result[this.other] = 1

            this.updateDB(result)

            this.other = ""
            this.isConfirmOther = false
        },
        updateDB: function (result) {
            const team = this.$store.getters.user.uid
            const directory = '/offence'
            const db = firebase.database().ref(team + directory)
            db.push(result)
        },
        defineVersusDeffence: function () {
            let position = ''
            let name = ''
            let killSupportCount = 0
            let killCount = 0
            let errorCount = 0
            if (this.out != '三振') {
                position = this.onBall.value
                name = this.versusOrder[this.onBall.id]['選手名']
            }

            if (this.out == '三振') {
                position =  'キャッチャー'
                name = this.versusOrder[2]['選手名']
                killCount = 1
            } else if (this.out == 'フライアウト' || this.out == '犠飛') {
                killCount = 1
            } else {
                // TODO:併殺打
                killSupportCount = 1
                const b = {
                    "試合日": moment(new Date()).format('YYYY/MM/DD'),
                    "ポジション": '1塁',
                    "選手名": this.versusOrder[2]['選手名'],
                    "刺殺": 1,
                    "捕殺": 0,
                    "エラー": 0
                }
                this.updateVersusDB(b)
            }
            if (this.hit == '失策出') {
                // TODO:ゲッツー崩れ
                errorCount = 1
            }

            let a = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "ポジション": position,
                "選手名": name,
                "捕殺": killSupportCount,
                "刺殺": killCount,
                "エラー": errorCount
            }
            this.updateVersusDB(a)
        },
        updateVersusDB: function (result) {
            const versus = this.$store.state.versus.uid
            const directory = '/deffence'
            const db = firebase.database().ref(versus + directory)
            db.push(result)
        },
        updateVersusPitcher: function () {
            let result = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "選手名": this.versusOrder[0]['選手名']
            }
            if (this.hit == "1塁打" || this.hit == "2塁打" || this.hit == "3塁打" || this.hit == "本塁打") {
                result["被安打"] = 1
            }
            if (this.hit == "本塁打") {
                result["本塁打"] = 1
            }
            if (this.hit == "四球") {
                result["与四球"] = 1
            }
            if (this.hit == "死球") {
                result["与死球"] = 1
            }
            if (this.out == "ゴロアウト" || this.out == "犠打") {
                result["ゴロアウト"] = 1
            }
            if (this.out == "フライアウト" || this.out == "犠飛") {
                result["フライアウト"] = 1
            }
            if (this.out == "併殺打") {
                result["併殺打"] = 1
            }
            if (this.out == "三振") {
                result["奪三振"] = 1
            }
            const versus = this.$store.state.versus.uid
            const directory = '/pitcher'
            const db = firebase.database().ref(versus + directory)
            db.push(result)
        }
    }
};

</script>