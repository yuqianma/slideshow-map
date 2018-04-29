import './three';
import config from '../config';
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import {
  Box,
  Link,
  RadioWave
} from './Components';
import { timeline } from 'popmotion';

mapboxgl.accessToken = config.accessToken;

const DEV_NANJING = [118.78, 32.04, 0];

export default class SlideshowMap extends Threebox {
  constructor (options) {
    super(new mapboxgl.Map(options));

    this.__installed = false;

    this.components = {};

    this._installHelperObjects();

    this.setupDefaultLights();

    this.map.on('moveend', (ev) => {
      this.animateComponents(ev);
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

  addToMap (name, component, lntLat = [ 0, 0 ]) {
    this.components[name] = component;
    this.addAtCoordinate(component.obj, lntLat);
  }

  addToPlane (name, component, coords = [ 0, 0 ]) {
    this.components[name] = component;
    this.plane.add(component.obj);
  }

  getComponent (name) {
    return this.components[name];
  }

  installComponents () {
    if (this.__installed) {
      console.error('Cannot install Objects twice!');
      return
    }
    this.__installed = true;

    const box = new Box({
      width: 200,
      height: 200,
      depth: 400,
    });

    this.addToMap('box', box, DEV_NANJING);

    this.addToPlane('link', new Link({}));

    this.addToMap('radioWave', new RadioWave({}), DEV_NANJING);

    const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ),
      new THREE.MeshBasicMaterial( {
        transparent: true,
        opacity: 0.5,
        color: 0x00fffc,
        side: THREE.DoubleSide
      } )
    );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 2;
    this.plane.add(mesh);

    // const video = document.getElementById( 'video' );
    //
    // const texture = new THREE.VideoTexture( video );
    // texture.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearFilter;
    // // texture.format = THREE.RGBFormat;
    //
    // var mat = new THREE.MeshBasicMaterial({
    //   transparent: true,
    //   map: texture
    // });
    //
    // var geometry = new THREE.PlaneGeometry( 2000, 2000, 1 );
    // var circle = new THREE.Mesh( geometry, mat );
    //
    // this.addAtCoordinate(circle, DEV_NANJING);

    // const width = 200, height = 100;
    //
    // const background = new THREE.Shape();
    //
    // background.moveTo(0, 0);
    // background.lineTo(width, 0);
    // background.lineTo(width, height);
    // background.lineTo(0, height);
    // background.lineTo(0, 0);
    //
    // var geometry = new THREE.ShapeGeometry( background);
    // var material = new THREE.MeshPhongMaterial( {
    //   transparent: true,
    //   opacity: 0.5,
    //   color: 0x00eeee,
    //   // depthTest: false,
    //   // side: THREE.DoubleSide
    // } );
    // var mesh = new THREE.Mesh( geometry, material ) ;
    //
    // // geometry.rotateX(- Math.PI / 2);
    // // geometry.translate(-1000, 0, 1000);
    //
    // this.plane.add(mesh);
    //
    //
    //
    // this.plane.add( link );
    // this.components.link = link;
  }

  flyTo (options) {

    const {
      areaName,
      content,
      description,
      lngLat,
      zoom
    } = options;

    this.visible = false;

    this.map.flyTo({
      center: lngLat,
      zoom,
    }, {
      options
    })
  }

  set visible (v) {
    this.scene.visible = v;
    this.svgScene.visible = v;
  }

  get visible () {
    return this.world.visible
  }

  animateComponents ({ options }) {
    if (!options) {
      return
    }

    const coords = options.lngLat.slice();
    coords[2] = 400;
    const vector = this.projectToPlane(coords);

    const box = this.getComponent('box');
    this.moveToCoordinate(box.obj, options.lngLat);

    box.update(options);
    this.getComponent('link').update(vector);

    const radioWave = this.getComponent('radioWave');
    this.moveToCoordinate(radioWave.obj, options.lngLat);
    radioWave.update();

    box.visible = !!options.pillar;
    radioWave.visible = !options.pillar;

    this.visible = true;
  }
}
