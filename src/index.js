import './three';
import config from '../config';
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import Box from './Objects/Box';

mapboxgl.accessToken = config.accessToken;

const DEV_NANJING = [118.78, 32.04, 0];

export default class SlideshowMap {
  constructor (options) {
    this.map = new mapboxgl.Map(options);
    this.threebox = new Threebox(this.map);

    this.threebox.setupDefaultLights();
  }

  installObjects () {
    const box = Box({
      width: 200,
      height: 200,
      depth: 1000,
    });

    this.threebox.addAtCoordinate(box, DEV_NANJING);
  }
}
