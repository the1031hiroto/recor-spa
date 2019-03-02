<template>
    <div id="deffence-add-component" class="d-flex justify-content-between flex-wrap border-bottom my-2 py-2">
        <h5 class="mt-2">{{ deffence.name }}</h5>
        <select v-model="position" class="custom-select mb-2">
            <option v-for="positionOption in this.positionOptions" v-bind:value="positionOption.value">
                {{ positionOption.text }}
            </option>
        </select>
        <button v-on:click="deffence.killSupportCount++" type="button" class="btn btn-outline-secondary my-1">捕殺 {{ deffence.killSupportCount }} 回</button>
        <button v-on:click="deffence.killCount++" type="button" class="btn btn-outline-secondary my-1">刺殺 {{ deffence.killCount }} 回</button>
        <button v-on:click="deffence.errorCount++" type="button" class="btn btn-outline-secondary my-1">エラー {{ deffence.errorCount }} 回</button>
        <button @click="subumitDeffence" type="button" class="btn btn-outline-primary my-1">submit</button>
    </div>
</template>

<script>
import firebase from "firebase";
import moment from 'moment'

export default {
    name: "deffence-add-component",
    mounted() {
        const allRawDeffenceData = firebase.database().ref("/deffence");
        allRawDeffenceData.on('value', (snapshot) => {
            this.deffenceData = snapshot.val()
        })
    },
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
            ],
            deffenceData: 0
        };
    },
    props: ['deffence', 'position'],
    methods: {
        subumitDeffence: function () {
            const today = new Date()
            let result = {
                "試合日": moment(today).format('YYYY/MM/DD'),
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
/* TODO:bootstrap */
    #deffence-add button {
        font-size: .8rem;
    }
    #deffence-add select {
        width: 16rem;
    }
</style>