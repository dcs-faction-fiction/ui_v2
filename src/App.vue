<template>
  <div id="app">
    <JWT/>

    <div id="faction-manager" v-if="isFactionManager">
      <FactionPanel/>
    </div>

    <a id="campaign-manager-link" @click="toggleCampaignManager" v-if="isCampaignManager">Campaign manager</a>
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
      isFactionManager: false,
      isCampaignManager: false,
      showCamapignManager: false
    }
  },
  methods: {
    toggleCampaignManager() {
      if (this.isCampaignManager)
        this.showCamapignManager = ! this.showCamapignManager
    }
  },
  components: {
    JWT,
    FactionPanel,
    CampaignPanel
  },
  created() {
    var token = getToken();
    this.isFactionManager = token.isFactionManager;
    this.isCampaignManager = token.isCampaignManager;
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {
}
#campaign-manager {
  background: white;
  position: absolute;
  bottom: 1em;
  width: 700px;
  margin: 0;
  padding: 0;
  border: 0;
}
#campaign-manager-link {
  position: absolute;
  background: white;
  bottom: 0;
  color: blue;
  text-decoration: underline;
}
</style>
