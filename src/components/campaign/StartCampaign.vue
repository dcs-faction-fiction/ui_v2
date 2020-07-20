<template>
  <div id="start-server">
    Campaign:
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    Server:
    <input type="text" v-model="serverName" placeholder="Server name"/>
    <button @click="startServerButton">START</button>
  </div>
</template>

<script>
import {startServer} from '@/lib/api_fetch.js';

export default {
  data() {
    return {
      serverName: "",
      campaignName: ""
    }
  },
  methods: {
    startServerButton() {
      startServer(this.campaignName, this.serverName, () => {});
    }
  }
}
</script>

<style>
#start-server {
  border: solid 1px black;
}
</style>
