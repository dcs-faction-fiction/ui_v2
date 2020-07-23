<template>
  <div>
    <SelectFaction :selection.sync="selectedFaction"/>
    <SelectCampaign :faction="selectedFaction" :selection.sync="selectedCampaign"/>
    
    Available credits: {{situation.credits}}
    <FactionZone :situation="situation"/>
    <Warehouse :situation="situation" :gameOptions="gameOptions"/>
    <BuyUnit :situation="situation" :gameOptions="gameOptions"/>
    <UnitMap :situation="situation" :allies="allies"/>
  </div>
</template>

<script>
import { getFactionSituation, getCampaignGameOptions, getAlliedFactionsOfCampaign } from '@/lib/api_fetch.js';
import Warehouse from './Warehouse.vue';
import BuyUnit from './BuyUnit.vue';
import UnitMap from './UnitMap.vue';
import FactionZone from './FactionZone.vue';
import SelectFaction from './SelectFaction.vue';
import SelectCampaign from './SelectCampaign.vue';

export default {
  data() {
    return {
      selectedFaction: null,
      selectedCampaign: null,
      situation: {},
      allies: [],
      gameOptions: {}
    };
  },
  components: {
    SelectFaction,
    SelectCampaign,
    Warehouse,
    BuyUnit,
    UnitMap,
    FactionZone
  },
  methods: {
    reloadSituation() {
      if (!this.selectedFaction || !this.selectedCampaign)
        return

      getCampaignGameOptions(this.selectedCampaign, this.selectedFaction, s => this.gameOptions = s);
      getFactionSituation(this.selectedCampaign, this.selectedFaction, situation => {
        this.situation = situation;
        getAlliedFactionsOfCampaign(this.selectedCampaign, allies => {
          this.allies = allies.filter(ally => ally.faction != situation.faction)
        });
      });

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
