<template>
    <div id="members" class="container-fluid">
        <div class="row">
            <h2>選手名：{{ this.$route.params.name }}</h2>
        </div>
        <div class="row">
            <div class="col-12">
                <h3>打球位置</h3>
            </div>
            <div class="col-3">
                <font-awesome-icon icon="map-pin" class="text-white bg-dark" /><span>:ヒット</span>
            </div>
            <div class="col-5">
                <font-awesome-icon icon="map-pin" class="text-warning" /><span>:フライアウト</span>
            </div>
            <div class="col-4">
                <font-awesome-icon icon="map-pin" class="text-danger" /><span>:ゴロアウト</span>
            </div>
            <div class="target col-12" :style="{ 'background-image': 'url(' + assetsImage + ')' }">
                <font-awesome-icon icon="map-pin" v-for="(ball, index) in offencePinList"
                :key="index"
                :style="{ top: ball.y, left: ball.x}"
                :class="{ 'text-warning': ball['フライアウト'], 'text-danger': ball['ゴロアウト'], 'text-white': ball['ヒット'] }"
                class="pin" />
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h3>捕球位置</h3>
            </div>
            <div class="col-4">
                <font-awesome-icon icon="map-pin" class="text-danger" /><span>:捕球位置</span>
            </div>
            <div class="target col-12" :style="{ 'background-image': 'url(' + assetsImage + ')' }">
                <font-awesome-icon icon="map-pin" v-for="(ball, index) in deffencePinList"
                :key="index"
                :style="{ top: ball.y, left: ball.x}"
                class="pin" />
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

export default {
    name: "members",
    mounted() {
        this.getOffenceData()
        this.getDeffenceData()
    },
    data() {
        return {
            offencePinList: [],
            deffencePinList: [],
            assetsImage: "/ground.jpg"
        }
    },
    methods: {
        getOffenceData: function(){
            const team = 'WSKf7MiSevOyeMp6y7iorZyt4pk2'
            const directory = '/offence'
            const allRawData = firebase.database().ref(team + directory)
            let offenceDataList = []
            allRawData.on('value', (snapshot) => {
                const offenceData = snapshot.val()
                Object.keys(offenceData).forEach(function (k, i) {
                    offenceDataList[i] = offenceData[k]
                })
                const Aname = this.$route.params.name
                let pins = []
                let pinList = offenceDataList.reduce(function (result, current) {
                    if (current['選手名']=== Aname && current['打球'] && current['打球']['x']) {
                        // const x = current['打球']['x'] ;
                        // const y = current['打球']['y'] ;
                        // $('#map-pin').offset({ top: x, left: y });
                        if (current['フライアウト']) {
                            current['打球']['フライアウト'] = true
                        } else if (current['ゴロアウト']) {
                            current['打球']['ゴロアウト'] = true
                        } else if (current['1塁打'] || current['2塁打'] || current['3塁打'] || current['本塁打']) {
                            current['打球']['ヒット'] = true
                        }

                        pins.push(current['打球'])
                    }
                    return pins
                }, [])
                this.offencePinList = pinList
            })
        },
        getDeffenceData: function(){
            const team = 'WSKf7MiSevOyeMp6y7iorZyt4pk2'
            const directory = '/deffence'
            const allRawData = firebase.database().ref(team + directory)
            let dataList = []
            allRawData.on('value', (snapshot) => {
                const data = snapshot.val()
                Object.keys(data).forEach(function (k, i) {
                    dataList[i] = data[k]
                })
                const Aname = this.$route.params.name
                let pins = []
                let pinList = dataList.reduce(function (result, current) {
                    if (current['選手名']=== Aname && current['打球'] && current['打球']['x']) {
                        pins.push(current['打球'])
                    }
                    return pins
                }, [])
                this.deffencePinList = pinList
            })
        },
    }
}
</script>

<style>
.target {
    position: relative;
    width: 92vw;
    height: 40vh;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    text-align: center;
    color: red;
}
.pin{
    position: absolute;
    top: 73%;
    left: 47%;
    font-size: 2rem;
}
</style>