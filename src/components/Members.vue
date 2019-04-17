<template>
    <div id="members">
        <h2>選手名：{{ this.$route.params.name }}</h2>
        <div id="target" :style="{ 'background-image': 'url(' + assetsImage + ')' }">
            <font-awesome-icon icon="map-pin" v-for="(ball, index) in pinList"
            :key="index"
            :style="{ top: ball.y, left: ball.x}"
            :class="{ 'text-warning': ball['フライアウト'], 'text-danger': ball['ゴロアウト'], 'text-white': ball['ヒット'] }"
            class="pin" />
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';

export default {
    name: "members",
    mounted() {
        this.getData(1000)
    },
    data() {
        return {
            pinList: [],
            assetsImage: "/ground.jpg"
        }
    },
    methods: {
        getData: function(){
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
                this.pinList = pinList
            })
        },
    }
}
</script>

<style>
#target {
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