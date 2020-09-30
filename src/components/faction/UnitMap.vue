
<template>
  <div id="map"></div>
</template>

<script>
import { moveUnit, deleteRecoShot } from '@/lib/api_fetch.js';
import { AIRBASE_LOCATIONS } from '@/lib/constants.js';

import 'leaflet/dist/leaflet.css';
var L = require('leaflet')

function mountMaps(map) {

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 17,
  useCache: true
});
Esri_WorldImagery.addTo(map)
var Stamen_TonerLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
Stamen_TonerLabels.addTo(map)
}

export default {
  props: {
    situation: {},
    allies: {},
    enemyLocations: {},
    recoShots: {}
  },
  data() {
    return {
      map: undefined,
      mapObjects: {},
      isBlue: true
    }
  },
  methods: {
    getUnits() {
      if (!this.situation)
        return
      if (!this.situation.units || this.situation.units.length == 0)
        return
      return this.situation.units
    },
    getAirbase() {
      if (!this.situation)
        return
      if (!this.situation.airbases || this.situation.airbases.length == 0)
        return
      return this.situation.airbases[0]
    },
    getAirbaseCode() {
      var airbase = this.getAirbase()
      if (!airbase)
        return
      return airbase.code;
    },
    getAirbaseCoords() {
      var code = this.getAirbaseCode()
      if (code && AIRBASE_LOCATIONS[code]) {
        return [AIRBASE_LOCATIONS[code].lat, AIRBASE_LOCATIONS[code].lon]
      } else {
        return [42, 42]
      }
    },
    replaceAirbase() {
      var coords = this.getAirbaseCoords()
      if (this.mapObjects['airbase'])
        this.mapObjects['airbase'].remove()
      else
        this.map.setView(coords)

      this.mapObjects['airbase'] = new L.Circle(coords, {
        radius: this.situation.zoneSizeFt * 0.3048,
        stroke: true,
        color: this.isBlue ? '#3388ff' : '#ff0000',
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null, //same as color by default
        fillOpacity: 0.2,
        edit: false,
        clickable: false
      })
      this.mapObjects['airbase'].addTo(this.map)
    },
    changeUnitPosition(id, uuid, lat, lon) {
      var newunits = JSON.parse(JSON.stringify(this.getUnits()))
      if (newunits[id]) {
        newunits[id].location.latitude = lat
        newunits[id].location.longitude = lon

        moveUnit(this.situation.campaign, this.situation.faction, uuid, {
          latitude: lat,
          longitude: lon,
          altitude: 0,
          angle: 0},
          () => this.$parent.reloadSituation())
        
      }
    },
    mapClickedAt(lat, lon) {
      this.$eventHub.$emit('latlon-selected', {lat: lat, lon: lon})
    },
    refreshUnits() {
      var units = this.getUnits()

      if (this.mapObjects['units'])
        this.mapObjects['units'].forEach(u => u.remove())
      this.mapObjects['units'] = []

      var prop
      for (prop in units)
        this.addSingleUnit(prop, units[prop], true)
    },
    replaceAlliedAirbases() {
      if (this.mapObjects['alliedAirbases'])
        this.mapObjects['alliedAirbases'].forEach(u => u.remove())
      this.mapObjects['alliedAirbases'] = [];

      if (!this.allies || this.allies.length == 0)
        return

      this.allies.forEach(sit => {
        var base = sit.airbases[0]
        if (base.code && AIRBASE_LOCATIONS[base.code]) {
          var coords = [AIRBASE_LOCATIONS[base.code].lat, AIRBASE_LOCATIONS[base.code].lon];
          var circle = new L.Circle(coords, {
            radius: sit.zoneSizeFt * 0.3048,
            stroke: true,
            color: '#d3d3d3',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillColor: null, //same as color by default
            fillOpacity: 0.2,
            edit: false,
            clickable: false
          })
          this.mapObjects['alliedAirbases'].push(circle)
          circle.addTo(this.map)
        }
      });
    },
    replaceEnemyLocations() {
      if (this.mapObjects['enemyLocations'])
        this.mapObjects['enemyLocations'].forEach(u => u.remove())
      this.mapObjects['enemyLocations'] = [];

      if (!this.enemyLocations || this.enemyLocations.length == 0)
        return

      this.enemyLocations.forEach(loc => {
        var coords = [loc.latitude, loc.longitude];
        var circle = new L.CircleMarker(coords, {
          radius: 13,
          stroke: true,
          color: this.isBlue ? '#ff0000' : '#3388ff',
          weight: 1,
          opacity: 0.5,
          fill: true,
          fillColor: null, //same as color by default
          fillOpacity: 0.2
        })
        this.mapObjects['enemyLocations'].push(circle)
        circle.addTo(this.map)
      });
    },
    replaceRecoShots() {
      if (this.mapObjects['recoShots'])
        this.mapObjects['recoShots'].forEach(u => u.remove())
      this.mapObjects['recoShots'] = []

      if (this.mapObjects['recoUnits'])
        this.mapObjects['recoUnits'].forEach(u => u.remove())
      this.mapObjects['recoUnits'] = []

      if (!this.recoShots || this.recoShots.length == 0)
        return

      this.recoShots.forEach(loc => {
        var bounds = [[loc.minLat, loc.minLon], [loc.maxLat, loc.maxLon]]
        var circle = new L.rectangle(bounds, {
          recoshotid: loc.id,
          stroke: true,
          color: '#9400D3',
          weight: 1,
          opacity: 0.5,
          fill: true,
          fillColor: null, //same as color by default
          fillOpacity: 0.2,
          zIndexOffset: 100
        })
        circle.on('click', e => {
          if (confirm('delete this recoshot? ('+e.target.options.recoshotid+')'))
            deleteRecoShot(
              this.situation.campaign,
              this.situation.faction,
              e.target.options.recoshotid,
              () => this.$parent.reloadSituation());
        });
        this.mapObjects['recoShots'].push(circle)
        circle.addTo(this.map)

        loc.units.forEach(unit => {
          var options = {
            icon: L.divIcon({html: '<div>'+unit.type+'</div>'})
          }
          var marker = L.marker([unit.location.latitude, unit.location.longitude], options)
          
          marker.addTo(this.map)
          this.mapObjects['recoUnits'].push(marker)
        })
      });
    },
    getAlliedUnits() {
      if (!this.allies || this.allies.length == 0)
        return []
      return this.allies.flatMap(a => a.units)
    },
    refreshAlliedUnits() {
      var alliedUnits = this.getAlliedUnits()
      if (this.mapObjects['alliedUnits'])
        this.mapObjects['alliedUnits'].forEach(u => u.remove())
      this.mapObjects['alliedUnits'] = []

      var prop
      for (prop in alliedUnits)
        this.addSingleUnit(prop, alliedUnits[prop], false)
    },
    addSingleUnit(id, u, owned) {
      var options = {
        icon: L.divIcon({html: '<div>'+u.type+'</div>'}),
        id: id,
        uuid: u.id
      }
      if (owned)
        options.draggable = 'true'
      var marker = L.marker([u.location.latitude, u.location.longitude], options)
      
      if (owned) {
        var t = this
        marker.on('dragend', e => {
          var marker = e.target
          var position = marker.getLatLng()
          t.changeUnitPosition(marker.options.id, marker.options.uuid, position.lat, position.lng)
        });
      }

      marker.addTo(this.map)
      if (owned)
        this.mapObjects['units'].push(marker)
      else
        this.mapObjects['alliedUnits'].push(marker)
    }
  },
  mounted() {
    if (!this.map) {
      this.map = L.map('map', {zoom: 8, center: [42, 42]})
      this.map.on('click', e => this.mapClickedAt(e.latlng.lat, e.latlng.lng))
      mountMaps(this.map);
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  },
  watch: {
    situation() {
      this.isBlue = this.situation.airbases[0].coalition == 'BLUE'
      this.replaceAirbase()
      this.refreshUnits()
      setTimeout(() => this.map.invalidateSize(), 0)
    },
    allies() {
      this.replaceAlliedAirbases()
      this.refreshAlliedUnits()
      setTimeout(() => this.map.invalidateSize(), 0)
    },
    enemyLocations() {
      this.replaceEnemyLocations();
      setTimeout(() => this.map.invalidateSize(), 0)
    },
    recoShots() {
      this.replaceRecoShots();
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
</style>

