/**
 * Created by Jeffrey on 2018/4/24.
 */

import Component from './Component';
import { Box as Default, Frame as FrameDefault } from '../constants';
import { timeline } from 'popmotion';
import { getShapeSize } from '../helper';
import EffectCircle from './EffectCircle';

const {
  Color,
  Durations
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
        // transparent: true,
        // opacity: 0.1,
        linewidth: 0.0015,
      })
    );
    // wireFrame.material.color = color;
    // wireFrame.material.opacity = 1;
    // wireFrame.material.transparent = true;

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
    this.boxMaterial.opacity = opacity;
    this.box.scale.set(x, y, 1e-6);

    this.circle.update(this.props);
  }

  enterAction () {
    const { boxSize } = this.props;
    const { z } = boxSize;

    return timeline([
      {
        track: 'z',
        from: 1e-6,
        to: z,
        duration: Durations[0]
      }
    ]);
  }

  beforeEnter () {
    this.visible = true;
    this.circle.play();
  }

  enter ({ z }) {
    this.box.scale.setZ(z);
  }

  leaveAction () {
    return timeline([
      Durations[1],
      {
        track: 'z',
        from: this.obj.scale.z,
        to: 1e-6,
        duration: Durations[2]
      }
    ]);
  }

  leave ({ z }) {
    this.box.scale.setZ(z);
  }

  afterLeave () {
    this.visible = false;
    this.circle.stop();
  }
}
