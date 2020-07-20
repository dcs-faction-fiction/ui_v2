<template>
  <div id="add-faction-to-campaign">
    Add credits to faction: <br/>
    Campaign:
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    Faction:
    <input type="text" v-model="factionName" placeholder="Faction name"/>
    Credits:
    <input type="text" v-model="credits" placeholder="credits"/>
    <button @click="addCredits">ADD</button>
  </div>
</template>

<script>
import {giveCredits} from '@/lib/api_fetch.js';

export default {
  data() {
    return {
      factionName: "",
      campaignName: "",
      credits: 0
    }
  },
  methods: {
    addCredits() {
      giveCredits(this.campaignName, this.factionName, this.credits, () => {});
    }
  }
}
</script>

<style>
#add-faction-to-campaign {
  border: solid 1px black;
}
</style>
