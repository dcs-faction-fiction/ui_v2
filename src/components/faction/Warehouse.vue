<template>
  <div>
    <div v-if="airbase">
      
      <br/>Buy warehouse items:
      <select v-model="selectedCode">
        <option v-for="item in gameOptions.warehouseItems" :key="'select '+item.code" :value="item.code">{{item.code}} ({{item.cost}}c)</option>
      </select>
      <button @click="addCodeToBasket">ADD TO BASKET</button>
      <br/>
      <span v-for="(item, code) in basket" :key="'basket '+code">
        {{code}}({{item.qty}}) <button @click="basketPlus(code)">+</button> <button @click="basketMinus(code)">-</button>
      </span>
      <br/>
      Total: {{total}}
      <button @click="buyBasket">BUY</button> <button @click="emptyBasket">EMPTY BASKET</button>

      <br/><br/>Warehouse of {{airbase.name}}
      <button @click="toggleAccordion(airbase.name)">
        <span v-if="!accordionVisible(airbase.name)">+</span>
        <span v-if="accordionVisible(airbase.name)">-</span>
      </button>
      <div :id="'warehouse-'+airbase.name" v-if="accordionVisible(airbase.name)"><br/>
        <span class="csv" v-for="(amount, prop) in airbase.warehouse" :key="situation.faction+' '+prop">
          <span v-if="amount > 0">{{prop}}({{amount}})<br/></span>
        </span>
      </div>

      <span class="csv" v-for="(ally) in allies" :key="ally.faction">
        <br/><br/>Allied warehouse {{ally.airbases[0].code}}
        <button @click="toggleAccordion(ally.airbases[0].code)">
          <span v-if="!accordionVisible(ally.airbases[0].code)">+</span>
          <span v-if="accordionVisible(ally.airbases[0].code)">-</span>
        </button>
        <div :id="'warehouse-'+ally.airbases[0].code" v-if="accordionVisible(ally.airbases[0].code)">
          <span class="csv" v-for="(amount, prop) in ally.airbases[0].warehouse" :key="ally.faction+' '+prop">
            <span v-if="amount > 0">{{prop}}({{amount}})<br/></span>
          </span>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import {buyWarehouseItems} from '@/lib/api_fetch.js';

export default {
  props: {
    situation: {},
    allies: {},
    gameOptions: {}
  },
  data() {
    return {
      airbase: null,
      selectedCode: null,
      basket: {},
      total: 0,
      accordions: {}
    }
  },
  watch: {
    situation(val) {
      if (val && val.airbases && val.airbases.length > 0)
        this.airbase = val.airbases[0]
    }
  },
  methods: {
    toggleAccordion(name) {
      var value = this.accordionVisible(name)
      this.accordions[name].visible = !value
    },
    accordionVisible(name) {
      if (!this.accordions[name]) {
        this.$set(this.accordions, name, {})
        this.$set(this.accordions[name], 'visible', false)
      }
      return this.accordions[name].visible
    },
    addCodeToBasket() {
      if (!this.basket[this.selectedCode])
        this.$set(this.basket, this.selectedCode, {
          code: this.selectedCode,
          cost: this.gameOptions.warehouseItems.find(w => w.code == this.selectedCode).cost,
          qty: 0
        })
      this.basketPlus(this.selectedCode)
    },
    basketPlus(code) {
      this.basket[code].qty = this.basket[code].qty + 1
      this.calculateTotal()
    },
    basketMinus(code) {
      this.basket[code].qty = this.basket[code].qty - 1
      if (this.basket[code].qty <= 0)
        this.$delete(this.basket, code)
      this.calculateTotal()
    },
    calculateTotal() {
      var total = 0
      for (var code in this.basket) {
        var item = this.basket[code]
        if (item)
          total = total + item.cost * item.qty
      }
      this.total = total
    },
    emptyBasket() {
      this.basket = {}
    },
    buyBasket() {
      var request = {basket: {}}
      for (var code in this.basket) {
        request.basket[code] = this.basket[code].qty
      }
      buyWarehouseItems(this.situation.campaign, this.situation.faction, request, () => {
        this.$parent.reloadSituation();
        this.emptyBasket();
      });
    }
  }
}
</script>

<style>
</style>
