<template>
  <div>
    <div v-if="airbase">
      Warehouse of {{airbase.name}}: <br/>
      <span class="csv" v-for="(amount, prop) in airbase.warehouse" :key="prop">
        {{prop}}({{amount}})
      </span>
      <br/>
      Buy warehouse item:
      <select v-model="selectedCode">
        <option v-for="item in gameOptions.warehouseItems" :key="item.code" :value="item.code">{{item.code}} ({{item.cost}}c)</option>
      </select>
      <button @click="buySelectedCode">BUY</button>
      <br/>
      Allied warehouses
      <span class="csv" v-for="(ally) in allies" :key="ally.faction">
        <br/>{{ally.airbases[0].code}}:
        <span class="csv" v-for="(amount, prop) in ally.airbases[0].warehouse" :key="prop">
          {{prop}}({{amount}})
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import {buyWarehouseItem} from '@/lib/api_fetch.js';

export default {
  props: {
    situation: {},
    allies: {},
    gameOptions: {}
  },
  data() {
    return {
      airbase: null,
      selectedCode: null
    }
  },
  watch: {
    situation(val) {
      if (val && val.airbases && val.airbases.length > 0)
        this.airbase = val.airbases[0]
    }
  },
  methods: {
    buySelectedCode() {
      buyWarehouseItem(this.situation.campaign, this.situation.faction, this.selectedCode, () => {
        this.$parent.reloadSituation();
      });
    }
  }
}
</script>

<style>
</style>
