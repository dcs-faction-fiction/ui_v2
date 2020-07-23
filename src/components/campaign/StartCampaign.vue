<template>
  <div id="start-server">
    Start campaign on server:
    <input type="text" v-model="serverName" placeholder="Server name"/>
    <button @click="startServerButton">START</button>
  </div>
</template>

<script>
import {startServer} from '@/lib/api_fetch.js';

export default {
  props: {
    campaignName: {}
  },
  data() {
    return {
      serverName: ""
    }
  },
  watch: {
    campaigns(val) {
      if (!this.campaignName && val && val.length > 0)
        this.campaignName = val[0].name
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
