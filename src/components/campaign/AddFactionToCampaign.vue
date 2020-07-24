<template>
  <div id="add-faction-to-campaign">
    Add faction to campaign: <br/>
    Faction:
    <input type="text" v-model="factionName" placeholder="Faction name"/>
    Airbase:
    <select v-model="airbase">
      <option v-for="a in AIRBASES" :key="a" :value="a">{{a}}</option>
    </select>
    Coalition:
    <select v-model="coalition">
      <option v-for="a in COALITIONS" :key="a" :value="a">{{a}}</option>
    </select>
    <button @click="addToCampaign">ADD</button>
  </div>
</template>

<script>
import {addFactionToCampaign} from '@/lib/api_fetch.js';
import { AIRBASES, COALITIONS } from '@/lib/constants.js';

export default {
  props: {
    campaignName: {}
  },
  data() {
    return {
      COALITIONS: COALITIONS,
      AIRBASES: AIRBASES,
      factionName: null,
      airbase: null,
      coalition: "BLUE"
    }
  },
  watch: {
    campaigns(val) {
      if (!this.campaignName && val && val.length > 0)
        this.campaignName = val[0].name
    }
  },
  methods: {
    addToCampaign() {
      addFactionToCampaign(this.campaignName, {
        faction: this.factionName,
        airbase: this.airbase,
        coalition: this.coalition
      }, () => {});
    }
  }
}
</script>

<style>
#add-faction-to-campaign {
  border: solid 1px black;
}
</style>
