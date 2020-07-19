const API_URL_BASE = "http://localhost:8080/v2";

export function getFactions(func) {
  if (getToken().isFactionManager()) {
    get(API_URL_BASE + "/faction-api/factions", func);
  } else {
    console.log("Not a faction manager, returning empty list.")
    func([]);
  }
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

function get(url, func) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer' + localStorage.token,
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
