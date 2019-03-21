<template>
  <div id="app" class="container-fluid">
    <router-view/>
    <router-link tag="button" to="/" class="btn btn-outline-success mx-1 btn-sm">Home</router-link>
  </div>
</template>
<style>
table {
    font-size: .5rem;
}
table th {
    background-color: #42b983;
    color: white;
    text-align: center !important;
}
</style>