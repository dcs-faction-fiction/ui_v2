<template>
  <div id="app">
    <JWT/>
    <FactionMain/>

    <CreateCampaign/>
    <AddFactionToCampaign/>
  </div>
</template>

<script>
import JWT from './components/JWT.vue';
import FactionMain from './components/faction/FactionMain.vue';
import CreateCampaign from './components/campaign/CreateCampaign.vue';
import AddFactionToCampaign from './components/campaign/AddFactionToCampaign.vue';

export default {
  name: 'App',
  components: {
    JWT,
    FactionMain,
    CreateCampaign,
    AddFactionToCampaign
  }
}
</script>

<style>
#app {
}
</style>
