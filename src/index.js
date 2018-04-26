import './three';
import config from '../config';
import { Link } from "./constants";
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import Box from './Components/Box';
import {
  timeline
} from 'popmotion';

mapboxgl.accessToken = config.accessToken;

const DEV_NANJING = [118.78, 32.04, 0];

export default class SlideshowMap extends Threebox {
  constructor (options) {
    super(new mapboxgl.Map(options));

    this.__installed = false;

    this.components = {};

    this._installHelperObjects();

    this.setupDefaultLights();

    this.map.on('moveend', () => {
      this.animateComponents();
    });
  }

  // Add these helpers to use their inner methods.
  // So no need to calculate manually.
  _installHelperObjects () {
    const mapObj = new THREE.Object3D();
    this._mapObj = this.addAtCoordinate(mapObj, [0, 0]);
  }

  projectToPlane (coords) {
    const width = this.map.transform.width, height = this.map.transform.height;
    const widthHalf = width / 2, heightHalf = height / 2;

    const vector = new THREE.Vector3();
    vector.setZ(coords[2] || 0);
    this.moveToCoordinate(this._mapObj, [coords[0], coords[1], 0]);
    this._mapObj.parent.updateMatrixWorld(); // update the matrixWorld immediately
    this._mapObj.localToWorld(vector);
    vector.project(this.camera);

    vector.x = vector.x * widthHalf;
    vector.y = vector.y * heightHalf;

    return vector;
  }

  installComponents () {
    if (this.__installed) {
      console.error('Cannot install Objects twice!');
      return
    }
    this.__installed = true;

    const box = Box({
      width: 200,
      height: 200,
      depth: 400,
    });

    this.addAtCoordinate(box, DEV_NANJING);

    this.components.box = box;

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
      // depthTest: false,
      // side: THREE.DoubleSide
    } );
    var mesh = new THREE.Mesh( geometry, material ) ;

    // geometry.rotateX(- Math.PI / 2);
    // geometry.translate(-1000, 0, 1000);

    this.plane.add(mesh);

    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 0, 0 )
    );

    const link = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial({
      color: Link.Color
    }) );

    this.plane.add( link );
    this.components.link = link;
  }

  flyTo ({
    areaName,
    content,
    description,
    lngLat,
    zoom
         }) {

  }

  animateComponents () {
    // todo, get coords
    const coords = DEV_NANJING.slice();
    coords[2] = 400;
    const vector = this.projectToPlane(coords);

    const linkGeometry = this.components.link.geometry;
    linkGeometry.vertices[0].copy(vector);
    linkGeometry.vertices[1].copy(vector);
    linkGeometry.verticesNeedUpdate = true;

    timeline([
      Link.Durations[0],
      {
        track: 'v',
        from: {
          x: vector.x,
          y: vector.y,
        },
        to: {
          x: vector.x + 100,
          y: vector.y + 200,
        },
        duration: Link.Durations[1]
      }
      // Link.Durations[2],
    ]).start(({v}) => {
      linkGeometry.vertices[1].setX(v.x);
      linkGeometry.vertices[1].setY(v.y);
      linkGeometry.verticesNeedUpdate = true;
    })
  }
}
