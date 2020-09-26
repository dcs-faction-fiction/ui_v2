<template>
  <div>
    <div v-if="latlon">
      <button @click="buyRecoShot">BUY RECO SHOT
        <br/>
        cost {{gameOptions.zones.recoShot.cost}}c
        <br/>
        {{gameOptions.zones.recoShot.edgeSize}}mt square</button>
      <br/>

      Buy unit:
      <select v-model="selectedCode">
        <option v-for="item in gameOptions.units" :key="item.code" :value="item.code">{{item.code}} ({{item.cost}}c)</option>
      </select>
      <button @click="buySelectedCode">BUY</button>
    </div>
  </div>
</template>

<script>
import {buyUnit,buyRecoShot} from '@/lib/api_fetch.js';

export default {
  props: {
    situation: {},
    gameOptions: {}
  },
  data() {
    return {
      selectedCode: null,
      latlon: null
    }
  },
  watch: {
  },
  methods: {
    buySelectedCode() {
      buyUnit(this.situation.campaign, this.situation.faction, {
        type: this.selectedCode,
        location: {
          latitude: this.latlon.lat,
          longitude: this.latlon.lon,
          altitude: 0,
          angle: 0
        }
      }, () => {
        this.latlon = null;
        this.$parent.reloadSituation();
      });
    },
    buyRecoShot() {
      buyRecoShot(this.situation.campaign, this.situation.faction, {
        latitude: this.latlon.lat,
        longitude: this.latlon.lon,
      }, () => {
        this.latlon = null;
        this.$parent.reloadSituation();
      })
    }
  },
  created() {
    this.$eventHub.$on('latlon-selected', (latlon) => {
      this.latlon = latlon
    })
  },
  beforeDestroy() {
    this.$eventHub.$off('latlng-selected')
  }
}
</script>

<style>
</style>
