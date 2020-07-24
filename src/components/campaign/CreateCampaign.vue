<template>
  <div id="add-campaign">
    Create new campaign with defaults:
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    <div v-for="(f, index) in factions" :key="index">
      Faction:
      <input type="text" v-model="f.faction" placeholder="Faction name to add to campaign"/>
      Airbase:
      <select v-model="f.airbase">
        <option v-for="a in AIRBASES" :key="a" :value="a">{{a}}</option>
      </select>
      Coalition:
      <select v-model="f.coalition">
        <option v-for="a in COALITIONS" :key="a" :value="a">{{a}}</option>
      </select>
    </div>
    <button @click="createCampaign">CREATE</button>
  </div>
</template>

<script>
import { getDefaultGameOptions, createCampaign } from '@/lib/api_fetch.js';
import { AIRBASES, COALITIONS } from '@/lib/constants.js';

export default {
  data() {
    return {
      AIRBASES: AIRBASES,
      COALITIONS: COALITIONS,
      factions: [{coalition: "BLUE"}, {coalition: "BLUE"}, {coalition: "RED"}, {coalition: "RED"}],
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
        }, () => this.$parent.reloadCampaigns());
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
