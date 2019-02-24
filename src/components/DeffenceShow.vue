<template>
  <div id="deffence-show">
    <v-client-table :columns="columns" :data="deffenceData" :options="options" class="table-striped table-sm table-condensed">
    </v-client-table>
  </div>
</template>

<script>
import firebase from "firebase";

const deffenceColumns = [
    '選手名',
    "刺殺",
    "捕殺",
    "エラー",
    "守備率",
    "ポジション"
]

export default {
    name: "deffence-show",
      mounted() {
        const allRawDeffenceData = firebase.database().ref("/deffence");
        let deffenceDataList = []
        allRawDeffenceData.on('value', (snapshot) => {
            const deffenceData = snapshot.val()
            Object.keys(deffenceData).forEach(function (k, i) {
                deffenceDataList[i] = deffenceData[k]
            })
            const sumDeffenceData = deffenceDataList.reduce(function (result, current) {
                let element = result.find(function (p) {
                    return p.選手名 === current.選手名 && p.ポジション === current.ポジション
                })
                if (element) {
                    element.刺殺 += current.刺殺
                    element.捕殺 += current.捕殺
                    element.エラー += current.エラー
                } else {
                    result.push({
                        選手名: current.選手名,
                        ポジション: current.ポジション,
                        刺殺: current.刺殺,
                        捕殺: current.捕殺,
                        エラー: current.エラー,
                    })
                }
                return result
            }, [])
            let i  = 0
            for (i in sumDeffenceData) {
                sumDeffenceData[i]['守備率'] = (sumDeffenceData[i]['刺殺'] + sumDeffenceData[i]['捕殺']) / (sumDeffenceData[i]['刺殺'] + sumDeffenceData[i]['捕殺'] + sumDeffenceData[i]['エラー'])
            }
            this.deffenceData = sumDeffenceData
        })
    },
    data() {
        return {
          deffences: [
            { id: 1, name: 'ひろと', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 2, name: '大志', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 3, name: '龍', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 4, name: '達也', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 5, name: '三好', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 6, name: 'バタニキ', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 7, name: '隼人', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 8, name: '先生', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 9, name: 'りょーま', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 10, name: '涼', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 11, name: 'さいち', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 12, name: 'ゆーや', killSupportCount: 0, killCount: 0, errorCount: 0, },
            { id: 13, name: '岡さん', killSupportCount: 0, killCount: 0, errorCount: 0, }
          ],
          position: 0,
          isActive: "current",
          columns: deffenceColumns,
          deffenceData: [],
          options: {
              sortable: deffenceColumns,
              filterByColumn: true,
          }
        };
    }
};
</script>
