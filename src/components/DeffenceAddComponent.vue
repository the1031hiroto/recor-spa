<template>
    <!-- <div id="deffence-add-component" class="row border-bottom my-2 py-2"> -->
    <form id="deffence-add-component" @submit.prevent="subumitDeffence" class="row border-bottom my-2 py-2">
        <div class="col-5">
            <h5 class="mt-2">{{ deffence.name }}</h5>
        </div>
        <div class="col-7 form-group">
            <select v-model="position" class="custom-select">
                <option v-for="(positionOption, index) in positionOptions" :value="positionOption.value" :key="index">
                    {{ positionOption.text }}
                </option>
            </select>
        </div>
        <div class="col-4 my-1">
            <button v-on:click="deffence.killSupportCount++" type="button" class="btn btn-outline-secondary btn-sm">捕殺:{{ deffence.killSupportCount }}回</button>
        </div>
        <div class="col-4 my-1">
            <button v-on:click="deffence.killCount++" type="button" class="btn btn-outline-secondary btn-sm">刺殺:{{ deffence.killCount }}回</button>
        </div>
        <div class="col-4 my-1">
            <button v-on:click="deffence.errorCount++" type="button" class="btn btn-outline-secondary btn-sm">エラー:{{ deffence.errorCount }}回</button>
        </div>

        <div id="target" class="col-12" @click="getClickPosition" :style="{ 'background-image': 'url(' + assetsImage + ')' }"><font-awesome-icon icon="map-pin" id="map-pin" /></div>

        <div class="col-12 my-1 float-right">
                <div class="float-right">
                <button type="submit" class="btn btn-outline-primary">追加</button>
            </div>
        </div>
    </form>
    <!-- </div> -->
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import moment from 'moment'
import $ from 'jquery'

export default {
    name: "deffence-add-component",
    props: ['deffence'],
    data() {
        return {
            position: '',
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
            onBallX: "",
            onBallY: "",
            assetsImage: "/ground.jpg"
        };
    },
    computed: {
        currentUser: function() {
            return this.$store.getters.user;
        },
    },
    methods: {
        subumitDeffence: function () {
            let result = {
                "試合日": moment(new Date()).format('YYYY/MM/DD'),
                "ポジション": this.position,
                "捕殺": this.deffence.killSupportCount,
                "刺殺": this.deffence.killCount,
                "エラー": this.deffence.errorCount,
                "選手名": this.deffence.name,
                "打球": {
                    x: this.onBallX,
                    y: this.onBallY
                }

            }
            const team = this.currentUser['uid']
            const directory = '/deffence'
            const commentsRef = firebase.database().ref(team + directory)
            commentsRef.push(result)

            this.deffence.killCount = 0
            this.deffence.killSupportCount = 0
            this.deffence.errorCount = 0
            this.onBallX = 0
            this.onBallY = 0
        },
        getClickPosition: function (e) {
            // ページ内クリック位置にピン表示
            $('#map-pin').offset({ top: e.pageY, left: e.pageX })

            // 要素の位置を取得
            const clientRect = document.getElementById( "target" ).getBoundingClientRect()
            const positionX = clientRect.left + window.pageXOffset
            const positionY = clientRect.top + window.pageYOffset

            // 要素内クリック位置
            if (e.clientX) {
                this.onBallX = e.clientX - positionX
                this.onBallY = e.clientY - positionY
            }
        }
    },
};
</script>
