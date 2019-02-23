<template>
  <div id="offence-show">
    <ul>
        <button v-on:click="changeTabu('old')" v-bind:class="{'active': isActive === 'old'}" class="btn btn-primary">打撃成績トータル</button>
        <button v-on:click="changeTabu('current')" v-bind:class="{'active': isActive === 'current'}" class="btn btn-primary">打撃成績今シーズン</button>
    </ul>
    <v-client-table :columns="columns" :data="showData" :options="options" class="table-striped table-sm table-condensed">
    </v-client-table>
  </div>
</template>

<script>
import firebase from "firebase";
import Vue from 'vue'
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
Vue.use(ClientTable);

const columns = [
    "選手名",
    "三振率",
    "四球率",
    "選球眼",
    "XR",
    "XR27",
    "wOBA",
    "wRAA",
    "試合",
    "打席数",
    "打数",
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
    "打率",
    "出塁率",
    "長打率",
    "OPS",
    "得点圏打率",
    "ランナー1塁",
    "進塁打"
]
export default {
    name: "offence-show",
    mounted() {
        const allRawData = firebase.database().ref("records");
        console.log('offenceData')
        console.log(allRawData)
        let offenceDataList = []
        allRawData.on('value', (snapshot) => {
            offenceData = snapshot.val()
            console.log('offenceData')
            console.log(offenceData)
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
                filterByColumn: true,
                // dateColumns: ["試合日"],
                // datepickerOptions:{ locale: { cancelLabel: 'Clear' } }
                //highlightMatches: true
                //headings: {
                //    選手名: 'id',
                //    試合: '名前',
                //    打席数: 'メールアドレス'
                //},
                //headingsTooltips: {'選手名':'Expanded Title', '試合':'Expanded Title'}
            }
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
            }
    }
};
</script>