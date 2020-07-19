<template>
  <div>
    <label>Faction</label>
    <select v-model="localSelection">
      <option v-for="f in factions" :key="f.name" :value="f.name">
        {{ f.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { getFactions } from '@/lib/api_fetch.js';
import { newFaction } from '@/lib/api_fetch.js';

export default {
  props: {
    selection: {}
  },
  data() {
    return {
      localSelection: this.selection,
      factions: []
    }
  },
  watch: {
    localSelection(val) {
      this.$emit('update:selection', val);
    }
  },
  created() {
    getFactions(factions => {
      if (!factions || factions.length == 0) {
        var name = prompt("Name for a new faction");
        newFaction(name, () => {
          getFactions(factions => this.factions = factions);
        })
      } else {
        this.factions = factions;
      }
    });
  }
}
</script>

<style>
</style>
