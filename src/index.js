import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';

const TILES = {
  BLACK: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  SATELLITE: 'http://t3.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles'
};

const getTileStyle = (tileUrl) => ({
  "version": 8,
  "sources": {
    "image-tiles": {
      "type": "raster",
      'tiles': [tileUrl],
      'tileSize': 256
    }
  },
  "layers": [{
    "id": "simple-tiles",
    "type": "raster",
    "source": "image-tiles",
    "minzoom": 0,
    "maxzoom": 22
  }]
});

function attachTitleAndBorder (options) {
  const container = options.container;
  const vanCharts = VanCharts.init(document.getElementById(container) || container);
  if (options.title) {
    options.title.style = options.title.style || {};
    options.title.style.lineHeight = 'normal';
  }
  vanCharts.setOptions(Object.assign({
    "plotOptions": {
      "animation": false
    },
    "geo": {},
    "series": [],
    "chartType": "pointMap",
    title: options.title,
  }, options.border));
}

function mergeDefaultOptions (options) {
  options = {...options};
  let style = '' + options.style || 'BLACK';
  style = style.toUpperCase();
  if (TILES[style]) {
    options.style = getTileStyle(TILES[style]);
  }
  return options
}

class SlideshowMap {
  constructor (options) {
    options = mergeDefaultOptions(options);
    this.options = options;

    // 添加vancharts的标题和边框
    // 这样会导致在同一个container被vancharts和mapbox init了2遍
    // 看上去效果对就不管了……
    attachTitleAndBorder(options);

    this.slideshow = new Slideshow(options);

    this.slideshow.installComponents(options);

    this._started = false;

    var map = this.slideshow.map;

    // map.flyTo({
    //   center: options.center,
    //   zoom: options.zoom,
    //   pitch: options.pitch
    // });


    if (__DEV__) {
      // this.slideshow.flyTo(options.locations[1]);
      this.startShow();
      window._slideshowMap = this;
    } else {

      if (map.loaded()) {
        this.startShow();
      } else {

        setTimeout(() => {
          !this._started && this.startShow();
        }, 4000);

        map.on('load', (e) => {
          !this._started && this.startShow();
        });
      }

    }
  }

  startShow () {

    this._started = true;

    // console.log('start');
    const locations = this.options.locations;
    const interval = this.options.interval;
    if (locations && locations.length) {
      let i = -1;

      if (__DEV__) {

        const turn = () => {

          new Promise(resolve => {
            i = ++i % locations.length;
            this.slideshow.flyTo(locations[i], resolve);
          })
            .then(() => new Promise(resolve => {
              window._nextTurn = resolve;
            }))
            .then(() => new Promise(resolve => this.slideshow.leave(resolve)))
            .then(turn);
        };

        turn();

      } else {

        const turn = () => {

          new Promise(resolve => {
            i = ++i % locations.length;
            this.slideshow.flyTo(locations[i], resolve);
          })
            .then(() => new Promise(resolve => setTimeout(resolve, interval)))
            .then(() => new Promise(resolve => this.slideshow.leave(resolve)))
            .then(turn);
        };

        turn();
      }
    }
  }

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.Van = window.Van || {};

window.Van.SlideshowMap = SlideshowMap;

export default SlideshowMap
