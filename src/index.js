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


    const background = new THREE.Shape();

    background.moveTo(100, 100);
    background.lineTo(200, 100);
    background.lineTo(200, 200);
    background.lineTo(100, 200);
    // background.lineTo(100, 100);

    var geometry = new THREE.ShapeGeometry( background );
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var mesh = new THREE.Mesh( geometry, material ) ;

    mesh.rotation.y = -1;
    mesh.rotation.x = -1;

    this.threebox.addAtCoordinate(mesh, DEV_NANJING);
  }
}
