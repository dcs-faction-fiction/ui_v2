<template>
  <div id="app">
    <JWT/>

    <div id="campaign-manager" v-if="showFactionManager">
      <FactionMain/>
    </div>

    <div id="campaign-manager" v-if="showCamapignManager">
      <CreateCampaign/>
      <AddFactionToCampaign/>
      <GiveCredits/>
    </div>
  </div>
</template>

<script>
import {getToken} from '@/lib/api_fetch.js';
import JWT from './components/JWT.vue';
import FactionMain from './components/faction/FactionMain.vue';
import CreateCampaign from './components/campaign/CreateCampaign.vue';
import AddFactionToCampaign from './components/campaign/AddFactionToCampaign.vue';
import GiveCredits from './components/campaign/GiveCredits.vue';

export default {
  name: 'App',
  data() {
    return {
      showFactionManager: false,
      showCamapignManager: false
    }
  },
  components: {
    JWT,
    FactionMain,
    CreateCampaign,
    AddFactionToCampaign,
    GiveCredits
  },
  created() {
    var token = getToken();
    this.showFactionManager = token.isFactionManager;
    this.showCamapignManager = token.isCampaignManager;
  }
}
</script>

<style>
#app {
}
</style>
