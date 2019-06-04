<template>
    <div id="offence-show" class="container-fluid">
        <h2>{{ this.$route.params.team }}<br>打撃成績</h2>
        <div class="row">
            <div class="col-6 my-2">
                <vuejs-datepicker
                    v-model="selectDate"
                    @input="changeDate"
                    :format="customFormatter"
                    :highlighted="highlighted"
                    placeholder="日付で絞り込む"
                    name="datepicker" >
                </vuejs-datepicker>
            </div>
            <div class="col-6 my-2">
                <button
                    @click="regulation()"
                    :class="{'active': isRegulation === true}"
                    class="btn btn-outline-success btn-sm">規定({{ regulationNum }}打席)以上</button>
            </div>
            <div class="col-4 mb-3">
                <button
                    @click="fullYear = true; changeRange()"
                    :class="{'active': fullYear === true}"
                    class="btn btn-outline-success btn-sm">トータル {{startOfFullYear[0]}}〜</button>
            </div>
            <div class="col-4 mb-3">
                <button
                    @click="fullYear = false; changeRange()"
                    :class="{'active': fullYear === false}"
                    class="btn btn-outline-success btn-sm">今シーズン</button>
            </div>
            <div class="col-4 mb-3">
                <button
                    @click="recent20"
                    :class="{'active': isRecent20 === true}"
                    class="btn btn-outline-success btn-sm">直近20打席</button>
            </div>
        </div>
        <b-table
            :items="showData"
            :fields="columns"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            @row-dblclicked="linkMemebers"
            striped hover responsive small />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import vuejsDatepicker from 'vuejs-datepicker';
import moment from 'moment'

// const columns = [
//     "選手名",
//     { key: '打率', sortable: true },
//     { key: 'XR', sortable: true },
//     { key: 'XR27', sortable: true },
//     { key: 'WOBA', sortable: true },
//     { key: 'WRAA', sortable: true },
//     { key: '三振率', sortable: true },
//     { key: '四球率', sortable: true },
//     { key: 'BB/K', sortable: true },
//     "NOI",
//     "GPA",
//     "ISOD",
//     "PA/K",
//     "SECA",
//     "TA",
//     "打点",
//     "得点",
//     "四球",
//     "死球",
//     "三振",
//     "盗塁",
//     "失策出",
//     "出塁率",
//     "得点圏打率"
// ]
const columns = [
    "選手名",
    { key: '打席数', sortable: true },
    { key: '打数', sortable: true },
    { key: '安打', sortable: true },
    { key: '打率', sortable: true },
    "三割(4打数)",
    { key: 'XR', thClass: 'xr', sortable: true },
    { key: 'XR27', thClass: 'xr27', sortable: true },
    { key: 'WOBA', thClass: 'woba', sortable: true },
    { key: 'WRAA', thClass: 'wraa', sortable: true },
    { key: '三振率', sortable: true },
    { key: '四球率', sortable: true },
    { key: 'BB/K', thClass: 'bbk', sortable: true },
    { key: 'BABIP', thClass: 'babip', sortable: true },
    { key: 'NOI', thClass: 'noi', sortable: true },
    { key: 'GPA', thClass: 'gpa', sortable: true },
    { key: 'ISOD', thClass: 'isod', sortable: true },
    { key: 'ISOP', thClass: 'isop', sortable: true },
    { key: 'PA/K', thClass: 'pak', sortable: true },
    { key: 'AB/HR', thClass: 'abhr', sortable: true },
    { key: 'SECA', thClass: 'seca', sortable: true },
    { key: 'TA', thClass: 'ta', sortable: true },
    { key: 'PS', thClass: 'ps', sortable: true },
    { key: '走者有', sortable: true },
    { key: '進塁打', sortable: true },
    { key: '進塁打率', sortable: true },
    { key: 'ゴロアウト', sortable: true },
    { key: 'フライアウト', sortable: true },
    { key: '試合', sortable: true },
    { key: '1塁打', sortable: true },
    { key: '2塁打', sortable: true },
    { key: '3塁打', sortable: true },
    { key: '本塁打', sortable: true },
    { key: '打点', sortable: true },
    { key: '得点', sortable: true },
    { key: '四球', sortable: true },
    { key: '死球', sortable: true },
    { key: '三振', sortable: true },
    { key: '併殺打', sortable: true },
    { key: '犠飛', sortable: true },
    { key: '犠打', sortable: true },
    { key: '盗塁', sortable: true },
    { key: '牽制死', sortable: true },
    { key: '失策出', sortable: true },
    { key: '塁打数', sortable: true },
    { key: '出塁率', sortable: true },
    { key: '長打率', sortable: true },
    { key: 'OPS', sortable: true },
    { key: '得点圏打率', sortable: true },
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
    "フライアウト",
    "得点圏打率"
]
const startOfThisYear = new Date(new Date().getFullYear(), 0, 1)
const endOfThisYear = new Date(new Date().getFullYear(), 11, 31)

