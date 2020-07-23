<template>
  <div id="app">
    <JWT/>

    <div id="campaign-manager" v-if="showFactionManager">
      <FactionPanel/>
    </div>

    <div id="campaign-manager" v-if="showCamapignManager">
      <CampaignPanel/>
    </div>
  </div>
</template>

<script>
import {getToken} from '@/lib/api_fetch.js';
import JWT from './components/JWT.vue';
import FactionPanel from './components/faction/FactionPanel.vue';
import CampaignPanel from './components/campaign/CampaignPanel.vue';

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
    FactionPanel,
    CampaignPanel
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
