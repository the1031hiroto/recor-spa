<template>
    <div id="offence-show">
        <!--
        <ul>
            <button v-on:click="changeTabu('old')" v-bind:class="{'active': isActive === 'old'}" class="btn btn-primary">打撃成績トータル</button>
            <button v-on:click="changeTabu('current')" v-bind:class="{'active': isActive === 'current'}" class="btn btn-primary">打撃成績今シーズン</button>
        </ul>
        -->
        <vuejs-datepicker
            v-model="date"
            @input="inputDate"
            name="datepicker" >
        </vuejs-datepicker>
        <v-client-table :columns="columns" :data="showData" :options="options" class="table-striped table-sm table-condensed">
        </v-client-table>
        <b-table hover :items="showData" />

        <Menu></Menu>
    </div>
</template>

<script>
import firebase from "firebase";
import vuejsDatepicker from 'vuejs-datepicker';
import moment from 'moment'
import Vue from 'vue'
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
Vue.use(ClientTable);

const columns = [
    "選手名",
    "打席数",
    "打数",
    "安打",
    "打率",
    "三割(4打数)",
    "XR",
    "XR27",
    "wOBA",
    "wRAA",
    "三振率",
    "四球率",
    "選球眼",
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
    "得点圏打率",
    "ランナー1塁",
    "進塁打"
]
export default {
    components: {
        vuejsDatepicker
    },
    name: "offence-show",
    mounted() {
        const directory = '/records'
        const allRawData = firebase.database().ref(directory);
        let offenceDataList = []
        allRawData.on('value', (snapshot) => {
            const offenceData = snapshot.val()
            Object.keys(offenceData).forEach(function (k, i) {
                offenceDataList[i] = offenceData[k]
            })
            const sumOffenceData = offenceDataList.reduce(function (result, current) {
                let element = result.find(function (p) {
                    return p.選手名 === current.選手名
                })
                if (element) {
                    // TODO:map?
                    element.打席数 = element.打席数 ? element.打席数 : 0
                    element.打数 = element.打数 ? element.打数 : 0
                    element['1塁打'] = element['1塁打'] ? element['1塁打'] : 0
                    element['2塁打'] = element['2塁打'] ? element['2塁打'] : 0
                    element['3塁打'] = element['3塁打'] ? element['3塁打'] : 0
                    element.本塁打 = element.本塁打 ? element.本塁打 : 0
                    element.打点 = element.打点 ? element.打点 : 0
                    element.得点 = element.得点 ? element.得点 : 0
                    element.四球 = element.四球 ? element.四球 : 0
                    element.死球 = element.死球 ? element.死球 : 0
                    element.三振 = element.三振 ? element.三振 : 0
                    element.併殺打 = element.併殺打 ? element.併殺打 : 0
                    element.犠飛 = element.犠飛 ? element.犠飛 : 0
                    element.犠打 = element.犠打 ? element.犠打 : 0
                    element.盗塁 = element.盗塁 ? element.盗塁 : 0
                    element.牽制死 = element.牽制死 ? element.牽制死 : 0
                    element.失策出 = element.失策出 ? element.失策出 : 0
                    element.塁打数 = element.塁打数 ? element.塁打数 : 0
                    element.ランナー1塁 = element.ランナー1塁 ? element.盗ランナー1塁塁 : 0
                    element.進塁打 = element.進塁打 ? element.進塁打 : 0

                    // element.試合 += current.試合
                    element.打席数 += current.打席数 ? current.打席数 : 0
                    element.打数 += current.打数 ? current.打数 : 0
                    element['1塁打'] += current['1塁打'] ? current['1塁打'] : 0
                    element['2塁打'] += current['2塁打'] ? current['2塁打'] : 0
                    element['3塁打'] += current['3塁打'] ? current['3塁打'] : 0
                    element['本塁打'] += current['本塁打'] ? current['本塁打'] : 0
                    element.打点 += current.打点 ? current.打点 : 0
                    element.得点 += current.得点 ? current.得点 : 0
                    element.四球 += current.四球 ? current.四球 : 0
                    element.死球 += current.死球 ? current.死球 : 0
                    element.三振 += current.三振 ? current.三振 : 0
                    element.併殺打 += current.併殺打 ? current.併殺打 : 0
                    element.犠飛 += current.犠飛 ? current.犠飛 : 0
                    element.犠打 += current.犠打 ? current.犠打 : 0
                    element.盗塁 += current.盗塁 ? current.盗塁 : 0
                    element.牽制死 += current.牽制死 ? current.牽制死 : 0
                    element.失策出 += current.失策出 ? current.失策出 : 0
                    element.塁打数 += current.塁打数 ? current.塁打数 : 0
                    element.ランナー1塁 += current.ランナー1塁 ? current.ランナー1塁 : 0
                    element.進塁打 += current.進塁打 ? current.進塁打 : 0
                } else {
                    result.push({
                        選手名: current.選手名,
                        // 試合: current.試合,
                        打席数: current.打席数,
                        打数: current.打数,
                        本塁打: current['1塁打'],
                        本塁打: current['2塁打'],
                        本塁打: current['3塁打'],
                        本塁打: current.本塁打,
                        打点: current.打点,
                        得点: current.得点,
                        四球: current.四球,
                        死球: current.死球,
                        三振: current.三振,
                        併殺打: current.併殺打,
                        犠飛: current.犠飛,
                        犠打: current.犠打,
                        盗塁: current.盗塁,
                        牽制死: current.牽制死,
                        失策出: current.失策出,
                        塁打数: current.塁打数,
                        ランナー1塁: current.ランナー1塁,
                        進塁打: current.進塁打
                    })
                }
                return result
            }, [])
            this.mainData = sumOffenceData
            this.showData = sumOffenceData
            console.log(sumOffenceData)
            this.mainData = statistic(sumOffenceData)
            // this.oldData = statistic(sumOffenceData)
        })
    },
    data() {
        return {
            isActive: "current",
            columns: columns,
            oldData: [],
            mainData: [0],
            showData: [1],
            options: {
                columnsDropdown: true,
                sortable: columns,
                filterByColumn: false,
                perPage: 20
                // dateColumns: ["試合日"],
                // datepickerOptions:{ locale: { cancelLabel: 'Clear' } }
                //highlightMatches: true
                //headings: {
                //    選手名: 'id',
                //    試合: '名前',
                //    打席数: 'メールアドレス'
                //},
                //headingsTooltips: {'選手名':'Expanded Title', '試合':'Expanded Title'}
            },
            date: new Date(),
            DatePickerFormat: 'yyyy-MM-dd'
        };
    },
    methods: {
        changeTabu: function (tabu) {
            this.isActive = tabu
            if (tabu == "current") {
                console.log(this.mainData)
                this.showData = this.mainData
            } else if (tabu == "old") {
                this.showData = this.oldData
            }
        },
        inputDate: function(){
            const directory = '/records'
            const allRawData = firebase.database().ref(directory);
            let offenceDataList = []
            allRawData.orderByChild("試合日").equalTo(moment(this.date).format('YYYY/MM/DD')).on('value', (snapshot) => {
                const offenceData = snapshot.val()
                Object.keys(offenceData).forEach(function (k, i) {
                    offenceDataList[i] = offenceData[k]
                })
                const sumOffenceData = offenceDataList.reduce(function (result, current) {
                    let element = result.find(function (p) {
                        return p.選手名 === current.選手名
                    })
                    if (element) {
                        // TODO:map?
                        element.打席数 = element.打席数 ? element.打席数 : 0
                        element.打数 = element.打数 ? element.打数 : 0
                        element['1塁打'] = element['1塁打'] ? element['1塁打'] : 0
                        element['2塁打'] = element['2塁打'] ? element['2塁打'] : 0
                        element['3塁打'] = element['3塁打'] ? element['3塁打'] : 0
                        element.本塁打 = element.本塁打 ? element.本塁打 : 0
                        element.打点 = element.打点 ? element.打点 : 0
                        element.得点 = element.得点 ? element.得点 : 0
                        element.四球 = element.四球 ? element.四球 : 0
                        element.死球 = element.死球 ? element.死球 : 0
                        element.三振 = element.三振 ? element.三振 : 0
                        element.併殺打 = element.併殺打 ? element.併殺打 : 0
                        element.犠飛 = element.犠飛 ? element.犠飛 : 0
                        element.犠打 = element.犠打 ? element.犠打 : 0
                        element.盗塁 = element.盗塁 ? element.盗塁 : 0
                        element.牽制死 = element.牽制死 ? element.牽制死 : 0
                        element.失策出 = element.失策出 ? element.失策出 : 0
                        element.塁打数 = element.塁打数 ? element.塁打数 : 0
                        element.ランナー1塁 = element.ランナー1塁 ? element.盗ランナー1塁塁 : 0
                        element.進塁打 = element.進塁打 ? element.進塁打 : 0

                        // element.試合 += current.試合
                        element.打席数 += current.打席数 ? current.打席数 : 0
                        element.打数 += current.打数 ? current.打数 : 0
                        element['1塁打'] += current['1塁打'] ? current['1塁打'] : 0
                        element['2塁打'] += current['2塁打'] ? current['2塁打'] : 0
                        element['3塁打'] += current['3塁打'] ? current['3塁打'] : 0
                        element['本塁打'] += current['本塁打'] ? current['本塁打'] : 0
                        element.打点 += current.打点 ? current.打点 : 0
                        element.得点 += current.得点 ? current.得点 : 0
                        element.四球 += current.四球 ? current.四球 : 0
                        element.死球 += current.死球 ? current.死球 : 0
                        element.三振 += current.三振 ? current.三振 : 0
                        element.併殺打 += current.併殺打 ? current.併殺打 : 0
                        element.犠飛 += current.犠飛 ? current.犠飛 : 0
                        element.犠打 += current.犠打 ? current.犠打 : 0
                        element.盗塁 += current.盗塁 ? current.盗塁 : 0
                        element.牽制死 += current.牽制死 ? current.牽制死 : 0
                        element.失策出 += current.失策出 ? current.失策出 : 0
                        element.塁打数 += current.塁打数 ? current.塁打数 : 0
                        element.ランナー1塁 += current.ランナー1塁 ? current.ランナー1塁 : 0
                        element.進塁打 += current.進塁打 ? current.進塁打 : 0
                    } else {
                        result.push({
                            選手名: current.選手名,
                            // 試合: current.試合,
                            打席数: current.打席数,
                            打数: current.打数,
                            本塁打: current['1塁打'],
                            本塁打: current['2塁打'],
                            本塁打: current['3塁打'],
                            本塁打: current.本塁打,
                            打点: current.打点,
                            得点: current.得点,
                            四球: current.四球,
                            死球: current.死球,
                            三振: current.三振,
                            併殺打: current.併殺打,
                            犠飛: current.犠飛,
                            犠打: current.犠打,
                            盗塁: current.盗塁,
                            牽制死: current.牽制死,
                            失策出: current.失策出,
                            塁打数: current.塁打数,
                            ランナー1塁: current.ランナー1塁,
                            進塁打: current.進塁打
                        })
                    }
                    return result
                }, [])
                this.mainData = sumOffenceData
                this.showData = sumOffenceData
                console.log(sumOffenceData)
                this.mainData = statistic(sumOffenceData)
                // this.oldData = statistic(sumOffenceData)
            })
        }
    }
};


