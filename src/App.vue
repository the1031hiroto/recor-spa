<template>
  <div id="app" class="container-fluid">
    <h1>成績管理アプリ</h1>
    <router-view/>
    <p>Menu</p>
    <div class="bd-example">
      <router-link tag="button" to="/offence-add" class="btn btn-outline-success mx-1 btn-sm">打撃追加</router-link>
      <router-link tag="button" to="/deffence-add" class="btn btn-outline-success mx-1 btn-sm">守備追加</router-link>
      <router-link tag="button" to="/offence-show" class="btn btn-outline-success mx-1 btn-sm">打撃成績</router-link>
      <router-link tag="button" to="/deffence-show" class="btn btn-outline-success mx-1 btn-sm">守備成績</router-link>
    </div>
  </div>
</template>