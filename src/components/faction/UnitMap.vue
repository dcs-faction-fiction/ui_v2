
<template>
  <div id="map"></div>
</template>

<script>

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
    situation: {}
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
      if (this.mapObjects['airbase']) {
        this.mapObjects['airbase'].remove()
      }
      this.mapObjects['airbase'] = new L.Circle(coords, this.situation.zoneSizeFt * 0.3048, {
        stroke: true,
        color: '#3388ff',
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null, //same as color by default
        fillOpacity: 0.2,
        clickable: true
      })
      this.mapObjects['airbase'].addTo(this.map)
      this.map.setView(coords)
    },
    changeUnitPosition(id, lat, lon) {
      var newunits = JSON.parse(JSON.stringify(this.getUnits()))
      if (newunits[id]) {
        newunits[id].location.latitude = lat
        newunits[id].location.longitude = lon
        this.$emit('update:units', newunits)
      }
    },
    mapClickedAt(lat, lon) {
      this.$eventHub.$emit('latlon-selected', {lat: lat, lon: lon})
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
      var units = this.getUnits();
      if (units) {
        console.log(units);
      }

      this.replaceAirbase()
      setTimeout(() => this.map.invalidateSize(), 0);
      /*
      // Need to convert units into leaflet market instances and keep their uuid to be
      // recognized later.

      // All the items will be emptied anyway.
      if (this.mapObjects['units']) {
        this.mapObjects['units'].forEach(u => u.remove())
      }
      
      // Start with a new array
      this.mapObjects['units'] = []
      
      // Units are key-values properties in an object
      var prop
      for (prop in units) {
        var t = this
        var u = units[prop]

        // Create the marker
        var marker = L.marker([u.location.latitude, u.location.longitude], {
          draggable: 'true',
          icon: L.divIcon({html: '<div>'+u.type+'</div>'}),
          id: prop
        })
        
        // Assign the event behavior
        marker.on('dragend', e => {
          var marker = e.target
          var position = marker.getLatLng()
          t.changeUnitPosition(marker.options.id, position.lat, position.lng)
        });

        // Add it to the map and array
        marker.addTo(this.map)
        this.mapObjects['units'].push(marker)
      }
      */
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 510px;
}
</style>
