<template>
  <div>
    <UnitMap :situation="situation"/>
  </div>
</template>

<script>
import { getFactionSituation, getCampaignGameOptions } from '@/lib/api_fetch.js';
import UnitMap from './UnitMap.vue';

export default {
  components: {
    UnitMap
  },
  props: {
    selectedFaction: {},
    selectedCampaign: {}
  },
  data() {
    return {
      situation: {},
      gameOptions: {}
    };
  },
  methods: {
    reloadSituation() {
      if (!this.selectedFaction || !this.selectedCampaign)
        return

      getFactionSituation(this.selectedCampaign, this.selectedFaction, s => this.situation = s);
      getCampaignGameOptions(this.selectedCampaign, this.selectedFaction, s => this.gameOptions = s);
    }
  },
  watch: {
    selectedFaction() {
      this.reloadSituation()
    },
    selectedCampaign() {
      this.reloadSituation()
    }
  }
}
</script>

<style>
</style>
