import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';

class SlideshowMap {
  constructor (options) {
    this.options = options; // todo, merge default

    this.slideshow = new Slideshow(options);

    this.slideshow.installComponents();

    this.index = 0;

    var map = this.slideshow.map;

    // map.flyTo({
    //   center: options.center,
    //   zoom: options.zoom,
    //   pitch: options.pitch
    // });


    if (__DEV__) {
      // this.slideshow.flyTo(options.locations[0]);
      this.startShow();
      window._slideshowMap = this;
    } else {

      if (map.loaded()) {
        this.startShow();
      } else {
        map.on('load', (e) => {
          this.startShow();
        });
      }

    }
  }

  startShow () {
    // console.log('start');
    const locations = this.options.locations;
    const interval = this.options.interval;
    if (locations && locations.length) {
      let i = -1;

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

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.VanBigScreen = window.VanBigScreen || {};

window.VanBigScreen.SlideshowMap = SlideshowMap;

export default SlideshowMap