function statistic(mainData) {
    for (let i = 0; i < mainData.length; i++) {
        const dasu = mainData[i]["打数"]
        const shishi = mainData[i]["四球"] + mainData[i]["死球"]
        mainData[i]["安打"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] + mainData[i]["3塁打"] + mainData[i]["本塁打"]
        mainData[i]["塁打数"] = mainData[i]["1塁打"] + mainData[i]["2塁打"] * 2 + mainData[i]["3塁打"] * 3 + mainData[i]["本塁打"]* 4
        mainData[i]["打率"] = (mainData[i]["安打"] / dasu).toFixed(3)
        mainData[i]["三割(4打数)"] = calculate_tree_ratio(mainData[i]["安打"], dasu)
        mainData[i]["出塁率"] = (mainData[i]["安打"] + shishi) / (dasu + shishi + mainData[i]["犠飛"] + mainData[i]["犠打"])
        mainData[i]["長打率"] = mainData[i]["塁打数"] / dasu
        mainData[i]["OPS"] = (mainData[i]["長打率"] + mainData[i]["出塁率"]).toFixed(3)
        mainData[i]["選球眼"] = (shishi / mainData[i]["三振"]).toFixed(3)
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

        mainData[i]["wOBA"] = (
            0.692 * mainData[i]["四球"] +
            0.73 * mainData[i]["死球"] +
            0.966 * mainData[i]["失策出"] +
            0.865 * mainData[i]["1塁打"] +
            1.334 * mainData[i]["2塁打"] +
            1.725 * mainData[i]["3塁打"] +
            2.065 * mainData[i]["本塁打"]
        ) / (dasu + shishi + mainData[i]["犠飛"])
        mainData[i]["wOBA"] = mainData[i]["wOBA"] ? mainData[i]["wOBA"] : 0

        mainData[i]["三振率"] = (mainData[i]["三振"] / mainData[i]["打席数"]).toFixed(3)
        mainData[i]["四球率"] = (mainData[i]["四球"] / mainData[i]["打席数"]).toFixed(3)

    }
    calculation_wOBA_avr(mainData)
    return mainData
}

