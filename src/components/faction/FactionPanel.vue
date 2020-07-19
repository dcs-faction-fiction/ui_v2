<template>
  <div>
  </div>
</template>

<script>
export default {
  props: {
    selectedFaction: {},
    selectedCampaign: {}
  },
  watch: {
    selectedFaction(val) {
      console.log(val)
    },
    selectedCampaign(val) {
      console.log(val)
    }
  }
}
</script>

<style>
</style>
