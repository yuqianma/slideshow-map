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
  getShapeSize, getLinkSize,
  getValidSize,
} from './helper';
import {
  action,
  timeline,
  easing,
  delay,
  chain
} from 'popmotion';

if (__DEV__) {
  window._easing = easing;
}

const DEV_NANJING = [118.78, 32.04, 0];

const BEARING_RANGE = [-75, -15];
const getRandomBearing = () => (Math.random() * (BEARING_RANGE[1] - BEARING_RANGE[0]) | 0) + BEARING_RANGE[0];

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

    this._onmapmoveend = this._onmapmoveend.bind(this);

    this.map.on('moveend', this._onmapmoveend);
  }

  // Add these helpers to use their inner methods.
  // So no need to calculate manually.
  _installHelperObjects () {
    const mapObj = new THREE.Object3D();
    this._mapObj = this.addAtCoordinate(mapObj, [0, 0]);
  }

  getSize () {
    const { width, height, scale } = this.map.transform;
    return {
      width, height, scale
    }
  }

  projectToScene (lngLat, coords) {

    const vector = new THREE.Vector3(...coords);

    this.moveToCoordinate(this._mapObj, lngLat);
    this._mapObj.parent.updateMatrixWorld(); // update the matrixWorld immediately
    this._mapObj.localToWorld(vector);

    return vector;
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

  addToMap (component, lnglat = [0, 0], options) {
    this.addAtCoordinate(component.obj, lnglat, options);
  }

  addToPlane (component, coords = [0, 0]) {
    this.plane.add(component.obj);
  }

  addToPlane2 (component, coords = [0, 0]) {
    this.plane2.add(component.obj);
  }

  installComponents ({globalUrl, effectCircleUrl}) {
    if (this.__installed) {
      console.error('Cannot install Objects twice!');
      return;
    }
    this.__installed = true;

    this.addToMap(this.c.box = new Box({
      src: effectCircleUrl
    }), DEV_NANJING);

    this.addToMap(this.c.radioWave = new RadioWave(), DEV_NANJING);

    this.addToPlane(this.c.card = new Card({
      defs: this.defs,
      svg: this.svgRenderer.domElement,
      effectGlobal: this.c.effectGlobal
    }));

    this.c.effectGlobal = new EffectGlobal({
      src: globalUrl || 'dev/global.webm'
    });

    // this.addToMap(this.c.effectCircle = new EffectCircle({
    //   src: effectCircleUrl || 'dev/circle.webm'
    // }), DEV_NANJING);

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

  _onmapmoveend () {
    delay(1).start({
      complete: () => {
        this.__mapFlyComplete && this.__mapFlyComplete();
      }
    });
  }

  _turn (options) {
    return chain(
      this._flyTo(options),
      this._enter(options)
    );
  }

  _flyTo (options) {
    return action(({ complete }) => {

      this.__mapFlyComplete = complete;

      this.map.flyTo({
        center: [...options.lngLat],
        bearing: getRandomBearing(),
        ...options
      });

      return {
        stop: () => this.map.stop()
      };

    });
  }

  flyTo (options, cb) {

    // const {
    //   areaName,
    //   content,
    //   description,
    //   lngLat,
    //   zoom,
    //   pitch,
    //   curve
    // } = options;
    //
    // // todo, no vis control in method
    // this.visible = false;
    //
    // const [lng, lat] = lngLat;
    //
    // this.map.flyTo({
    //   // [0.005713705081944909, 0.010004240534200903]
    //   // center: [lng + 0.005713705081944909, lat + 0.010004240534200903],
    //   center: [lng, lat],
    //   bearing: (Math.random() * (BEARING_RANGE[1] - BEARING_RANGE[0]) | 0) + BEARING_RANGE[0],
    //   ...options
    // }, {
    //   options,
    //   cb
    // });

  }

  set visible (v) {
    this.scene.visible = v;
    this.scene2.visible = v;
    this.svgScene.visible = v;
  }

  get visible () {
    return this.world.visible;
  }

  setDomOpacity (v) {
    this.renderer.domElement.style.opacity = v;
    this.svgRenderer.domElement.style.opacity = v;
  }

  leave (cb) {
    this.c.box.leave();
    this.c.radioWave.leave();
    this.c.card.leave();
    this.c.effectCircle.leave();

    this._leaving = timeline([
      {
        duration: 2000,
        track: 'opacity',
        ease: easing.easeOut,
        from: 1,
        to: 0
      },
      1000
    ]).start({
      update: ({opacity}) => {
        this.setDomOpacity(opacity);
      },
      complete: cb
    });
  }

  stop () {
    this.map.stop();
    this._leaving && this._leaving.stop();
    clearTimeout(this._timeout);
  }

  _updateBoxLight ({ size, viewSize, lngLat }) {
    const boxSize = getShapeSize(size, viewSize.scale, viewSize.height);
    const lightSize = this.projectToScene(lngLat, [boxSize.x, boxSize.y, boxSize.z]);
    this.updatePointLights(lightSize);
  }

  _enter (options) {
    return action(({ complete }) => {

      const viewSize = this.getSize();

      const props = {
        ...options,
        viewSize,
      };

      const {
        type,
        lngLat,
        fixed,
        size,
        opacity,
      } = props;

      const planeCoords = lngLat.slice();

      const { box, card, radioWave } = this.c;

      console.log(type);

      let animateComponents = [];

      const shapeSize = getShapeSize(size, viewSize.scale, viewSize.height);

      if (type === 'pillar') {

        this._updateBoxLight(props);

        this.moveToCoordinate(box, lngLat);

        box.update({
          ...props,
          boxSize: shapeSize
        });

        // move card above pillar
        planeCoords[2] = shapeSize.z;

        animateComponents = [
          box,
          card
        ];

      } else {

        this.moveToCoordinate(radioWave, lngLat);
        radioWave.update({
          shapeSize,
          opacity
        });

        animateComponents = [
          radioWave,
          card
        ];
      }

      const vector = this.projectToPlane(planeCoords);
      const validSize = getValidSize({
        withLink: !fixed,
        x: vector.x,
        y: vector.y,
        ...viewSize
      });

      card.update({
        ...options,
        position: [vector.x, vector.y, 0],
        viewportWidth: viewSize.width,
        viewportHeight: viewSize.height,
        width: validSize.width,
        height: validSize.height
      });

      const enter = (component, complete) => {
        this.playback = component.enterAction().start({
          update: (v) => component.__enter(v),
          complete
        });
      };

      function runNext () {
        const next = animateComponents.shift();
        if (next) {
          enter(next, runNext);
        } else {
          complete();
        }
      }

      runNext();

      return {
        stop: () => {
          this.playback.stop();
        }
      }
    });

  }
}
