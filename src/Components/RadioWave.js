/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from './Component';
import { RadioWave as Default, SPF } from '../constants';
import { tween, stagger, action, easing } from 'popmotion';

const {
  Color,
} = Default;

const RING_NUM = 3;
const LIFE_SPAN = 3 * 1000;

export default class RadioWave extends Component {
  create ({
    color = Color
  }) {
    const group = new THREE.Object3D();

    const material = new THREE.MeshBasicMaterial( {
      transparent: true,
      opacity: 1,
      color,
      morphTargets: true,
    } );

    this.material = material;

    for (let i = 0; i < RING_NUM; i++) {
      const geometry = new THREE.RingGeometry(-16, 0, 32);

      const targetGeometry = new THREE.RingGeometry(127, 128, 32);
      const vertices = targetGeometry.vertices;
      geometry.morphTargets.push({name: 'target', vertices});

      const ring = new THREE.Mesh(geometry, material);

      group.add(ring);
    }

    group.visible = false;

    this._animates = [];

    return group
  }

  update (props) {
    super.update(props);
    const { shapeSize, opacity } = props;
    const size = shapeSize.x / 80;
    this.material.opacity = opacity;
    this.obj.scale.set(size, size, size);
  }

  enterAction () {
    return action(({ update, complete }) => {
      update();
      complete();
    });
  }

  beforeEnter () {
    const group = this.obj;
    const rings = group.children;
    rings.map(ring => ring.morphTargetInfluences[0] = 0);
    const animations = rings.map(ring => tween({
      duration: LIFE_SPAN,
      ease: easing.linear,
      loop: Infinity,
    }).pipe((v) => ring.morphTargetInfluences[0] = v || 0));

    this._animates[0] = stagger(animations, LIFE_SPAN / RING_NUM * 2).start();

    this.visible = true;
  }

  enter () {

  }

  leaveAction () {
    return tween({
      from: this.props.opacity,
      to: 0,
      duration: 20 * SPF
    });
  }

  leave (opacity) {
    this.material.opacity = opacity;
  }

  afterLeave () {
    this.visible = false;
    this._animates.forEach(ani => ani.stop());
    this._animates = [];
  }

}
