<template>
  <div id="add-campaign">
    Create empty campaign with defaults:
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    <div v-for="(f, index) in factions" :key="index">
      Faction:
      <input type="text" v-model="f.faction" placeholder="Faction name to add to campaign"/>
      Airbase:
      <select v-model="f.airbase">
        <option v-for="a in AIRBASES" :key="a" :value="a">{{a}}</option>
      </select>
    </div>
    <button @click="createCampaign">CREATE</button>
  </div>
</template>

<script>
import { getDefaultGameOptions, createCampaign } from '@/lib/api_fetch.js';
import { AIRBASES } from '@/lib/constants.js';

export default {
  data() {
    return {
      AIRBASES: AIRBASES,
      factions: [{}, {}, {}, {}],
      campaignName: "",
      defaultGameOptions: {}
    }
  },
  methods: {
    createCampaign() {
      var factionsToAdd = this.factions.filter(i => i.faction && i.airbase);
      getDefaultGameOptions(opt => {
        createCampaign({
          name: this.campaignName,
          factions: factionsToAdd,
          gameOptions: opt
        }, () => {});
      });
    }
  }
}
</script>

<style>
#add-campaign {
  border: solid 1px black;
}
</style>
