const API_URL_BASE = "http://localhost:8080/v2";

export function addFactionToCampaign(campaignName, factionBody, func) {
    post(API_URL_BASE + "/campaign-api/campaigns/"+campaignName+"/factions", factionBody, func);
}

export function createCampaign(campaignBody, func) {
  post(API_URL_BASE + "/campaign-api/campaigns", campaignBody, func);
}

export function getDefaultGameOptions(func) {
  get(API_URL_BASE + "/common-api/default-game-options", func);
}

export function getCampaignsForFaction(faction, func) {
  get(API_URL_BASE + "/campaignfaction-api/factions/"+faction+"/campaigns", func);
}

export function getFactions(func) {
  if (getToken().isFactionManager()) {
    get(API_URL_BASE + "/faction-api/factions", func);
  } else {
    console.log("Not a faction manager, returning empty list.")
    func([]);
  }
}

export function newFaction(name, func) {
  post(API_URL_BASE + "/faction-api/factions", name, func);
}

export function getToken() {
  try {
    var parsed = parseJwt(localStorage.token);
    return {
      token: localStorage.token,
      parsedToken: parsed,
      isFactionManager: function() {
        return this.parsedToken.roles.includes("faction_manager")
      },
      isCampaignManager: function() {
        return this.parsedToken.roles.includes("campaign_manager")
      }
    };
  } catch (e) {
    console.log(e);
    return {token: undefined};
  }
}

function post(url, jsonRequest, func) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonRequest)
  })
  .then(resp => resp.ok ? resp.json() : [])
  .then(body => func(body))
  .catch(err => console.log(err));
}

function get(url, func) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.token
    }
  })
  .then(resp => resp.ok ? resp.json() : [])
  .then(body => func(body))
  .catch(err => console.log(err));
}

function parseJwt(token) {
  if (!token)
    return undefined;
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}
