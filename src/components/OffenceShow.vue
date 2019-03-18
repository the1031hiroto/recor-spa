<template>
    <div id="offence-show">
        <h2>打撃成績</h2>
        <div class="row justify-content-between px-3 mb-2">
            <div class="col-xs-3">
                <vuejs-datepicker
                    v-model="selectDate"
                    @input="changeTabu"
                    :format="customFormatter"
                    :highlighted="highlighted"
                    placeholder="日付で絞り込む"
                    name="datepicker"
                    class="col-xs" >
                </vuejs-datepicker>
            </div>
            <button
                @click="changeTabu(new Date(new Date().getFullYear(), -12, 1), new Date(new Date().getFullYear(), 11, 31))"
                :class="{'active': startAt === new Date(new Date().getFullYear(), 11, 31)}"
                class="btn btn-outline-success btn-sm col-xs-3">トータル</button>
            <button
                @click="changeTabu(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31))"
                :class="{'active': startAt === new Date(new Date().getFullYear(), 0, 1)}"
                class="btn btn-outline-success btn-sm col-xs-3">今シーズン</button>
            <button
                @click="regulation()"
                :class="{'active': isRegulation === true}"
                class="btn btn-outline-success btn-sm col-xs-3">規定({{ regulationNum }}打席)以上</button>
            <button
                @click="recent20"
                :class="{'active': isRecent20 === true}"
                class="btn btn-outline-success btn-sm col-xs-3">直近20打席</button>
        </div>
        <b-table :items="showData" :fields="columns" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" striped hover responsive small />

        <br>
        <ul class="list-group">
            <li class="list-group-item">
                XR: EXtrapolated Runs 得点におけるチームへの貢献度 チームの全打者のXRを足すと、チームの総得点とほぼ同じになる
                <br>
                出典：<a href="https://www47.atwiki.jp/bbstats/pages/17.html" class="badge badge-secondary">野球関連指標まとめ</a>
            </li>
            <li class="list-group-item">
                XR27: 1～9番まで任意の1人で打線を組んだら、一試合で何点獲れるかを表す。
                <br>
                出典：<a href="https://www47.atwiki.jp/bbstats/pages/17.html" class="badge badge-secondary">野球関連指標まとめ</a>
            </li>
            <li class="list-group-item">
                wOBA: Weighted On Base Average 打席あたりにどれだけチームの得点増に貢献する打撃をしているか
                <br>
                出典：<a href="https://www47.atwiki.jp/bbstats/pages/14.html#wOBA" class="badge badge-secondary">野球関連指標まとめ</a>
            </li>
            <li class="list-group-item">
                wRAA: Weighted Runs Above Average どれだけチームの得点を増やしたか、平均的な打者であればゼロ
                <br>
                出典：<a href="https://www47.atwiki.jp/bbstats/pages/14.html#wRAA" class="badge badge-secondary">Esse野球関連指標まとめ</a>
            </li>
            <li class="list-group-item">
                選球眼(BB/K) = 四球 / 三振
                <br>
                四球数が多く三振数が少ない打者ほどこの数値が高くなるが、一方で四球も三振も多い選手、四球も三振も少ない選手の間で同じような数値が出てしまう。いかにBB/Kに優れていても、四球が少ない打者が選球眼が良いとはいえない。近代野球において四球の重要性は最早明白であり、逆に三振が多いことによる大きなマイナス面は見られないのである。実践において三振数とほぼ同数、あるいはそれ以上の四球を取る選手は「ハンド・アイ・コーディネーション（手と目の連係動作）に優れ、コンタクトの上手い打者」「バッティングのアプローチが適切で、ストライクゾーン管理能力に長けた打者」と評される。
                <br>
                出典：<a href="https://ja.wikipedia.org/wiki/%E9%81%B8%E7%90%83%E7%9C%BC" class="badge badge-secondary">フリー百科事典『ウィキペディア（Wikipedia）』</a>
            </li>
        </ul>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import vuejsDatepicker from 'vuejs-datepicker';
import moment from 'moment'
import Vue from 'vue'
import ClientTable from 'vue-tables-2';
Vue.use(ClientTable);

