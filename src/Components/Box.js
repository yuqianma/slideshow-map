/**
 * Created by Jeffrey on 2018/4/24.
 */

import Component from './Component';
import { Box as Default, SPF } from '../constants';
import { timeline } from 'popmotion';
import { getShapeSize } from '../helper';
import EffectCircle from './EffectCircle';

const {
  Color,
} = Default;

const SEGMENTS = 1;

export default class Box extends Component {
  create ({
    width = 1,
    height = 1,
    depth = 1,
    color = Color,
    src,
  }) {

    const group = new THREE.Group();
    this.obj = group;

    const box = new THREE.Object3D();
    this.box = box;
    group.add(box);

    this.add(this.circle = new EffectCircle({ src }));

    const boxGeometry = new THREE.BoxGeometry(
      width, height, depth, SEGMENTS, SEGMENTS, SEGMENTS
    );
    boxGeometry.translate(0, 0, boxGeometry.parameters.depth / 2);

    // todo, try three.meshline
    const wireFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeometry),
      new THREE.LineBasicMaterial({
        color: 0x00fffc,
        transparent: true,
        // opacity: 0.1,
        linewidth: 0.0015,
      })
    );

    this.wireFrame = wireFrame;

    box.add(wireFrame);

    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      transparent: true,
      opacity: 0.8,
      // shininess: 40,
      // emissive: 0xffffff,
      // side: THREE.DoubleSide,
      // flatShading: true
    });

    this.boxMaterial = boxMaterial;

    if (__DEV__) {
      const params = {
        opacity: boxMaterial.opacity,
        shininess: boxMaterial.shininess
      };

      const folder = menu.addFolder('box');
      folder.add(params, 'opacity').min(0).max(1).step(0.01).onChange(() => {
        boxMaterial.opacity = params.opacity;
      });
      folder.add(params, 'shininess').min(0).max(200).step(1).onChange(() => {
        boxMaterial.shininess = params.shininess;
      });
    }

    box.add(new THREE.Mesh(
      boxGeometry,
      boxMaterial
    ));

    this.visible = false;

    return group;
  }

  update (props) {
    super.update(props);
    const { opacity, boxSize } = props;

    const { x, y, z } = boxSize;
    this.boxMaterial.opacity = 0;
    this.box.scale.set(x, y, 1e-6);

    this.circle.update(this.props);
    this.circle.opacity = 0;
  }

  enterAction () {
    const { boxSize, opacity } = this.props;
    const { z } = boxSize;

    return timeline([
      [
        { track: 'z', from: 1e-6, to: z, duration: 30 * SPF },
        { track: 'opacity', from: 0, to: opacity, duration: 10 * SPF },
        { track: 'allOpacity', from: 0, to: 1, duration: 10 * SPF }
      ]
    ]);
  }

  beforeEnter () {
    this.visible = true;
    this.circle.play();
  }

  enter ({ z, opacity, allOpacity }) {
    this.box.scale.setZ(z);
    this.boxMaterial.opacity = opacity;

    this.wireFrame.material.opacity = allOpacity;
    this.circle.opacity = allOpacity;
  }

  leaveAction () {
    return timeline([
      { track: 'z', from: this.props.boxSize.z, to: 1e-6, duration: 30 * SPF },

      0,
      [
        { track: 'opacity', from: this.props.opacity, to: 0, duration: 30 * SPF },
        { track: 'allOpacity', from: 1, to: 0, duration: 30 * SPF }
      ]
    ]);
  }

  leave (state) {
    this.enter(state);
  }

  afterLeave () {
    this.visible = false;
    this.circle.stop();
  }
}
