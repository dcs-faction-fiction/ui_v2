<template>
  <div id="app">
    <JWT/>
    <FactionMain/>

    <div id="campaign-manager" v-if="showCamapignManager">
      <CreateCampaign/>
      <AddFactionToCampaign/>
    </div>
  </div>
</template>

<script>
import {getToken} from '@/lib/api_fetch.js';
import JWT from './components/JWT.vue';
import FactionMain from './components/faction/FactionMain.vue';
import CreateCampaign from './components/campaign/CreateCampaign.vue';
import AddFactionToCampaign from './components/campaign/AddFactionToCampaign.vue';

export default {
  name: 'App',
  data() {
    return {
      showCamapignManager: false
    }
  },
  components: {
    JWT,
    FactionMain,
    CreateCampaign,
    AddFactionToCampaign
  },
  created() {
    var token = getToken();
    this.showCamapignManager = token.isCampaignManager;
  }
}
</script>

<style>
#app {
}
</style>
