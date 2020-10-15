<template>
  <div id="start-server">
    Start campaign on server:
    <input type="text" v-model="serverName" placeholder="Server name"/>
    <br/>
    
    Date and time:
    <input type="number" v-model.number="missionConfiguration.time.year"/>
    <input type="number" v-model.number="missionConfiguration.time.month"/>
    <input type="number" v-model.number="missionConfiguration.time.day"/>
    <input type="number" v-model.number="missionConfiguration.time.hours"/>
    <input type="number" v-model.number="missionConfiguration.time.minutes"/>
    <input type="number" v-model.number="missionConfiguration.time.seconds"/>
    <br/>

    Mission duration in seconds:
    <input type="number" v-model.number="missionConfiguration.missionDurationSeconds"/>
    <br/>

    Tactical commander slots:
    <input type="number" v-model.number="missionConfiguration.tacticalCommanderSlots"/>
    <br/>

    <input type="checkbox" id="useGameMaster" v-model="missionConfiguration.gameMasterEnabled">
    <label for="useGameMaster">Use game master</label>
    <br/>
    
    <input type="checkbox" id="useExternalViews" v-model="missionConfiguration.options.externalViews">
    <label for="useExternalViews">Use external views</label>
    <br/>
    <select v-model="missionConfiguration.options.externalViewType">
      <option v-for="a in externalViewOptions" :key="a" :value="a">{{a}}</option>
    </select>
    <br/>
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
      serverName: "server1",
      externalViewOptions: [
        "optview_myaircraft",
        "optview_onlymap",
        "optview_onlyallies",
        "optview_allies",
        "optview_all"
      ],
      missionConfiguration: {
        time: {
          year: 2020,
          month: 7,
          day: 1,
          hours: 8,
          minutes: 0,
          seconds: 0
        },
        weather: {
          random: true
        },
        options: {
          externalViews: true,
          externalViewType: "optview_allies"
        },
        missionDurationSeconds: 3600 * 2,
        tacticalCommanderSlots: 8,
        gameMasterEnabled: true
      }
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
      startServer(this.campaignName, this.serverName, this.missionConfiguration, () => {});
    }
  }
}
</script>

<style>
#start-server {
  border: solid 1px black;
}
#start-server input[type="number"] {
  width: 50px;
}
</style>
