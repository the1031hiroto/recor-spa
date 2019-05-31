<template>
    <div id="pitcher-show">
        <h2>{{this.$route.params.team}}<br>投手成績</h2>
        <b-table :items="pitcherData" :fields="columns" :sort-by.sync="sortBy" striped hover responsive small />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

const dataColumns = [
    "被安打",
    "本塁打",
    "与四球",
    "与死球",
    "ゴロアウト",
    "フライアウト",
    "奪三振",
    "併殺打",
    "失策出"
]

export default {
    name: "pitcher-show",
    mounted() {
        this.getData()
    },
    data() {
        return {
            columns: [
                { key: '選手名', sortable: true },
                { key: '投球回', sortable: true },
                { key: '被安打', sortable: true },
                { key: '本塁打', sortable: true },
                { key: '与四球', sortable: true },
                { key: '与死球', sortable: true },
                { key: 'ゴロアウト', sortable: true },
                { key: 'フライアウト', sortable: true },
                { key: '奪三振', sortable: true },
                { key: '失策出', sortable: true },
                { key: 'WHIP', sortable: true },
                { key: 'FIP', sortable: true }
            ],
            sortBy: '選手名',
            pitcherData: [],
        };
    },
    computed: {
        currentTeam: function() {
            return this.$store.getters.currentTeam;
        }
    },
    methods: {
        getData: function(){
            const team = this.currentTeam['uid']
            const directory = '/pitcher'
            const allRawpitcherData = firebase.database().ref(team + directory)
            let pitcherDataList = []
            allRawpitcherData.on('value', (snapshot) => {
                const pitcherData = snapshot.val()
                Object.keys(pitcherData).forEach(function (k, i) {
                    pitcherDataList[i] = pitcherData[k]
                })
                this.pitcherData  = pitcherDataList.reduce(function (result, current) {
                    result.map(item => Object.entries(item).map(([key, value]) => item[key] = value || 0));
                    let element = result.find(item => item['選手名'] === current['選手名']);

                    if (element) {
                        dataColumns.map(item => { element[item] += current[item] ? current[item] : 0 });
                    } else {
                        let data = { '選手名' : current['選手名'] }
                        dataColumns.forEach(item => { data[item] = current[item] ? current[item] : 0 });
                        result.push(data)
                    }
                    return result
                }, [])

                this.pitcherData .map(item => {
                    const ining = (item['ゴロアウト'] + item['フライアウト'] + item['奪三振'] + (item['併殺打'] * 2)) / 3
                    item['投球回'] = Math.floor(ining * 100) / 100
                    item['WHIP'] = ((item['被安打'] + item['与四球'] + item['与死球']) / item['投球回']).toFixed(3)
                    item['FIP'] = (( item['本塁打'] * 13 + ( item['与四球'] + item['与死球'] ) * 3 - ( item['奪三振'] * 2 )) / ( item['投球回'] + 3.12 )).toFixed(3)
                });
            })
        }
    },
    beforeRouteUpdate (to, from , next) {
        this.getData()
        next()
    }
}
</script>