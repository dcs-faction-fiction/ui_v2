<template>
  <div>
    <label>Campaign</label>
    <select v-model="localSelection">
      <option v-for="i in items" :key="i" :value="i">
        {{ i }}
      </option>
    </select>
  </div>
</template>

<script>
import { getCampaignsForFaction } from '@/lib/api_fetch.js';

export default {
  props: {
    faction: {},
    selection: {}
  },
  data() {
    return {
      localSelection: this.selection,
      items: []
    }
  },
  watch: {
    faction() {
      this.getItems();
    },
    localSelection(val) {
      this.$emit('update:selection', val);
    }
  },
  methods: {
    getItems() {
      getCampaignsForFaction(this.faction, items => this.items = items);
    }
  }
}
</script>

<style>
</style>
