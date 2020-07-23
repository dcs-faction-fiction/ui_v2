<template>
  <div id="add-faction-to-campaign">
    Add credits to faction:
    <input type="text" v-model="credits" placeholder="credits"/>
    <button @click="addCredits">ADD</button>
  </div>
</template>

<script>
import {giveCredits} from '@/lib/api_fetch.js';

export default {
  props: {
    campaignName: {},
    factionName: {}
  },
  data() {
    return {
      credits: 0
    }
  },
  watch: {
    campaigns(val) {
      if (!this.campaignName && val && val.length > 0)
        this.campaignName = val[0].name
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
