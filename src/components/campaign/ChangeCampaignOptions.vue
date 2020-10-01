<template>
  <div id="add-campaign">
    Change campaign options: <button @click="toggleTextArea"><span v-if="!textareaVisible">+</span><span v-if="textareaVisible">-</span></button>
    <br/>
    <textarea v-if="textareaVisible" id="gameOptions" v-model="gameOptions" rows="10" cols="80" :class="validOptions ? 'valid' : 'invalid'"></textarea>
    <br/>
    <button @click="changeCampaignOptions">CHANGE</button>
  </div>
</template>

<script>
import { getCampaignGameOptions, setCampaignGameOptions } from '@/lib/api_fetch.js';

export default {
  props: {
    campaignName: {},
    factionName: {}
  },
  data() {
    return {
      validOptions: false,
      gameOptions: "{}",
      textareaVisible: false
    }
  },
  methods: {
    changeCampaignOptions() {
      setCampaignGameOptions(this.campaignName, JSON.parse(this.gameOptions), () => this.reloadOptions())
    },
    reloadOptions() {
      getCampaignGameOptions(this.campaignName, this.factionName, opt => {
        this.gameOptions = JSON.stringify(opt, null, 2)
      })
    },
    toggleTextArea() {
      this.textareaVisible = ! this.textareaVisible;
    }
  },
  watch: {
    campaignName() {
      this.reloadOptions()
    },
    gameOptions() {
      try {
        JSON.parse(this.gameOptions)
        this.validOptions = true
      } catch (e) {
        this.validOptions = false
      }
    }
  }
}
</script>

<style>
#add-campaign {
  border: solid 1px black;
}
#gameOptions.valid {
 color: green;
}
#gameOptions.invalid {
  color: red;
}
</style>
