import './three';
import Threebox from './Threebox';
import mapboxgl from 'mapbox-gl';
import {
  Box,
  RadioWave,
  Card,
  EffectCircle,
  EffectGlobal
} from './Components';
import {
  calcFittedSize,
  getBoxSize, getLinkSize,
  getValidSize,
} from './helper';
import { timeline, easing } from 'popmotion';

const DEV_NANJING = [118.78, 32.04, 0];

export default class Slideshow extends Threebox {
  constructor (options) {
    if (!__DEV__) {
      options.interactive = false;
    }

    super(new mapboxgl.Map(options));

    this.__installed = false;

    this.c = {};

    this._installHelperObjects();

    this.setupDefaultLights();

    this.map.on('moveend', (ev) => {
      window.setTimeout(() => {
        this.animateComponents(ev);
      }, 500);
    });

    this.visible = false;
  }

  // Add these helpers to use their inner methods.
  // So no need to calculate manually.
  _installHelperObjects () {
    const mapObj = new THREE.Object3D();
    this._mapObj = this.addAtCoordinate(mapObj, [0, 0]);
  }

  getSize () {
    return this.map.transform
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

  moveToCoordinate (object, lnglat, options) {
    super.moveToCoordinate(object.obj || object, lnglat, options);
  }

  addToMap (component, lnglat = [ 0, 0 ], options) {
    this.addAtCoordinate(component.obj, lnglat, options);
  }

  addToPlane (component, coords = [ 0, 0 ]) {
    this.plane.add(component.obj);
  }

  addToPlane2 (component, coords = [ 0, 0 ]) {
    this.plane2.add(component.obj);
  }

  installComponents ({ globalUrl, effectCircleUrl }) {
    if (this.__installed) {
      console.error('Cannot install Objects twice!');
      return
    }
    this.__installed = true;

    this.addToMap(this.c.box = new Box({}), DEV_NANJING);

    this.addToMap(this.c.radioWave = new RadioWave(), DEV_NANJING);

    this.c.effectGlobal = new EffectGlobal({
      src: globalUrl || 'dev/global.webm'
    });

    this.addToPlane(this.c.card = new Card({
      defs: this.defs,
      svg: this.svgRenderer.domElement,
      effectGlobal: this.c.effectGlobal
    }));

    this.addToMap(this.c.effectCircle = new EffectCircle({
      src: effectCircleUrl || 'dev/circle2.webm'
    }), DEV_NANJING);

    // 好乱……
    // 因为svg放视频被chrome限制了
    // 就再搞个scene让three渲染吧
    // 然后这个和card组件其实就脱离了
    this.addToPlane2(this.c.effectGlobal);
  }

  _test (options) {
    this.c.card.position(-50, 200, 0);
    this.c.card.update(options);
  }

  flyTo (options, cb) {

    const {
      areaName,
      content,
      description,
      lngLat,
      zoom,
      pitch
    } = options;

    this.visible = false;

    const [lng, lat] = lngLat;

    this.map.flyTo({
      // [0.005713705081944909, 0.010004240534200903]
      // center: [lng + 0.005713705081944909, lat + 0.010004240534200903],
      center: [lng, lat],
      zoom,
      pitch,
      bearing: Math.random() * 180 | 0 - 90,
    }, {
      options,
      cb
    });


  }

  set visible (v) {
    this.scene.visible = v;
    this.svgScene.visible = v;
  }

  get visible () {
    return this.world.visible
  }

  setDomOpacity (v) {
    this.renderer.domElement.style.opacity = v;
    this.svgRenderer.domElement.style.opacity = v;
  }

  leave (cb) {
      this.c.box.leave();
      this.c.radioWave.leave();
      this.c.card.leave();

      timeline([
        {
          duration: 2000,
          track: 'opacity',
          ease: easing.easeOut,
          from : 1,
          to   : 0
        },
        1000
      ]).start({
        update: ({opacity}) => {
          this.setDomOpacity(opacity);
        },
        complete: cb
      });
  }

  animateComponents ({ options, cb }) {
    if (!options) {
      return
    }

    const {
      areaName,
      contents,
      description,
      type,
      fixed,
      size = 2,
      opacity = 1,
      lngLat,
      fontFamily
    } = options;

    const coords = lngLat.slice();

    if (type === 'pillar') {
      this.c.box.visible = true;
      this.c.effectCircle.visible = true;
      this.c.radioWave.visible = false;

      const boxSize = getBoxSize(size);

      coords[2] = boxSize.z;
      this.moveToCoordinate(this.c.box, lngLat);
      this.moveToCoordinate(this.c.effectCircle, lngLat);
      this.c.box.update({
        size,
        opacity
      });

      setTimeout(cb, 4000);

    } else {
      this.c.box.visible = false;
      this.c.effectCircle.visible = false;
      this.c.radioWave.visible = true;
      const coords = lngLat.slice();

      coords[2] = 0;
      this.moveToCoordinate(this.c.radioWave, lngLat);
      this.c.radioWave.update({
        size,
        opacity
      });

      setTimeout(cb, 3000);
    }

    const vector = this.projectToPlane(coords);
    const viewSize = this.getSize();
    const validSize = getValidSize({
      x: vector.x,
      y: vector.y,
      ...viewSize
    });

    this.c.card.position(vector.x, vector.y, 0);
    this.c.card.update({
      ...options,
      viewportWidth: viewSize.width,
      width: validSize.width,
      height: validSize.height
    });

    // →_→越乱越坑
    this.c.effectGlobal.position(vector.x, vector.y, 0);

    this.visible = true;
    this.setDomOpacity(1);
  }
}
