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
    <button @click="removeFaction">REMOVE FACTION FROM CAMPAIGN</button>

    <AddFactionToCampaign :campaignName="campaignName"/>
    <GiveCredits :campaignName="campaignName" :factionName="factionName"/>
    <StartCampaign :campaignName="campaignName"/>
    <ChangeCampaignOptions :campaignName="campaignName" :factionName="factionName"/>
    <CreateCampaign/>
  </div>
</template>

<script>
import { getAllCampaigns, getAllFactionsOfCampaign, removeCampaignFaction } from '@/lib/api_fetch.js';
import CreateCampaign from './CreateCampaign.vue';
import ChangeCampaignOptions from './ChangeCampaignOptions.vue';
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
    ChangeCampaignOptions,
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
    },
    removeFaction() {
      if (!this.campaignName || !this.factionName)
        return
      if (!confirm("This will delete the faction and all the warehouse, units and everything else from this campaign. Continue?"))
        return
      removeCampaignFaction(this.campaignName, this.factionName, () => {})
    }
  },
  created() {
    this.reloadCampaigns()
  }
}
</script>

<style>
#campaign-panel {
}
</style>
