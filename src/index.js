import './three';
import config from '../config';
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import Box from './Objects/Box';

mapboxgl.accessToken = config.accessToken;

const DEV_NANJING = [118.78, 32.04, 0];

export default class SlideshowMap extends Threebox {
  constructor (options) {
    const map = new mapboxgl.Map(options);
    super(map);

    this.setupDefaultLights();
  }

  installObjects () {
    const box = Box({
      width: 200,
      height: 200,
      depth: 400,
    });

    this.addAtCoordinate(box, DEV_NANJING);

    const width = 200, height = 100;

    const background = new THREE.Shape();

    background.moveTo(0, 0);
    background.lineTo(width, 0);
    background.lineTo(width, height);
    background.lineTo(0, height);
    background.lineTo(0, 0);

    var geometry = new THREE.ShapeGeometry( background);
    var material = new THREE.MeshPhongMaterial( {
      transparent: true,
      opacity: 0.5,
      color: 0x00eeee,
      // side: THREE.DoubleSide
    } );
    var mesh = new THREE.Mesh( geometry, material ) ;

    // geometry.rotateX(- Math.PI / 2);
    // geometry.translate(-1000, 0, 1000);

    this.plane.add(mesh);

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3( -298, 0, 0 ),
      new THREE.Vector3(0, 0, 0)
    );

    var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial({
      color: 0xffffff
    }) );
    this.plane.add( line );

    window.box = box;

    window.vec = () => {
      var width = this.map.transform.width, height = this.map.transform.height;
      var widthHalf = width / 2, heightHalf = height / 2;

      var vector = new THREE.Vector3(0, 0, 400);
      box.localToWorld(vector);
      vector.project(this.camera);

      // vector.x = (vector.x * widthHalf) + widthHalf;
      // vector.y = -(vector.y * heightHalf) + heightHalf;
      vector.x = vector.x * widthHalf;
      vector.y = vector.y * heightHalf;

      console.log(vector);
      lineGeometry.vertices[0].copy(vector);
      lineGeometry.verticesNeedUpdate = true;
    }
  }
}