const columns = [
    "選手名",
    "打席数",
    "打数",
    "安打",
    { key: '打率', sortable: true },
    "三割(4打数)",
    { key: 'XR', sortable: true },
    { key: 'XR27', sortable: true },
    { key: 'WOBA', sortable: true },
    { key: 'WRAA', sortable: true },
    { key: '三振率', sortable: true },
    { key: '四球率', sortable: true },
    { key: 'BB/K', sortable: true },
    "走者有",
    "進塁打",
    "進塁打率",
    "ゴロアウト",
    "フライアウト",
    "試合",
    "1塁打",
    "2塁打",
    "3塁打",
    "本塁打",
    "打点",
    "得点",
    "四球",
    "死球",
    "三振",
    "併殺打",
    "犠飛",
    "犠打",
    "盗塁",
    "牽制死",
    "失策出",
    "塁打数",
    "出塁率",
    "長打率",
    "OPS",
    "得点圏打率"
]
const dataColumns = [
    "打席数",
    "打数",
    "試合",
    "1塁打",
    "2塁打",
    "3塁打",
    "本塁打",
    "打点",
    "得点",
    "四球",
    "死球",
    "三振",
    "併殺打",
    "犠飛",
    "犠打",
    "盗塁",
    "牽制死",
    "失策出",
    "走者有",
    "進塁打",
    "ゴロアウト",
    "フライアウト"
]
export default {
    components: {
        vuejsDatepicker
    },
    name: "offence-show",
    mounted() {
        // TODO:デフォルトで「今シーズン」選択
        // this.startAt = new Date(new Date().getFullYear(), 0, 1)
        this.getData(1000)
    },
    data() {
        return {
            columns: columns,
            sortBy: '打率',
            sortDesc: true,
            mainData: [0],
            showData: [0],
            startAt: new Date(new Date().getFullYear(), 0, 1),
            endAt: new Date(new Date().getFullYear(), 11, 31),
            selectDate: "",
            isRegulation: false,
            regulationNum: 0,
            isRecent20: false,
            highlighted: {
                dates: [//TODO: 動的に取得
                    new Date("2019/02/03"),
                    new Date("2019/02/10"),
                    new Date("2019/02/17"),
                    new Date("2019/02/24"),
                    new Date("2019/03/10")
                ],
            }
        };
    },
    methods: {
        customFormatter(date) {
            return moment(date).format('YYYY/MM/DD');
        },
        changeTabu: function (startAt, endAt) {
            this.isRegulation = false
            this.isRecent20 = false
            this.regulationNum = 0
            this.startAt = startAt
            this.endAt = endAt ? endAt : startAt
            this.getData(1000)
        },
        regulation: function() {
            this.isRegulation = true
            this.showData = [0]
            for (let i = 0; i < this.mainData.length; i++) {
                if (this.mainData[i]["打席数"] >= this.regulationNum) {
                    this.showData[i] = this.mainData[i]
                }
            }
            this.showData = this.showData.filter(v => v)
            this.showData = this.statistic(this.showData)
        },
        recent20: function() {
            this.isRegulation = false
            this.isRecent20 = true
            this.getData(20)
        },
        getData: function(filterNum){
            const directory = '/records'
            const allRawData = firebase.database().ref(directory);
            let offenceDataList = []
            allRawData.orderByChild("試合日").startAt(moment(this.startAt).format('YYYY/MM/DD')).endAt(moment(this.endAt).format('YYYY/MM/DD')).on('value', (snapshot) => {
                const offenceData = snapshot.val()
                Object.keys(offenceData).forEach(function (k, i) {
                    offenceDataList[i] = offenceData[k]
                })
                let sumOffenceData = offenceDataList.reduce(function (result, current) {
                    result.map(item => Object.entries(item).map(([key, value]) => item[key] = value || 0));
                    let element = result.find(name => name['選手名'] === current['選手名']);

                    if (element) {
                        element['選手名'] = current['選手名']
                        dataColumns.map(item => { element[item] += current[item] && element['打席数'] < filterNum ? current[item] : 0 });
                    } else {
                        let data = { '選手名' : current['選手名'] }
                        dataColumns.forEach(item => { data[item] = current[item] });
                        result.push(data)
                    }
                    return result
                }, [])
                this.mainData = sumOffenceData
                // console.log(sumOffenceData)
                this.mainData = this.statistic(sumOffenceData)
                this.showData = this.mainData
            })
        },
        statistic: function(mainData) {
            for (let i = 0; i < mainData.length; i++) {
                const dasu = mainData[i]["打数"]
                const shishi = mainData[i]["四球"] + mainData[i]["死球"]
                mainData[i]["安打"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] + mainData[i]["3塁打"] + mainData[i]["本塁打"]
                mainData[i]["塁打数"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] * 2 + mainData[i]["3塁打"] * 3 + mainData[i]["本塁打"]* 4
                mainData[i]["打率"] = (mainData[i]["安打"] / dasu).toFixed(3)
                mainData[i]["三割(4打数)"] = this.calculate_tree_ratio(mainData[i]["安打"], dasu)
                const x = (mainData[i]["安打"] + shishi) / (dasu + shishi + mainData[i]["犠飛"] + mainData[i]["犠打"])
                mainData[i]["出塁率"] = Math.floor(x * 100) / 100
                mainData[i]["長打率"] = Math.floor(mainData[i]["塁打数"] / dasu * 100) / 100
                mainData[i]["OPS"] = (mainData[i]["長打率"] + mainData[i]["出塁率"]).toFixed(3)
                mainData[i]["BB/K"] = (shishi / mainData[i]["三振"]).toFixed(3)
                mainData[i]["XR"] = (
                    mainData[i]["1塁打"]
                    + mainData[i]["2塁打"] * 1.44
                    + mainData[i]["3塁打"] * 2.08
                    + mainData[i]["本塁打"] * 2.88
                    + shishi * 0.68
                    + mainData[i]["盗塁"] * 0.36
                    + (dasu - mainData[i]["安打"] - mainData[i]["三振"]) * (-0.18)
                    + mainData[i]["三振"] * (-0.196)
                    + mainData[i]["併殺打"] * (-0.74)
                    + mainData[i]["犠飛"] * 0.74
                    + mainData[i]["犠打"] * 0.08
                    + mainData[i]["牽制死"] * (-0.64)
                ).toFixed(2)

                mainData[i]["XR27"] = (
                    mainData[i]["XR"] /
                    (dasu -
                    mainData[i]["安打"] +
                    mainData[i]["牽制死"] +
                    mainData[i]["犠飛"] +
                    mainData[i]["犠打"] +
                    mainData[i]["併殺打"]) * 27
                ).toFixed(2)

                mainData[i]["WOBA"] = (
                    0.692 * mainData[i]["四球"] +
                    0.73 * mainData[i]["死球"] +
                    0.966 * mainData[i]["失策出"] +
                    0.865 * mainData[i]["1塁打"] +
                    1.334 * mainData[i]["2塁打"] +
                    1.725 * mainData[i]["3塁打"] +
                    2.065 * mainData[i]["本塁打"]
                ) / (dasu + shishi + mainData[i]["犠飛"])
                mainData[i]["WOBA"] = mainData[i]["WOBA"] ? Math.floor(mainData[i]["WOBA"] * 100) / 100 : 0

                mainData[i]["三振率"] = (mainData[i]["三振"] / mainData[i]["打席数"]).toFixed(3)
                mainData[i]["四球率"] = (mainData[i]["四球"] / mainData[i]["打席数"]).toFixed(3)
                mainData[i]["進塁打率"] = (mainData[i]["進塁打"] / mainData[i]["走者有"]).toFixed(3)

            }
            this.calculation_WOBA_avr(mainData)
            return mainData
        },
        calculation_WOBA_avr: function(mainData) {
            let WOBA_avr = 0
            for (let i = 0; i < mainData.length; i++) {
                WOBA_avr += mainData[i]["WOBA"]
            }
            WOBA_avr /= mainData.length
            this.add_WRAA(mainData, WOBA_avr)
        },
        add_WRAA: function(mainData, WOBA_avr) {
            for (let i = 0; i < mainData.length; i++) {
                mainData[i]["WRAA"] = ((mainData[i]["WOBA"]- WOBA_avr) / 1.24 * mainData[i]["打数"]).toFixed(2)
            }
            this.findMax(mainData)
            return mainData
        },
        calculate_tree_ratio: function(anda, dasu) {
            let k = 0
            for (k = 0; k <= 4; k++) {
                    if( ( (anda + k) / (dasu + 4) ) >= 0.3 ) {
                        return (k + '安打')
                    }
                }
        },
        findMax: function(mainData) {
            let dataList = {
                "game_id": [],
                "選手名": [],
                "試合": [],
                "打席数": [],
                "打数": [],
                "1塁打": [],
                "2塁打": [],
                "3塁打": [],
                "本塁打": [],
                "安打": [],
                "打点": [],
                "得点": [],
                "四球": [],
                "死球": [],
                "三振": [],
                "併殺打": [],
                "犠飛": [],
                "犠打": [],
                "盗塁": [],
                "盗死": [],
                "牽制死": [],
                "失策出": [],
                "塁打数": [],
                "打率": [],
                "出塁率": [],
                "長打率": [],
                "OPS": [],
                "得点圏打率": [],
                "三振率": [],
                "四球率": [],
                "BB/K": [],
                "XR": [],
                "XR27": [],
                "WOBA": [],
                "WRAA": [],
                "ゴロアウト": [],
                "フライアウト": [],
                "打球": [],
                "走者有": [],
                "進塁打": [],
                "進塁打率": [],
                "得点圏": [],
                "ゲッツー崩れ": [],
                "試合日": [],
                "三割(4打数)": [],
                "_cellVariants": []
            }
            let i = 0
            let x = []
            for (i in mainData) {
                for (x in mainData[i]) {
                    dataList[x].push(mainData[i][x])
                }
            }

            let maxData = Object.assign({}, dataList);
            let minData = Object.assign({}, dataList);
            for (i in maxData) {
                try{
                    maxData[i] = Math.max.apply(null, maxData[i])
                    minData[i] = Math.min.apply(null, minData[i])
                } catch(e){
                    maxData[i] = 0
                    minData[i] = 0
                }
            }

            for (let i = 0; i < mainData.length; i++) {
                let k = 0
                let items = {}
                for (k in maxData) {
                    const reverceData = ['三振', '三振率', '盗塁死', '牽制死', '併殺打']
                    if (maxData[k] && mainData[i][k] == maxData[k] && !reverceData.includes(k)) {
                        items[k] = 'info'
                    } else if (maxData[k] && mainData[i][k] == maxData[k] && reverceData.includes(k)) {
                        items[k] = 'danger'
                    } else if (minData[k] && mainData[i][k] == minData[k] && !reverceData.includes(k)) {
                        items[k] = 'danger'
                    } else if (minData[k] && mainData[i][k] == minData[k] && reverceData.includes(k)) {
                        items[k] = 'info'
                    }
                    mainData[i]['_cellVariants'] = items
                }
            }
            this.regulationNum = maxData['試合'] * 2
            return maxData
        }
    }
};
</script>
<style>
#offence-show table th {
    min-width: 2.5rem;
}
td {
    text-align: center;
}
td.table-info {
    font-weight: bold;
}
.table-striped tbody tr:nth-of-type(even) td:first-child {
    background: white;
}
.table-striped tbody tr:nth-of-type(odd) td:first-child {
    background-color: rgb(242, 242, 242);
}

/*tableの最左列固定*/
th:first-child,
td:first-child {
    position: sticky !important;
    left: 0;
    z-index: 100;
}
.vdp-datepicker__calendar {
    z-index: 101 !important;
}
.table-hover>tbody>tr:hover,
.table-hover>tbody>tr:hover td,
.table-hover>tbody>tr:active td {
    background-color: #bfbaba;
}
#offence-show .list-group {
    font-size: .5rem;
}
/* TODO:ちゃんと非表示にする */
.VueTables__limit-field,
.VueTables__search {
    display: none  !important;
}
.vdp-datepicker input {
    width: 8rem;
}
</style>