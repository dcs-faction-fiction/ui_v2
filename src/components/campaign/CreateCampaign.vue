<template>
  <div id="add-campaign">
    Create new campaign:
    <input type="text" v-model="campaignName" placeholder="Campaign name"/>
    <br/>
    Campaign Options: <button @click="toggleTextArea"><span v-if="!textareaVisible">+</span><span v-if="textareaVisible">-</span></button>
    <br/>
    <textarea v-if="textareaVisible" id="gameOptions" v-model="defaultGameOptions" rows="15" cols="80" :class="validOptions ? 'valid' : 'invalid'"></textarea>
    <br/>
    <button @click="createCampaign">CREATE</button>
  </div>
</template>

<script>
import { getDefaultGameOptions, createCampaign } from '@/lib/api_fetch.js';
import { AIRBASES, COALITIONS } from '@/lib/constants.js';

export default {
  data() {
    return {
      AIRBASES: AIRBASES,
      COALITIONS: COALITIONS,
      campaignName: "",
      defaultGameOptions: "",
      validOptions: false,
      textareaVisible: false
    }
  },
  methods: {
    createCampaign() {
      getDefaultGameOptions(opt => {
        createCampaign({
          name: this.campaignName,
          gameOptions: opt
        }, () => this.$parent.reloadCampaigns());
      });
    },
    toggleTextArea() {
      this.textareaVisible = ! this.textareaVisible;
    }
  },
  watch: {
    defaultGameOptions() {
      try {
        JSON.parse(this.defaultGameOptions)
        this.validOptions = true
      } catch (e) {
        this.validOptions = false
      }
    }
  },
  created() {
    getDefaultGameOptions(opt => this.defaultGameOptions = JSON.stringify(opt, null, 2));
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
