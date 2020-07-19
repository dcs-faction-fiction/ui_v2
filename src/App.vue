<template>
  <div id="app">
    <JWT/>
    <FactionMain/>
  </div>
</template>

<script>
import JWT from './components/JWT.vue';
import FactionMain from './components/faction/FactionMain.vue';

export default {
  name: 'App',
  components: {
    JWT,
    FactionMain
  }
}
</script>

<style>
#app {
}
</style>
