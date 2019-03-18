<template>
  <div id="app" class="container-fluid">
    <router-view/>
    <div class="bd-example my-4">
      <p>Menu</p>
      <router-link tag="button" to="/offence-add" class="btn btn-outline-success mx-1 btn-sm">打撃追加</router-link>
      <router-link tag="button" to="/deffence-add" class="btn btn-outline-success mx-1 btn-sm">守備追加</router-link>
      <router-link tag="button" to="/offence-show" class="btn btn-outline-success mx-1 btn-sm">打撃成績</router-link>
      <router-link tag="button" to="/deffence-show" class="btn btn-outline-success mx-1 btn-sm">守備成績</router-link>
    </div>
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