function calculation_wOBA_avr(mainData) {
    let wOBA_avr = 0
    for (let i = 0; i < mainData.length; i++) {
        wOBA_avr += mainData[i]["wOBA"]
    }
    wOBA_avr /= mainData.length
    add_wRAA(mainData, wOBA_avr)
}

function add_wRAA(mainData, wOBA_avr) {
    for (let i = 0; i < mainData.length; i++) {
        mainData[i]["wRAA"] = ((mainData[i]["wOBA"]- wOBA_avr) / 1.24 * mainData[i]["打数"]).toFixed(2)
    }
    findMax(mainData)
    return mainData
}

function calculate_tree_ratio(anda, dasu) {
    let k = 0
    for (k = 0; k <= 4; k++) {
            if( ( (anda + k) / (dasu + 4) ) >= 0.3 ) {
                return (k + '安打')
            }
        }
}

function findMax(mainData) {
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
        "選球眼": [],
        "XR": [],
        "XR27": [],
        "wOBA": [],
        "wRAA": [],
        "ゴロアウト": [],
        "フライアウト": [],
        "打球": [],
        "ランナー1塁": [],
        "進塁打": [],
        "得点圏": [],
        "打球": [],
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
//TODO:何故かminDataと同時にやるとdataListが上書きされる

    let maxData = dataList
    //let minData = dataList
    for (i in dataList) {
        try{
            maxData[i] = Math.max.apply(null, maxData[i])
            //minData[i] = Math.min.apply(null, minData[i])
        } catch(e){
            maxData[i] = 0
            //minData[i] = null
        }
    }
    console.log(maxData)
    // console.log(minData)

    for (let i = 0; i < mainData.length; i++) {
        let k = 0
        let maxItem = {}
        for (k in maxData) {
                if (maxData[k] && mainData[i][k] == maxData[k]) {
                    maxItem[k] = 'info'
                }
                mainData[i]['_cellVariants'] = maxItem
        }
    }
    return maxData
}

</script>
<style>
#offence-show .table-responsive {
    font-size: .5rem;
}
#offence-show .VueTables__columns-dropdown-wrapper {
  display: flex;
}
#offence-show .pull-right>.dropdown-menu {
  left: 0;
  right: auto;
}

th {
  background-color: #42b983;
  color: white;
  min-width: 4rem;
  text-align: center;
}
td {
  text-align: center;
}

/*tableの最左列固定*/
th:first-child,
td:first-child {
  position: sticky;
  left: 0;
  z-index: 100;
}
tbody tr:nth-child(2n) td:first-child {
  background: white;
}
tbody tr:nth-child(2n+1) td:first-child {
  background: #f9f9f9;
}
.table-hover>tbody>tr:hover,
.table-hover>tbody>tr:hover td,
.table-hover>tbody>tr:active td {
  background-color: #bfbaba;
}
.vdp-datepicker__calendar {
    z-index: 99999 !important;
}
/* TODO:ちゃんと非表示にする */
.VueTables__limit-field,
.VueTables__search {
    display: none  !important;
}
</style>