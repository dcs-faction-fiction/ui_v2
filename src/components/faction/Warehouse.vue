<template>
  <div>
    <div v-if="airbase">
      Warehouse of {{airbase.name}}: <br/>
      <span class="csv" v-for="(amount, prop) in airbase.warehouse" :key="prop">
        {{prop}}({{amount}})
      </span>
      <br/>
      Buy Item:
      <select v-model="selectedCode">
        <option v-for="item in gameOptions.warehouseItems" :key="item.code" :value="item.code">{{item.code}} ({{item.cost}}c)</option>
      </select>
      Quantity: 
      <input type="text" v-model="quantity" placeholder="quantity"/>
      {{total}}
      <button @click="buySelectedCode">BUY</button>
    </div>
  </div>
</template>

<script>
import {buyWarehouseItem} from '@/lib/api_fetch.js';

export default {
  props: {
    situation: {},
    gameOptions: {}
  },
  data() {
    return {
      airbase: null,
      selectedCode: null,
      quantity: 1,
      total: 0
    }
  },
  watch: {
    situation(val) {
      if (val && val.airbases && val.airbases.length > 0)
        this.airbase = val.airbases[0]
    },
    quantity() {
      this.calculateTotals()
    },
    selectedCode() {
      this.calculateTotals()
    }
  },
  methods: {
    calculateTotals() {
      if (!this.airbase || !this.quantity || !this.selectedCode) {
        this.total = 0;
        return
      }

      var singlePrice = this.gameOptions.warehouseItems.find(i => i.code == this.selectedCode).cost;
      this.total = this.quantity * singlePrice;
    },
    buySelectedCode() {
      var count = 1;
      for (var i = 0; i < this.quantity; i++) {
        buyWarehouseItem(this.situation.campaign, this.situation.faction, this.selectedCode, () => {
          count = count + 1;
          if (count == this.quantity)
            this.$parent.reloadSituation();
        });
      }
    }
  }
}
</script>

<style>
</style>
