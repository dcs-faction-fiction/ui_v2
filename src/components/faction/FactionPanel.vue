<template>
  <div>
    <UnitMap :situation="situation"/>
  </div>
</template>

<script>
import { getFactionSituation } from '@/lib/api_fetch.js';
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
      situation: {}
    };
  },
  methods: {
    reloadSituation() {
      if (!this.selectedFaction || !this.selectedCampaign)
        return

      getFactionSituation(this.selectedCampaign, this.selectedFaction, s => this.situation = s);
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
