<template>
  <div>
    <div id="faction-manager-selectors">
      <SelectFaction :selection.sync="selectedFaction"/>
      &nbsp;&nbsp;
      <SelectCampaign :faction="selectedFaction" :selection.sync="selectedCampaign"/>
      &nbsp;&nbsp;
      Available credits: {{situation.credits}}
      <FactionZone :situation="situation"/>
      <Warehouse :situation="situation" :allies="allies" :gameOptions="gameOptions"/>
      <BuyUnit :situation="situation" :gameOptions="gameOptions"/>
    </div>
      
    <UnitMap :situation="situation" :allies="allies" :enemyLocations="enemyLocations"/>
  </div>
</template>

<script>
import { getFactionSituation, getCampaignGameOptions, getAlliedFactionsOfCampaign, getEnemyFactionLocationsOfCampaign } from '@/lib/api_fetch.js';
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
      enemyLocations: [],
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
        getEnemyFactionLocationsOfCampaign(this.selectedCampaign, enemyLocations => {
          this.enemyLocations = enemyLocations
        })
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
#faction-manager-selectors {
  position: absolute;
  width: 300px;
  right: 0;
  background: white;
  padding: 3px 5px;
}
</style>
