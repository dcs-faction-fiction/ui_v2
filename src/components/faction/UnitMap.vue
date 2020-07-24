
<template>
  <div id="map"></div>
</template>

<script>
import { moveUnit } from '@/lib/api_fetch.js';
import { AIRBASE_LOCATIONS } from '@/lib/constants.js';

import 'leaflet/dist/leaflet.css';
var L = require('leaflet')
var mapLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 17,
  minZoom: 4,
  useCache: true,
  opacity: 1
})
var terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	minZoom: 4,
  maxZoom: 17,
  opacity: 0.5
})

export default {
  props: {
    situation: {},
    allies: {},
    enemyLocations: {}
  },
  data() {
    return {
      map: undefined,
      mapObjects: {}
    }
  },
  methods: {
    getUnits() {
      if (!this.situation)
        return
      if (!this.situation.units || this.situation.units.length == 0)
        return
      return this.situation.units;
    },
    getAirbase() {
      if (!this.situation)
        return
      if (!this.situation.airbases || this.situation.airbases.length == 0)
        return
      return this.situation.airbases[0];
    },
    getAirbaseCode() {
      var airbase = this.getAirbase();
      if (!airbase)
        return
      return airbase.code;
    },
    getAirbaseCoords() {
      var code = this.getAirbaseCode();
      if (code && AIRBASE_LOCATIONS[code]) {
        return [AIRBASE_LOCATIONS[code].lat, AIRBASE_LOCATIONS[code].lon];
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
        color: '#3388ff',
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null, //same as color by default
        fillOpacity: 0.2
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
          () => {})
        this.$emit('update:units', newunits)
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
            fillOpacity: 0.2
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
          color: '#ff0000',
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
    getAlliedUnits() {
      if (!this.allies || this.allies.length == 0)
        return []
      return this.allies.flatMap(a => a.units);
    },
    refreshAlliedUnits() {
      var alliedUnits = this.getAlliedUnits();
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
      mapLayer.addTo(this.map)
      terrainLayer.addTo(this.map)
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  },
  watch: {
    situation() {
      this.replaceAirbase()
      this.refreshUnits()
      setTimeout(() => this.map.invalidateSize(), 0);
    },
    allies() {
      this.replaceAlliedAirbases()
      this.refreshAlliedUnits()
      setTimeout(() => this.map.invalidateSize(), 0);
    },
    enemyLocations() {
      this.replaceEnemyLocations();
      setTimeout(() => this.map.invalidateSize(), 0);
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 640px;
}
</style>
