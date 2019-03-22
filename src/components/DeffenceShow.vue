<template>
    <div id="deffence-show">
        <h2>守備成績</h2>
        <b-table :items="deffenceData" :fields="columns" :sort-by.sync="sortBy" striped hover responsive small />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

export default {
    name: "deffence-show",
    mounted() {
        this.getData()
    },
    data() {
        return {
            columns: [
                { key: '選手名', sortable: true },
                { key: '刺殺', sortable: true },
                { key: '捕殺', sortable: true },
                { key: 'エラー', sortable: true },
                { key: '守備率', sortable: true },
                { key: 'ポジション', sortable: true }
            ],
            sortBy: '選手名',
            deffenceData: [],
        };
    },
    methods: {
        getData: function(){
            const team = this.$route.params.team
            const directory = '/deffence'
            const allRawDeffenceData = firebase.database().ref(team + directory)
            let deffenceDataList = []
            allRawDeffenceData.on('value', (snapshot) => {
                const deffenceData = snapshot.val()
                Object.keys(deffenceData).forEach(function (k, i) {
                    deffenceDataList[i] = deffenceData[k]
                })
                this.deffenceData  = deffenceDataList.reduce(function (result, current) {
                    let element = result.find(item => item['選手名'] === current['選手名'] && item.ポジション === current.ポジション);

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

                this.deffenceData .map(item => { item['守備率'] = ((item['刺殺'] + item['捕殺']) / (item['刺殺'] + item['捕殺'] + item['エラー'])).toFixed(3) });
            })
        }
    },
    watch: {
        '$route' () {
            // TODO: ちゃんとナビゲーションガードする。https://qiita.com/SatohJohn/items/cd7067ac64d8e45da4dd
            this.getData()
        }
    }
};
</script>
