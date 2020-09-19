<template>
  <span>
    <label>Campaign&nbsp;</label>
    <select v-model="localSelection">
      <option v-for="i in items" :key="i" :value="i">
        {{ i }}
      </option>
    </select>
  </span>
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
    },
    items(val) {
      if (!this.localSelection && val && val.length > 0)
        this.localSelection = val[0];
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
