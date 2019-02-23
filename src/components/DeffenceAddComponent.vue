<template>
    <div id="deffence-add-component">
        <h3>{{ deffence.name }}</h3>
        <select v-model="position">
            <option v-for="positionOption in this.positionOptions" v-bind:value="positionOption.value">
                {{ positionOption.text }}
            </option>
        </select>
        <button v-on:click="deffence.killSupportCount++">捕殺 {{ deffence.killSupportCount }} 回</button>
        <button v-on:click="deffence.killCount++">刺殺 {{ deffence.killCount }} 回</button>
        <button v-on:click="deffence.errorCount++">エラー {{ deffence.errorCount }} 回</button>
        <div v-html="deffence.content"></div>
        <button @click="subumitDeffence">submit</button>
    </div>
</template>

<script>
import firebase from "firebase";

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
            result = {
                "試合日": today.toLocaleDateString(),
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
#deffence-add-component {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    align-items: center;
}
#deffence-add-component h3 {
    flex: 0 1 10rem;
}
</style>