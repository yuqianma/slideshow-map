import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';
import { delay } from 'popmotion';

const TILES = {
  BLACK: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  SATELLITE: 'http://t3.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles'
};

const start = +new Date;

// window.elapse = () => (+new Date - start) / 1000 | 0;

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
  const vanChart = VanCharts.init(document.getElementById(container) || container);
  if (options.title) {
    options.title.style = options.title.style || {};
    options.title.style.lineHeight = 'normal';
  }
  vanChart.setOptions(Object.assign({
    "plotOptions": {
      "animation": false
    },
    "geo": {},
    "series": [],
    "chartType": "pointMap",
    title: options.title,
  }, options.border));
  return vanChart;
}

function mergeDefaultOptions (options) {
  options = {...options};
  const _style = options.style;
  let style = _style;
  if (typeof _style === 'string') {
    const predefined = TILES[_style.toUpperCase()];
    if (predefined) {
      style = getTileStyle(predefined);
    } else
    if (_style.substr(0, 4) === 'http') {
      style = getTileStyle(_style);
    }
  }

  options.style = style;

  options.fontFamily = options.fontFamily || 'Microsoft YaHei, sans-serif';

  if (options.opacity == null) {
    options.opacity = 1;
  }

  if (options.size == null) {
    options.size = 10;
  }

  // 留出link空间
  if (options.type === 'pillar') {
    options.size /= 2;
  }

  if (options.accessToken) {
    mapboxgl.accessToken = options.accessToken;
  }

  return options
}

export const $test = {
  TILES,
  mergeDefaultOptions,
  mapboxgl
};

class SlideshowMap {
  constructor (options) {
    options = mergeDefaultOptions(options);
    this.options = options;

    // 添加vancharts的标题和边框
    // 这样会导致在同一个container被vancharts和mapbox init了2遍
    // 看上去效果对就不管了……
    this.vanChart = attachTitleAndBorder(options);

    this.slideshow = new Slideshow(options);

    this.slideshow.installComponents(options);

    this._started = false;

    // point index
    this._index = 0;

    const map = this.slideshow.map;

    if (__DEV__) {
      this.startShow();
      window._slideshowMap = this;
      window._resize = this.resize.bind(this);
    } else {

      if (map.loaded()) {
        this.startShow();
      } else {

        new Promise((res) => {
          setTimeout(res, 4000);
          map.on('load', res);
        })
          .then(() => {
            this.startShow();
          });
      }

    }
  }

  startShow () {
    this.slideshow._turn(this.options.locations[0]).start({
      update: (v) => {
        // console.log(v);
      },
      complete: () => {
        console.warn('turn end');
      }
    });
  }

  _startShow () {

    if (this._started && this._reject) {
      this._reject('stop prev');
    }

    this._started = true;

    const locations = this.options.locations;
    const interval = this.options.interval;
    if (locations && locations.length) {
      let i = -1;

      const turn = () => {

        new Promise((resolve, reject) => {
          this._reject = reject;
          i = ++i % locations.length;
          this.slideshow.flyTo(locations[i], resolve);
        })
          .then(() => new Promise((resolve, reject) => {
            this._reject = reject;
            // console.log(elapse(), 'animation end');
            const timeGap = Math.max(interval - 6000, 0);
            delay(timeGap).start({
              complete: resolve
            });
          }))
          .then(() => {
            // console.log(elapse(), 'interval end');
            return new Promise((resolve, reject) => {
              this._reject = reject;
              this.slideshow.leave(resolve)
            });
          })
          .then(turn)
          .catch((e) => {
            console.log(e);
          });
      };

      turn();
    }
  }

  resize () {
    this.vanChart.resize();
    this.slideshow.stop();
    this.slideshow.resize();
    this.startShow();
  }

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.Van = window.Van || {};

window.Van.SlideshowMap = SlideshowMap;

export default SlideshowMap
