<template>
  <div>
    Zone size: {{situation.zoneSizeFt}}
    <button @click="increase">+</button>
    <button @click="decrease">-</button>
  </div>
</template>

<script>
import { zoneIncrease, zoneDecrease } from '@/lib/api_fetch.js';
export default {
  props: {
    situation: {}
  },
  methods: {
    increase() {
      zoneIncrease(this.situation.campaign, this.situation.faction, () => this.$parent.reloadSituation())
    },
    decrease() {
      zoneDecrease(this.situation.campaign, this.situation.faction, () => this.$parent.reloadSituation())
    }
  }
}
</script>

<style>
</style>
