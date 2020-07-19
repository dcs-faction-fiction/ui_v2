<template>
  <div>
    <SelectFaction :selection.sync="selectedFaction"/>
    <SelectCampaign :faction="selectedFaction" :selection.sync="selectedCampaign"/>
    <FactionPanel :selectedFaction="selectedFaction" :selectedCampaign="selectedCampaign"/>
  </div>
</template>

<script>
import SelectFaction from './SelectFaction.vue';
import SelectCampaign from './SelectCampaign.vue';
import FactionPanel from './FactionPanel.vue';

export default {
  data() {
    return {
      selectedFaction: null,
      selectedCampaign: null
    }
  },
  components: {
    SelectFaction,
    SelectCampaign,
    FactionPanel
  }
}
</script>

<style>
</style>
