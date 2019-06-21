<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import appHeader from './components/Header';

  export default {
    components: {
      appHeader
    }
  };
</script>

<style>
  #app {
    font-family: Roboto, Helvetica, "sans-serif";
    max-width: 900px;
    margin: 0 auto;
  }
</style>
