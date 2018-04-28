/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from './Component';
import { RadioWave as Default } from '../constants';
import { tween, stagger, easing } from 'popmotion';

const {
  Color,
} = Default;

const RING_NUM = 3;
const LIFE_SPAN = 3 * 1000;

export default class RadioWave extends Component {
  constructor ({
    color = Color
  }) {
    super();
    const group = new THREE.Object3D();

    const material = new THREE.MeshBasicMaterial( {
      color,
      morphTargets: true,
    } );

    for (let i = 0; i < RING_NUM; i++) {
      const geometry = new THREE.RingGeometry(-16, 0, 32);

      const targetGeometry = new THREE.RingGeometry(127, 128, 32);
      const vertices = targetGeometry.vertices;
      geometry.morphTargets.push({name: 'target', vertices});

      const ring = new THREE.Mesh(geometry, material);

      group.add(ring);
    }

    this.obj = group;

    this._animate();
  }

  _animate () {
    const rings = this.obj.children;
    const animations = rings.map(ring => tween({
      duration: LIFE_SPAN,
      ease: easing.easeIn,
      loop: Infinity,
    }).pipe((v) => ring.morphTargetInfluences[0] = v || 0));

    this.animation = stagger(animations, LIFE_SPAN / RING_NUM)
  }

  _startAnimate () {
    if (this._running) {
      this._running.stop();
    }
    this._running = this.animation.start();
  }

  update () {
    this._startAnimate();
  }

}
