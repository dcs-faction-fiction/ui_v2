<template>
  <div>
    <SelectFaction :selection.sync="selectedFaction"/>
    <SelectCampaign :faction="selectedFaction" :selection.sync="selectedCampaign"/>
  </div>
</template>

<script>
import SelectFaction from './SelectFaction.vue';
import SelectCampaign from './SelectCampaign.vue';

export default {
  data() {
    return {
      selectedFaction: null,
      selectedCampaign: null
    }
  },
  watch: {
    selectedFaction(val) {
      console.log(val)
    }
  },
  components: {
    SelectFaction,
    SelectCampaign
  }
}
</script>

<style>
</style>
