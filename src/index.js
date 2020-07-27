import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';
import { delay, chain, action } from 'popmotion';
import debounce from './Utils/debounce';

const TILES = {
  black: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
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

  if (options.showCard === undefined) {
    options.showCard = true;
  }
}

function mergeDefaultOptions (options) {
  options = {...options};
  const _style = options.style;
  let style = _style;
  if (typeof _style === 'string') {
    const predefined = SlideshowMap.TILES[_style.toLowerCase()];
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

class SlideshowMap extends mapboxgl.Evented {
  constructor (options) {
    super();
    options = mergeDefaultOptions(options);
    this.options = options;

    this.id = getId();

    instances[this.id] = this;

    this._flying = false;

    this._nextOptions = null;

    // 添加vancharts的标题和边框
    // 这样会导致在同一个container被vancharts和mapbox init了2遍
    // 看上去效果对就不管了……
    this.vanChart = this.attachTitleAndBorder(options);

    this.slideshow = new Slideshow(options);

    this.slideshow.installComponents(options);

    // this._started = false;
    //
    // // point index
    // this._index = 0;

    this._refresh(options);

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

    this.debouncedStartShow = debounce(this.startShow.bind(this), 0);
  }

  attachTitleAndBorder (options) {
    const container = document.getElementById(options.container) || options.container;
    container.style.boxSizing = 'border-box';
    const vanChart = VanCharts.init(container);
    return vanChart;
  }

  refreshTitleAndBorder (vanChart, options) {
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
  }

  _refresh(options) {
    this.stop();
    this.refreshTitleAndBorder(this.vanChart, options);
    this._index = 0;
  }

  refresh(options) {
    if (this._flying) {
      this._nextOptions = options;
      return;
    }
    this._nextOptions = null;
    this.options = mergeDefaultOptions(options);
    delay(1).start({
      complete: () => {
        this._refresh(this.options);
        this.startShow();
      }
    });
    
  }

  startShow () {
    if (!this._started) {
      // console.warn('start', performance.now());
      this._turn();
      this._started = true;
    }
  }

  stop () {
    if (this._started) {
      this.slideshow.visible = false;
      this.playback && this.playback.halt();
      this._started = false;
    }
  }

  _getSingleItem(index = this._index) {
    const { areaName, value } = this.options.locations[index];
    return {
      areaName,
      value,
    }
  }

  // CHART-3727
  // https://kms.finedevelop.com/pages/viewpage.action?pageId=46741459
  _getItem(index = this._index) {
    const item = this._getSingleItem(index);
    item.nextItem = this._getSingleItem(this._getNextIndex(index));
    return item;
  }

  _setFlying(flag) {
    this._flying = flag;
    if (flag === false && this._nextOptions) {
      this.refresh(this._nextOptions);
    }
  }

  _turn () {

    const locations = this.options.locations;
    const timeGap = this.options.interval - 6000;

    const props = locations[this._index];

    this.playback = action(({complete}) => {
      let playback;

      this._setFlying(true);
      playback = this.slideshow.enter(props).start({
        complete: () => {
          playback = action(({complete}) => {
            this._setFlying(false);
            const d = delay(timeGap).start({
              complete,
            });

            return {
              halt: () => { d.stop() }
            }

          }).start({
            complete: () => {
              // CHART-3727
              // https://kms.finedevelop.com/pages/viewpage.action?pageId=46741459
              this.fire('exitBegin', this._getItem());
              this._setFlying(true);
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
        this.fire('exitEnd', this._getItem());
        this._index = this._getNextIndex();
        // console.warn(this._index);
        this._turn()
      }
    });

  }

  _getNextIndex(index = this._index) {
    return ++index % this.options.locations.length;
  }

  resize () {
    this.stop();
    this.vanChart.resize();
    this.slideshow.resize();
    this.debouncedStartShow();
  }

  dispose () {
    this.stop();
    this.vanChart.clear();
    this.slideshow.dispose();
    const options = this.options;
    const container = document.getElementById(options.container) || options.container;
    container.innerHTML = '';
    delete instances[this.id];
  }

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.Van = window.Van || {};

window.Van.SlideshowMap = SlideshowMap;
SlideshowMap.instances = instances;

SlideshowMap.hash = __HASH__;
SlideshowMap.buildTime = __BUILD_TIME__;

SlideshowMap.TILES = TILES;

export default SlideshowMap
