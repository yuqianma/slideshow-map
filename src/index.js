import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';
import { delay, chain, action } from 'popmotion';
import debounce from './Utils/debounce'

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
  const container = document.getElementById(options.container) || options.container;
  container.style.boxSizing = 'border-box';
  const vanChart = VanCharts.init(container);
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

function locationDefaultOptions (options) {
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

  if (options.locations) {
    options.locations.forEach(opt => {
      locationDefaultOptions(opt);
    });
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

const instances = {};

let __id = -1;
const getId = () => ++__id;

class SlideshowMap {
  constructor (options) {
    options = mergeDefaultOptions(options);
    this.options = options;

    this.id = getId();

    instances[this.id] = this;

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

    this.debouncedStartShow = debounce(this.startShow.bind(this), 300);
  }

  startShow () {
    if (!this._started) {
      // console.warn('start', performance.now());
      this._turn();
      this.slideshow.visible = true;
      this._started = true;
    }
  }

  stop () {
    if (this._started) {
      this.slideshow.visible = false;
      this.playback.halt();
      this._started = false;
    }
  }

  _turn () {

    const locations = this.options.locations;
    const timeGap = this.options.interval - 6000;

    this.playback = action(({complete}) => {
      let playback;

      playback = this.slideshow.enter(locations[this._index]).start({
        complete: () => {
          playback = action(({complete}) => {
            const d = delay(timeGap).start({
              complete,
            });

            return {
              halt: () => { d.stop() }
            }

          }).start({
            complete: () => {
              playback = this.slideshow.leave().start({
                complete
              });
            }
          });
        }
      });

      return {
        halt: () => {
          playback.halt();
        }
      }

    }).start({
      complete: () => {
        this._index = ++this._index % locations.length;
        // console.warn(this._index);
        this._turn()
      }
    });

  }

  resize () {
    this.stop();
    this.vanChart.resize();
    this.slideshow.resize();
    this.debouncedStartShow();
  }

  dispose () {
    delete instances[this.id];
  }

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.Van = window.Van || {};

window.Van.SlideshowMap = SlideshowMap;
SlideshowMap.instances = instances;

export default SlideshowMap
