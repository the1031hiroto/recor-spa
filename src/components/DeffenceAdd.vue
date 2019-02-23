<template>
    <div id="deffence-add">
        <deffence-add-component
            v-for="deffence in deffences"
            v-bind:key="deffence.id"
            v-bind:deffence="deffence"
        ></deffence-add-component>
    </div>
</template>

<script>
import firebase from "firebase";
import Vue from 'vue'
import DeffenceAddComponent from './DeffenceAddComponent.vue'

export default {
    components: {
        DeffenceAddComponent,
    },
    name: "deffence-add",
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
        };
    }
};
</script>