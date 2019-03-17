<template>
    <div id="offence-add">
        <h2>打撃追加</h2>
        <div class="border-bottom my-2 py-2">
            <h3>打順</h3>
            <draggable :list="batters" class="dragArea" element="ul">
                <li v-for="(batter, index) in batters" :key="index">{{ batter }}</li>
            </draggable>
            <button @click="reduceBatter" type="button" class="btn btn-outline-warning">最後のバッターを除外</button>
            <br>
            <button @click="submitOrder" type="button" class="btn btn-outline-success my-1">打順確定</button>
        </div>
        <div class="border-bottom my-2 py-2">
            <h3>打撃成績</h3>
            <form @submit.prevent="validate">
                <select v-model="batter" class="custom-select my-1" required>
                    <option v-for="(batter, index) in batters" v-bind:value="batter" :key="index">
                        {{ batter }}
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
                    <option v-for="(onBallOption, index) in onBallOptions" v-bind:value="onBallOption.value" :key="index">
                        {{ onBallOption.text }}
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
                    <option v-for="(batter, index) in batters" v-bind:value="batter" :key="index">
                        {{ batter }}
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
                    <li v-if="onBall" class="list-group-item">打球：{{ onBall }}</li>
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
import firebase,{ functions } from "firebase";
import draggable from 'vuedraggable'
import moment from 'moment'

export default {
    components: {
        draggable,
    },
    name: "offence-add",
    data() {
        return {
            message: "",
            batters: [
                'ひろと',
                '大志',
                '龍',
                '達也',
                '三好',
                '先生',
                'バタニキ',
                'りょーま',
                '涼',
                '隼人',
                'さいち',
                'ゆーや',
                '岡さん',
                '航',
                '小僧',
                '浅野',
            ],
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
                { text: 'ピッチャー', value: 'ピッチャー' },
                { text: 'キャッチャー', value: 'キャッチャー' },
                { text: '1塁', value: '1塁' },
                { text: '1塁線', value: '1塁線' },
                { text: '1,2塁間', value: '2塁間' },
                { text: '2塁', value: '2塁' },
                { text: '2遊間', value: '2遊間' },
                { text: 'ショート', value: 'ショート' },
                { text: '3遊間', value: '3遊間' },
                { text: '3塁', value: '3塁' },
                { text: '3塁線', value: '3塁線' },
                { text: 'ライト', value: 'ライト' },
                { text: '右中間', value: '右中間' },
                { text: 'センター', value: 'センター' },
                { text: '左中間', value: 'ラ左中間イト' },
                { text: 'レフト', value: 'レフト' }
            ],
            recordOptions: [
                { text: '得点圏', value: '得点圏' },
                { text: '走者有', value: '走者有' },
                { text: '進塁打', value: '進塁打' },
                { text: '公式戦', value: '公式線' },
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
            other: ""
        };
    },
    methods: {
        validate: function () {
            if (this.hit || this.out) {
                this.isConfirm = true
            } else {
                this.message = "打席結果が選択されていません。"
                return
            }
        },
        submit: function () {
            const today = new Date()
            let result = {
                "試合日": moment(today).format('YYYY/MM/DD'),
                "打席数": 1,
                "選手名": this.batter
            }
            //TODO: game_id
            //TODO: 条件分岐をちゃんとする
            if (this.hit == "四球" || this.hit == "死球" || this.out == "犠打" || this.out == "犠飛") {
                result["打数"] = 0
            } else {
                result["打数"] = 1
            }
            if (this.hit) {
                result[this.hit] = 1
            } else if (this.out) {
                result[this.out] = 1
            }
            //TODO: 条件分岐をちゃんとする
            if ((this.hit != "四球" || this.hit != "死球" || this.out != "三振") && this.onBall) {
                result["打球"] = this.onBall
            }
            if (this.optionResult) {
                let i = 0
                for (i in this.optionResult) {
                    result[this.optionResult[i]] = 1
                }
            }
            if (this.daten > 0) {
                result["打点"] = this.daten
            }

            const directory = '/records'
            const commentsRef = firebase.database().ref(directory)
            commentsRef.push(result)

            this.hit = ""
            this.onBall = ""
            this.out = ""
            this.optionResult = []
            this.daten = 0
            this.isConfirm = false
        },
        submitOther: function () {
            const today = new Date()
            let result = {
                "試合日": moment(today).format('YYYY/MM/DD'),
                "選手名": this.batter
            }
            result[this.other] = 1

            const directory = '/records'
            const commentsRef = firebase.database().ref(directory)
            if (this.batter) {
                commentsRef.push(result)
            } else {
                this.error = true
                this.message = "更新できませんでした。"
                return
            }
            this.other = ""
            this.isConfirmOther = false
        },
        submitOrder: function () {
            let i = 0
            const today = new Date()
            const directory = '/records'
            const commentsRef = firebase.database().ref(directory)
            for (i in this.batters) {
                console.log(i)
                let result = {
                    "試合日": moment(today).format('YYYY/MM/DD'),
                    "選手名": this.batters[i],
                    "試合": 1
                }
                commentsRef.push(result)
            }
            // this.isConfirmOther = false
        },
        reduceBatter: function () {
            this.batters.pop()
        }
    }
};

</script>
<style>
/*modal*/
.modal1 {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal1 div {
    padding: 2rem;
    background: white;
}
.dragArea {
    width: 10rem;
}
.dragArea li {
    list-style-type: decimal;
}
</style>