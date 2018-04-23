import './three';
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import config from '../config';

mapboxgl.accessToken = config.accessToken;

export default class SlideshowMap {
  constructor (options) {
    this.map = new mapboxgl.Map(options);
    this.threebox = new Threebox(this.map);

    this.threebox.setupDefaultLights();
  }
}
