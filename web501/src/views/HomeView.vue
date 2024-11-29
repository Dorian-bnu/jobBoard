<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <HomePage />
</template>

<script>
import HomePage from '../components/HomePage.vue';
export default {
  name: 'App',
  components: {
    HomePage,
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

h1 {
  color: #42b983;
}
</style>
