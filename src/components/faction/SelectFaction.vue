<template>
  <span>
    <label>Faction&nbsp;</label>
    <button @click="newFaction">+</button>
    <select v-model="localSelection">
      <option v-for="f in factions" :key="f.name" :value="f.name">
        {{ f.name }}
      </option>
    </select>
  </span>
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
      this.$emit('update:selection', val)
    },
    factions(val) {
      if (!this.localSelection && val && val.length > 0)
        this.localSelection = val[0].name
    }
  },
  methods: {
    newFaction() {
      var name = prompt("Name for a new faction")
      newFaction(name, () => {
        getFactions(factions => this.factions = factions)
      })
    },
    reload() {
      getFactions(factions => {
        if (!factions || factions.length == 0) {
          newFaction()
        } else {
          this.factions = factions
        }
      });
    }
  },
  created() {
    this.reload()
  }
}
</script>

<style>
</style>
