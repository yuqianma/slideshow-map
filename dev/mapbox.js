import mapboxgl from 'mapbox-gl';

window.mapboxgl = mapboxgl;

mapboxgl.accessToken = 'pk.eyJ1IjoibWF5cTA0MjIiLCJhIjoiY2phamMwOHV4MjllajMzbnFyeTMwcmZvYiJ9.aFMw4Aws5zY9Y4NwYqFMlQ';
var map = new mapboxgl.Map({
  container: 'map',
  // tileCacheSize: 100,
  // style: 'mapbox://styles/mapbox/dark-v9',
  style: {
    "version": 8,
    "sources": {
      "osm-tiles": {
        "type": "raster",
        'tiles': [
          // "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // 'http://tile.thunderforest.com/transport-dark/{z}/{x}/{y}@2x.png',
          // 'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'
          // 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=7'
          // 'http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180911&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Abackground%7Ce%3Aall%7Cc%3A%23000000ff'
          // 'http://online1.map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}',
          // 'http://cmmre.ishowchina.com/tile?x={x}&y={y}&z={z}&mid=basemap_17703&f=png&scale={scale}',
          'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
        ],
        'tileSize': 256
      }
    },
    "layers": [{
      "id": "simple-tiles",
      "type": "raster",
      "source": "osm-tiles",
      "minzoom": 0,
      "maxzoom": 22
    }]
  },
  center: [118.78406, 32.05873],
  maxZoom: 22,
  minZoom: 0,
  zoom: 14,
  hash: true
});

window.map = map;

function playback(index) {

  // bug
  // highlightBorough(locations[index].id ? locations[index].id : '');

  // Animate the map position based on camera properties
  map.flyTo(locations[index].camera);

  map.once('moveend', function () {
    // Duration the slide is on screen after interaction
    window.setTimeout(function () {
      // Increment index
      index = (index + 1 === locations.length) ? 0 : index + 1;
      playback(index);
    }, 3000); // After callback, show the location for 3 seconds.
  });
}

map.on('load', function () {

  // map.addLayer({
  //   "id": "highlight",
  //   "type": "fill",
  //   "source": {
  //     "type": "vector",
  //     "url": "mapbox://mapbox.8ibmsn6u"
  //   },
  //   "source-layer": "original",
  //   "paint": {
  //     "fill-color": "#fd6b50",
  //     "fill-opacity": 0.25
  //   },
  //   "filter": ["==", "borocode", ""]
  // });

  // Start the playback animation for each borough
  // playback(0);

  // flyTo.nanjing();
  //
  // map.once('moveend', () => {
  //   window.setTimeout(() => flyTo.wuxi(), 2000);
  // });
});

window.flyTo = {
  nanjing: () => map.flyTo({
    center: [118.78, 32.04],
    zoom: 12.21,
    pitch: 50
  }),

  wuxi: () => map.flyTo({
    center: [120.299, 31.568],
    zoom: 12.21,
    pitch: 50,
    speed: 0.5
  })
};