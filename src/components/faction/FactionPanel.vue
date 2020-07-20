<template>
  <div>
    Available credits: {{situation.credits}}
    <FactionZone :situation="situation"/>
    <Warehouse :situation="situation" :gameOptions="gameOptions"/>
    <BuyUnit :situation="situation" :gameOptions="gameOptions"/>
    <UnitMap :situation="situation"/>
  </div>
</template>

<script>
import { getFactionSituation, getCampaignGameOptions } from '@/lib/api_fetch.js';
import Warehouse from './Warehouse.vue';
import BuyUnit from './BuyUnit.vue';
import UnitMap from './UnitMap.vue';
import FactionZone from './FactionZone.vue';

export default {
  components: {
    Warehouse,
    BuyUnit,
    UnitMap,
    FactionZone
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
