<template>
    <div id="offence-add" class="container-fluid">
        <h2>打撃追加</h2>
        <form @submit.prevent="validate" class="row border-bottom my-2 py-2">
            <div class="col-12 my-1">
                <label>打撃成績</label>
                <select v-model="batter" class="custom-select" required>
                    <option value=''>バッター</option>
                    <option v-for="(batter, index) in batters" v-bind:value="batter['選手名']" :key="index">
                        {{ batter['選手名'] }}
                    </option>
                </select>
            </div>
            <div class="col-12 my-1">
                <select v-model="hit" class="custom-select">
                    <option v-for="(hitOption, index) in hitOptions" v-bind:value="hitOption.value" :key="index">
                        {{ hitOption.text }}
                    </option>
                </select>
            </div>
            <div class="col-12 my-1">
                <select v-model="out" class="custom-select">
                    <option v-for="(outOption, index) in outOptions" v-bind:value="outOption.value" :key="index">
                        {{ outOption.text }}
                    </option>
                </select>
            </div>

            <div id="target" class="col-12" @click="getClickPosition" :style="{ 'background-image': 'url(' + assetsImage + ')' }"><font-awesome-icon icon="map-pin" id="map-pin" /></div>

            <div class="col-12 my-1">
                <select v-model="onBall" class="custom-select">
                    <option value=''>捕球者</option>
                    <option v-for="(onBallOption, index) in onBallOptions" v-bind:value="onBallOption" :key="index">
                        {{ onBallOption.value }}
                    </option>
                </select>
            </div>
            <div class="col-12 my-1">
                <select v-model="daten" class="custom-select">
                    <option value=''>打点</option>
                    <option v-for="(datenOption, index) in datenOptions" v-bind:value="datenOption.value" :key="index">
                        {{ datenOption.text }}
                    </option>
                </select>
            </div>

            <div id='option' class="col-12">
                <div v-for="(option, index) in recordOptions" :key="index" class="form-check form-check-inline">
                    <input v-model="optionResult" :id="option.value" :value="option.value" class="form-check-input" type="checkbox"/>
                    <label :for="option.value" class="form-check-label">{{ option.text }}</label>
                </div>
            </div>
            <div class="col-12">
                <div class="float-right">
                    <button type="submit" class="btn btn-outline-primary my-1">追加</button>
                </div>
            </div>
        </form>

        <form @submit.prevent="isConfirmOther = true" class="row border-bottom my-2 py-2">
            <div class="col-12 my-1 form-group">
                <label>その他</label>
                <select v-model="batter" class="custom-select" required>
                    <option v-for="(batter, index) in batters" v-bind:value="batter['選手名']" :key="index">
                        {{ batter['選手名'] }}
                    </option>
                </select>
            </div>
            <div class="col-12 my-1 form-group">
                <select v-model="other" class="custom-select" required>
                    <option v-for="(otherOption, index) in otherOptions" v-bind:value="otherOption.value" :key="index">
                        {{ otherOption.text }}
                    </option>
                </select>
            </div>
            <div class="col-12">
                <div class="float-right">
                    <button type="submit" class="btn btn-outline-primary my-1">追加</button>
                </div>
            </div>
        </form>

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
import $ from 'jquery'

export default {
    name: "offence-add",
    mounted() {
        const team = this.currentUser['uid']
        const directory = '/members'
        const membersList = firebase.database().ref(team + directory)
        membersList.on('value', (snapshot) => {
            const members = Object.values(snapshot.val())
            const order = this.myOrder
            this.batters = order.length ? order : members
        })

        const versus = this.versus['uid']
        if (versus) {
            const directoryOrder = '/order'
            const orders = firebase.database().ref(versus + directoryOrder)
            orders.on('value', (snapshot) => {
                this.versusOrder = Object.values(snapshot.val())
            })
        }

        // document.getElementById( "target" ).addEventListener('click', this.getClickPosition, false);
        // document.getElementById( "target" ).addEventListener('touchstart', this.getClickPosition, false);
    },
    computed: {
        currentUser: function() {
            return this.$store.getters.user;
        },
        versus: function() {
            return this.$store.getters.versus;
        },
        myOrder: function() {
            return this.$store.getters.order;
        }
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
                { id: 0, value: 'ピッチャー' },
                { id: 1, value: 'キャッチャー' },
                { id: 2, value: '1塁' },
                { id: 3, value: '2塁' },
                { id: 5, value: 'ショート' },
                { id: 4, value: '3塁' },
                { id: 8, value: 'ライト' },
                { id: 7, value: 'センター' },
                { id: 6, value: 'レフト' }
            ],
            recordOptions: [
                { text: '得点圏', value: '得点圏' },
                { text: '走者有', value: '走者有' },
                { text: '進塁打', value: '進塁打' },
                { text: '公式戦', value: '公式戦' },
            ],
            datenOptions: [
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
            onBallX: "",
            onBallY: "",
            out: "",
            optionResult: [],
            daten: 0,
            isConfirm: false,
            isConfirmOther: false,
            showData: [0],
            other: "",
            versusOrder: [],
            assetsImage: "/ground.jpg"
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

            if (!(this.hit == "四球" || this.hit == "死球" || this.out == "三振") && this.onBallX) {
                result["打球"] = { x: this.onBallX, y: this.onBallY }
            }

            if (this.optionResult) {
                this.optionResult.map(item => { result[item] = 1});
            }

            if (this.daten) {
                result["打点"] = this.daten
            }

            this.updateDB(result)
            if (this.versus['uid']) {
                this.updateVersusPitcher()

                if (this.versusOrder.length || this.out || this.hit == "失策出" || this.hit == "ゲッツー崩れ") {
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
            const team = this.currentUser['uid']
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
                "エラー": errorCount,
                "打球": {
                    x: this.onBallX,
                    y: this.onBallY
                }
            }
            this.updateVersusDB(a)
        },
        updateVersusDB: function (result) {
            const versus = this.versus['uid']
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
            const versus = this.versus['uid']
            const directory = '/pitcher'
            const db = firebase.database().ref(versus + directory)
            db.push(result)
        },
        getClickPosition: function (e) {
            // ページ内クリック位置にピン表示
            $('#map-pin').offset({ top: e.pageY, left: e.pageX });

            // 要素の位置を取得
            const clientRect = document.getElementById( "target" ).getBoundingClientRect() ;
            const positionX = clientRect.left + window.pageXOffset ;
            const positionY = clientRect.top + window.pageYOffset ;

            // 要素内クリック位置
            if (e.clientX) {
                this.onBallX = e.clientX - positionX ;
                this.onBallY = e.clientY - positionY ;
            }
        }
    }
};

</script>

<style>
    #target {
        position: relative;
        width: 92vw;
        height: 40vh;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        text-align: center;
        color: red;
    }
    #map-pin {
        position: absolute;
        top: 73%;
        left: 47%;
        font-size: 2rem;
    }
</style>
