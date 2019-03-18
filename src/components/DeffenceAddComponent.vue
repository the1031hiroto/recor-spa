<template>
    <div id="deffence-add-component" class="d-flex justify-content-between flex-wrap border-bottom my-2 py-2">
        <h5 class="mt-2">{{ deffence.name }}</h5>
        <select v-model="position" class="custom-select mb-2">
            <option v-for="(positionOption, index) in this.positionOptions" :value="positionOption.value" :key="index">
                {{ positionOption.text }}
            </option>
        </select>
        <button v-on:click="deffence.killSupportCount++" type="button" class="btn btn-outline-secondary btn-sm my-1">捕殺 {{ deffence.killSupportCount }} 回</button>
        <button v-on:click="deffence.killCount++" type="button" class="btn btn-outline-secondary btn-sm my-1">刺殺 {{ deffence.killCount }} 回</button>
        <button v-on:click="deffence.errorCount++" type="button" class="btn btn-outline-secondary btn-sm my-1">エラー {{ deffence.errorCount }} 回</button>
        <button @click="subumitDeffence" type="button" class="btn btn-outline-primary btn-sm my-1">submit</button>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import moment from 'moment'

export default {
    name: "deffence-add-component",
    data() {
        return {
            positionOptions: [
                { text: 'ポジション', value: '' },
                { text: 'ピッチャー', value: 'ピッチャー' },
                { text: 'キャッチャー', value: 'キャッチャー' },
                { text: '1塁', value: '1塁' },
                { text: '2塁', value: '2塁' },
                { text: 'ショート', value: 'ショート' },
                { text: '3塁', value: '3塁' },
                { text: 'ライト', value: 'ライト' },
                { text: 'センター', value: 'センター' },
                { text: 'レフト', value: 'レフト' }
            ]
        };
    },
    props: ['deffence', 'position'],
    methods: {
        subumitDeffence: function () {
            let result = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "ポジション": this.position,
                "捕殺": this.deffence.killSupportCount,
                "刺殺": this.deffence.killCount,
                "エラー": this.deffence.errorCount,
                "選手名": this.deffence.name

            }
            const directory = '/deffence'
            const commentsRef = firebase.database().ref(directory)
            commentsRef.push(result)

            this.deffence.killCount = 0
            this.deffence.killSupportCount = 0
            this.deffence.errorCount = 0
        }
    },
};
</script>
<style>
#deffence-add select {
    width: 16rem;
}
</style>