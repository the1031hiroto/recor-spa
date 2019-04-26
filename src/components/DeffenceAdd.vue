<template>
    <div id="deffence-add" class="container-fluid">
        <h2>守備追加</h2>
        <deffence-add-component
            v-for="deffence in deffences"
            :key="deffence.id"
            v-bind:deffence="deffence"
        ></deffence-add-component>
    </div>
</template>

<script>
import DeffenceAddComponent from './DeffenceAddComponent.vue'
import firebase from 'firebase/app';
import 'firebase/database';

export default {
    components: {
        DeffenceAddComponent,
    },
    name: "deffence-add",
    mounted() {
        this.getMembers()
    },
    data() {
        return {
            deffences: [],
        };
    },
    computed: {
        currentUser: function() {
            return this.$store.getters.user;
        },
    },
    methods: {
        getMembers: function () {
            const team = this.currentUser['uid']
            const directory = '/members'
            const membersList = firebase.database().ref(team + directory)
            membersList.on('value', (snapshot) => {
                const members = Object.entries(snapshot.val()).map(([key, value]) => ({
                    '背番号': key,
                    'name': value['選手名'],
                    'killSupportCount': 0,
                    'killCount': 0,
                    'errorCount': 0
                }))

                this.deffences = members
            })
        }
    }
};
</script>