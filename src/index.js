import Slideshow from './Slideshow';
import mapboxgl from 'mapbox-gl';

class SlideshowMap {
  constructor (options) {
    this.options = options; // todo, merge default

    this.slideshow = new Slideshow(options);

    this.slideshow.installComponents();

    var map = this.slideshow.map;

    // map.flyTo({
    //   center: options.center,
    //   zoom: options.zoom,
    //   pitch: options.pitch
    // });

    this.slideshow.flyTo(options.locations[0]);

    // if (map.loaded()) {
    //   this.startShow();
    // } else {
    //   map.on('load', (e) => {
    //     this.startShow();
    //   });
    // }
  }

  startShow () {
    // console.log('start');
    const locations = this.options.locations;
    if (locations && locations.length) {
      let i = 0;

      const turn = () => {

        this.slideshow.flyTo(locations[i]);
        i = ++i % locations.length;

        window.setTimeout(() => {
          this.slideshow._leave();
        }, 9000);
      };

      turn();

      this._id = window.setInterval(turn, this.options.interval + 9000); // todo
    }
  }

  static setAccessToken (accessToken) {
    mapboxgl.accessToken = accessToken;
  }
}

window.VanBigScreen = window.VanBigScreen || {};

window.VanBigScreen.SlideshowMap = SlideshowMap;

export default SlideshowMap
