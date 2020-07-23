<template>
  <div id="campaign-panel">
    Campaign:
    <select v-model="campaignName">
      <option v-for="c in campaigns" :key="c.name" :value="c.name">{{c.name}}</option>
    </select>
    Faction in campaign:
    <select v-model="factionName">
      <option v-for="c in factions" :key="c.faction" :value="c.faction">{{c.faction}}({{c.credits}}c)</option>
    </select>

    <AddFactionToCampaign :campaignName="campaignName"/>
    <GiveCredits :campaignName="campaignName" :factionName="factionName"/>
    <StartCampaign :campaignName="campaignName"/>
    <CreateCampaign/>
  </div>
</template>

<script>
import { getAllCampaigns, getAllFactionsOfCampaign } from '@/lib/api_fetch.js';
import CreateCampaign from './CreateCampaign.vue';
import AddFactionToCampaign from './AddFactionToCampaign.vue';
import GiveCredits from './GiveCredits.vue';
import StartCampaign from './StartCampaign.vue';

export default {
  data() {
    return {
      campaigns: [],
      factions: [],
      campaignName: null,
      factionName: null
    }
  },
  components: {
    CreateCampaign,
    AddFactionToCampaign,
    GiveCredits,
    StartCampaign
  },
  watch: {
    campaigns(val) {
      if (!this.campaignName && val && val.length > 0)
        this.campaignName = val[0].name
    },
    factions(val) {
      if (!this.factionName && val && val.length > 0)
        this.factionName = val[0].faction
    },
    campaignName(val) {
      getAllFactionsOfCampaign(val, s => this.factions = s)
    }
  },
  methods: {
    reloadCampaigns() {
      getAllCampaigns(s => this.campaigns = s)
    }
  },
  created() {
    this.reloadCampaigns()
  }
}
</script>

<style>
#campaign-panel {
  border: solid 1px black;
}
</style>
