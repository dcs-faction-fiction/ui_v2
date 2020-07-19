<template>
  <div id="app">
    <JWT/>
    <FactionMain/>

    <CreateCampaign/>
  </div>
</template>

<script>
import JWT from './components/JWT.vue';
import FactionMain from './components/faction/FactionMain.vue';
import CreateCampaign from './components/campaign/CreateCampaign.vue';

export default {
  name: 'App',
  components: {
    JWT,
    FactionMain,
    CreateCampaign
  }
}
</script>

<style>
#app {
}
</style>