export default {
    components: {
        vuejsDatepicker
    },
    name: "offence-show",
    mounted() {
        this.mainData
    },
    computed: {
        mainData: function() {
            return this.getData()
        },
        currentTeam: function() {
            return this.$store.getters.currentTeam;
        },
        startOfFullYear: function() {
            const firebase = this.intFirebase()
            var returnArr = [];
            firebase.orderByChild("試合日").limitToFirst(1).on('value', (snapshot) => {
                returnArr.push(Object.values(snapshot.val())[0]['試合日']);
            })
            return returnArr
        },
        highlighted: function() {
            var result = {dates: []};
            let days = []
            const firebase = this.intFirebase()
            firebase.orderByChild("試合日").on('value', (snapshot) => {
                Object.values(snapshot.val()).filter( function( value  ) {
                    for( var i in days ) {
                        if( days[i] == value["試合日"] ) return
                    }
                    days.push(value["試合日"])
                })
                result['dates'] = days.map(x => new Date(x));
            })
            return result
        },
    },
    data() {
        return {
            columns: columns,
            sortBy: '打率',
            sortDesc: true,
            showData: [0],
            selectDate: "",
            isRegulation: false,
            regulationNum: 0,
            isRecent20: false,
            fullYear: false,
            fullData: null,
        };
    },
    methods: {
        customFormatter(date) {
            return moment(date).format('YYYY/MM/DD');
        },
        changeRange: function () {
            this.isRegulation = false
            this.isRecent20 = false
            this.regulationNum = 0
            this.fullData = this.fullData || this.getData(this.startOfFullYear, startOfThisYear)
            this.fullYear ? this.filterData(1000, this.fullData) : this.filterData(1000, this.mainData)
        },
        changeDate: function (startAt, endAt) {
            this.isRegulation = false
            this.isRecent20 = false
            this.regulationNum = 0
            this.getData(startAt, endAt)
        },
        regulation: function() {
            this.isRegulation = true
            this.showData = this.showData.filter(v => v["打席数"] >= this.regulationNum )
        },
        recent20: function() {
            this.isRegulation = false
            this.isRecent20 = true
            this.filterData(20)
        },
        intFirebase: function() {
            const team = this.currentTeam['uid']
            const directory = '/offence'
            return firebase.database().ref(team + directory)
        },
        getData: function(startAt = startOfThisYear, endAt = endOfThisYear){
            let data = []
            const firebase = this.intFirebase()
            firebase.orderByChild("試合日").startAt(moment(startAt).format('YYYY/MM/DD')).endAt(moment(endAt).format('YYYY/MM/DD')).on('value', (snapshot) => {
                const offenceData = snapshot.val()
                Object.keys(offenceData).forEach(function (k, i) {
                    data[i] = offenceData[k]
                })
                this.filterData(1000, data)
            })
            return data
        },
        filterData: function(filterNum = 1000, data = this.mainData){
            const filteredData = data.reduce(function (result, current) {
                result.map(item => Object.entries(item).map(([key, value]) => item[key] = value || 0));
                let element = result.find(name => name['選手名'] === current['選手名']);

                if (element) {
                    element['選手名'] = current['選手名']
                    dataColumns.map(item => { element[item] += current[item] && element['打席数'] < filterNum ? current[item] : 0 });
                } else {
                    let data = { '選手名' : current['選手名'] }
                    dataColumns.forEach(item => { data[item] = current[item] ? current[item] : 0 });
                    result.push(data)
                }
                return result
            }, [])
            this.showData = this.statistic(filteredData)
        },
        statistic: function(mainData) {
            for (let i in mainData) {
                const dasu = mainData[i]["打数"]
                const shishi = mainData[i]["四球"] + mainData[i]["死球"]
                mainData[i]["安打"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] + mainData[i]["3塁打"] + mainData[i]["本塁打"]
                mainData[i]["塁打数"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] * 2 + mainData[i]["3塁打"] * 3 + mainData[i]["本塁打"]* 4
                mainData[i]["打率"] = Math.floor(mainData[i]["安打"] / dasu * 1000) / 1000
                mainData[i]["三割(4打数)"] = this.calculate_tree_ratio(mainData[i]["安打"], dasu)
                const x = (mainData[i]["安打"] + shishi) / (dasu + shishi + mainData[i]["犠飛"] + mainData[i]["犠打"])
                mainData[i]["出塁率"] = Math.floor(x * 100) / 100
                mainData[i]["ISOD"] = Math.floor((mainData[i]["出塁率"] - mainData[i]["打率"]) * 100) / 100
                mainData[i]["長打率"] = Math.floor(mainData[i]["塁打数"] / dasu * 100) / 100
                mainData[i]["OPS"] = (mainData[i]["長打率"] + mainData[i]["出塁率"]).toFixed(3)
                mainData[i]["NOI"] = ((mainData[i]["長打率"] + mainData[i]["出塁率"] / 3) * 1000).toFixed(3)
                mainData[i]["GPA"] = ((mainData[i]["長打率"] * 1.8 + mainData[i]["出塁率"]) / 4).toFixed(3)
                mainData[i]["ISOP"] = Math.floor((mainData[i]["長打率"] - mainData[i]["打率"]) * 100) / 100
                mainData[i]["BB/K"] = (shishi / mainData[i]["三振"]).toFixed(3)
                mainData[i]["PA/K"] = (mainData[i]["打席数"] / mainData[i]["三振"]).toFixed(3)
                mainData[i]["AB/HR"] = mainData[i]["本塁打"] ? (dasu / mainData[i]["本塁打"]).toFixed(3) : 0
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

                mainData[i]["BABIP"] = ((mainData[i]["安打"] - mainData[i]["本塁打"]) / (dasu + mainData[i]["犠打"] - mainData[i]["本塁打"] - mainData[i]["三振"])).toFixed(3)
                const caughtStealing = mainData[i]["盗塁死"] ? mainData[i]["盗塁死"] : 0
                mainData[i]["SECA"] = ((mainData[i]["塁打数"] - mainData[i]["安打"] + mainData[i]["四球"] + mainData[i]["盗塁"] - caughtStealing) / dasu).toFixed(3)
                mainData[i]["TA"] = (
                    (mainData[i]["塁打数"] + shishi + mainData[i]["盗塁"] - caughtStealing) /
                    (dasu - mainData[i]["安打"] + caughtStealing + mainData[i]["併殺打"])
                ).toFixed(3)
                mainData[i]["PS"] = ((mainData[i]["本塁打"] * mainData[i]["盗塁"] * 2) / (mainData[i]["本塁打"] + mainData[i]["盗塁"])).toFixed(3)

            }
            this.calculation_WOBA_avr(mainData)
            this.findMax(mainData)
            return mainData
        },
        calculation_WOBA_avr: function(mainData) {
            const WOBA_sum = mainData.reduce((result, current) => {
                return result + current["WOBA"] || 0
            },0)
            this.add_WRAA(mainData, WOBA_sum / mainData.length)
        },
        add_WRAA: function(mainData, WOBA_avr) {
            for (let i in mainData) {
                mainData[i]["WRAA"] = ((mainData[i]["WOBA"] - WOBA_avr) / 1.24 * mainData[i]["打数"]).toFixed(2)
            }
        },
        calculate_tree_ratio: function(anda, dasu) {
            for (let k = 0; k <= 4; k++) {
                if( ( (anda + k) / (dasu + 4) ) >= 0.3 ) return (k + '安打')
            }
        },
        findMax: function(mainData) {
            const dataList = mainData.reduce((result, current) => {
                for (let p in current) {
                    result[p] ? result[p].push(current[p]) : result[p] = []
                }
                return result
            }, {})

            let maxData = Object.assign({}, dataList);
            let minData = Object.assign({}, dataList);
            for (let i in maxData) {
                maxData[i] = Math.max.apply(null, maxData[i]) || 0
                minData[i] = Math.min.apply(null, minData[i]) || 0
            }

            const reverceData = ['三振', '三振率', '盗塁死', '牽制死', '併殺打', 'AB/HR']
            for (let j in mainData) {
                let items = {}
                for (let k in maxData) {
                    if (!maxData[k]) continue

                    if (mainData[j][k] == maxData[k]) {
                        items[k] = reverceData.includes(k) ? 'danger' : 'info'
                        continue
                    } else if (mainData[j][k] == minData[k]) {
                        items[k] = reverceData.includes(k) ? 'info' : 'danger'
                        continue
                    }
                    mainData[j]['_cellVariants'] = items
                }
            }
            this.regulationNum = maxData['試合'] * 2
        },
        linkMemebers(record) {
            this.$router.replace({ name: 'Members', params: { name: record['選手名'] }})
        },
    },
    beforeRouteUpdate (to, from , next) {
        this.filterData()
        next()
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

th::before {
    position: absolute;
    transition: all 0.3s ease 0s;
    opacity: 0;
    top: 0px;
    left: 0px;
    display: block;
    padding: 0.2em 0.5em;
    color: #ffffff;
    border-radius: 6px;
    background: #1b2538;
    white-space: pre-line;
    z-index: 999;
    width: 90vw;
    line-height: 1rem;
}
th.xr:hover::before,
th.xr27:hover::before,
th.woba:hover::before,
th.wraa:hover::before,
th.bbk:hover::before,
th.babip:hover::before,
th.noi:hover::before,
th.gpa:hover::before,
th.isod:hover::before,
th.isop:hover::before,
th.pak:hover::before,
th.abhr:hover::before,
th.seca:hover::before,
th.ta:hover::before,
th.ps:hover::before {
    top: 4rem;
    opacity: 1;
}
th.xr::before{
    content: "XR: 得点におけるチームへの貢献度 チームの全打者のXRを足すと、チームの総得点とほぼ同じになる ";
}
th.xr27::before {
    content: "XR27: 1～9番まで任意の1人で打線を組んだら、一試合で何点獲れるかを表す。";
}
th.woba::before {
    content: "wOBA: 打席あたりにどれだけチームの得点増に貢献する打撃をしているか";
}
th.wraa::before {
    content: "wRAA: どれだけチームの得点を増やしたか、平均的な打者であればゼロ ";
}
th.bbk::before {
    content: "選球眼(BB/K) = 四球 / 三振\A三振数以上の四球を取る選手は手と目の連係動作に優れ、\A「バッティングのアプローチが適切で、ストライクゾーン管理能力に長けた打者」と評される。";
}
th.babip::before {
    content: "BABIP ＝ (安打数 － 本塁打数) ／ (打数 ＋ 犠飛 － 本塁打 － 三振)\Aフェアゾーンに飛んだ打球の内、安打になった割合を示す指標。\Aボテボテの打球が内野安打になる、打ち損じた打球が野手の間に落ちるなどの幸運が多いシーズンは数値が高くなり、\A芯で捉えた打球が野手の正面を突くなど不運に見舞われたシーズンは数値が低くなる。 ";
}
th.noi::before {
    content: "NOI ＝ (出塁率 ＋ 長打率÷3) × 1000\A出塁率の価値を3倍にしたOPS。450以上ならば平均的な打者、550以上ならば主力級の打者、600以上ならば一流打者となる";
}
th.gpa::before {
    content: "GPA ＝ (出塁率×1.8 ＋ 長打率) / 4\A出塁率の価値を1.8倍にしたOPS。 ";
}
th.isod::before {
    content: "IsoD ＝ 出塁率 ー 打率\A出塁率から打率を減算した数値で、「四死球によってどの程度出塁したか」を測れる四死球占有率である。\A評価基準は0.07から0.08あれば合格点、0.1越えならその分野では一流と言われている。 ";
}
th.isop::before {
    content: "IsoP ＝ 長打 － 打率 ＝（二塁打 + 三塁打×2＋本塁打×3）÷打数\A純粋に長打力を評価するために作られた指標。すべての安打が単打であった場合、IsoPは0となる。";
}
th.pak::before {
    content: "ＰＡ／Ｋ ＝ 打席 ／ 三振\A１三振するまでに掛かる打席数 ";
}
th.abhr::before {
    content: "ＡＢ／ＨＲ ＝ 打数 ／ 本塁打\A１本塁打を記録するまでに掛かる打数 ";
}
th.seca::before {
    content: "SecA =（塁打数 - 安打 + 四球 + 盗塁 - 盗塁失敗）/ 打数\A打率から長打の要素を抽出したもの。.500以上なら一流。 ";
}
th.ta::before {
    content: "TA =（塁打数 + 四球 + 死球 + 盗塁 - 盗塁失敗）/（打数 - 安打 + 盗塁失敗 + 併殺打)\A打者が１アウト当たりにどれだけの塁打を得ることが出来たかを示す指標。 ";
}
th.ps::before {
    content: "PS ＝ (本塁打 × 盗塁 × ２) ／ (本塁打 ＋ 盗塁)\Aパワー・機動力を兼ね揃えた選手かを見るための指標。P-Sと表記されることが多い？ ";
}

</style>