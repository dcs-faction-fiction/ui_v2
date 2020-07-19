<template>
  <div id="add-faction-to-campaign">
    Add faction to campaign: <br/>
    Campaign: 
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    Faction:
    <input type="text" v-model="faction.faction" placeholder="Faction name"/>
    Airbase:
    <select v-model="faction.airbase">
      <option v-for="a in AIRBASES" :key="a" :value="a">{{a}}</option>
    </select>
    <button @click="addToCampaign">ADD</button>
  </div>
</template>

<script>
import addFactionToCampaign from '@/lib/api_fetch.js';
import { AIRBASES } from '@/lib/constants.js';

export default {
  data() {
    return {
      AIRBASES: AIRBASES,
      faction: {},
      campaignName: ""
    }
  },
  methods: {
    addToCampaign() {
      addFactionToCampaign(this.campaignName, this.faction, () => {});
    }
  }
}
</script>

<style>
#add-faction-to-campaign {
  border: solid 1px black;
}
</style>
