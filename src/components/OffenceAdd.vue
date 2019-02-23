<template>
    <div id="offence-add">
        <h2>打順</h2>
        <draggable :list="batters" class="dragArea" element="ul">
            <li v-for="batter in batters">{{ batter.text }}</li>
        </draggable>
        <button @click="reduceBatter">最後のバッターを除外</button>
        <br>
        <h2>打撃成績</h2>
        <br>
        <select v-model="batter">
            <option v-for="batter in batters" v-bind:value="batter.value">
                {{ batter.text }}
            </option>
        </select>
        <select v-model="hit">
            <option v-for="hitOption in hitOptions" v-bind:value="hitOption.value">
                {{ hitOption.text }}
            </option>
        </select>

        <select v-model="out">
            <option v-for="outOption in outOptions" v-bind:value="outOption.value">
                {{ outOption.text }}
            </option>
        </select>

        <select v-model="onBall">
            <option v-for="onBallOption in onBallOptions" v-bind:value="onBallOption.value">
                {{ onBallOption.text }}
            </option>
        </select>

        <div id='option'>
            <label v-for="option in recordOptions" :for="option.value">
                <input :id="option.value" :value="option.value" v-model="optionResult" type="checkbox" />
                {{ option.text }}
            </label>
        </div>

        <select v-model="daten">
            <option v-for="datenOption in datenOptions" v-bind:value="datenOption.value">
                {{ datenOption.text }}
            </option>
        </select>

        <br>

        <button class="btn btn-primary" @click="isConfirm = true">Submit</button>
        <div v-if="isConfirm" class="modal1">
            <div>
                バッター：{{ batter }}<br>
                ヒット：{{ hit }}<br>
                アウト：{{ out }}<br>
                打球：{{ onBall }}<br>
                その他：{{ optionResult }}<br>
                打点{{ daten }}<br>
                <button class="btn btn-primary" @click="submit">Submit</button>
                <button class="btn btn-danger" @click="isConfirm = false">Close</button>
            </div>
        </div>

        <Menu></Menu>
    </div>
</template>


<script>
import draggable from 'vuedraggable'
import Menu from './Menu.vue'

export default {
    components: {
        draggable,
        Menu
    },
    name: "offence-add",
    data() {
        return {
            batters: [
                // { text: 'バッター', value: '' },
                { text: 'ひろと', value: 'ひろと' },
                { text: '大志', value: '大志' },
                { text: '龍', value: '龍' },
                { text: '達也', value: '達也' },
                { text: '三好', value: '三好' },
                { text: '先生', value: '先生' },
                { text: 'バタニキ', value: 'バタニキ' },
                { text: 'りょーま', value: 'りょーま' },
                { text: '涼', value: '涼' },
                { text: '隼人', value: '隼人' },
                { text: 'さいち', value: 'さいち' },
                { text: 'ゆーや', value: 'ゆーや' },
                { text: '岡さん', value: '岡さん' },
                { text: '航', value: '航' },
            ],
            hitOptions: [
                { text: '出塁', value: '' },
                { text: '1塁打', value: '1塁打' },
                { text: '2塁打', value: '2塁打' },
                { text: '3塁打', value: '3塁打' },
                { text: '本塁打', value: '本塁打' },
                { text: '四球', value: '四球' },
                { text: '死球', value: '死球' },
                { text: '失策出', value: '失策出' }
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
                { text: '1,2塁間', value: '2塁間' },
                { text: '2塁', value: '2塁' },
                { text: '2遊間', value: '2遊間' },
                { text: 'ショート', value: 'ショート' },
                { text: '3遊間', value: '3遊間' },
                { text: '3塁', value: '3塁' },
                { text: 'ライト', value: 'ライト' },
                { text: '右中間', value: '右中間' },
                { text: 'センター', value: 'センター' },
                { text: '左中間', value: 'ラ左中間イト' },
                { text: 'レフト', value: 'レフト' }
            ],
            recordOptions: [
                { text: '得点', value: '得点' },
                { text: '盗塁', value: '盗塁' },
                { text: '得点圏', value: '得点圏' },
                { text: 'ランナー1塁', value: 'ランナー1塁' },
                { text: '進塁打', value: '進塁打' },
                { text: 'ゲッツー崩れ', value: 'ゲッツー崩れ' },
                { text: '盗塁死', value: '盗塁死' },
            ],
            datenOptions: [
                { text: '打点', value: '' },
                { text: '1打点', value: 1 },
                { text: '2打点', value: 2 },
                { text: '3打点', value: 3 },
                { text: '4打点', value: 4 }
            ],
            batter: "",
            hit: "",
            onBall: "",
            out: "",
            optionResult: [],
            daten: 0,
            isConfirm: false
        };
    },
    methods: {
        submit: function () {
            const today = new Date()
            result = {
                "試合日": today.toLocaleDateString(),
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
                for (i in this.optionResult) {
                    result[this.optionResult[i]] = 1
                }
            }
            if (this.daten > 0) {
                result["打点"] = this.daten
            }

            const directory = '/records'
            const commentsRef = firebase.database().ref(directory)
            if (this.batter) {
                commentsRef.push(result)
            } else {
                console.log("no batter")
                return
            }
            this.batter = ""
            this.hit = ""
            this.onBall = ""
            this.out = ""
            this.optionResult = []
            this.daten = 0
            this.isConfirm = false
        },
        reduceBatter: function () {
            this.batters.pop()
        }
    }
};
</script>