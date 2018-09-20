/**
 * Created by Jeffrey on 2018/4/24.
 */

import Component from './Component';
import { Box as Default, Frame as FrameDefault } from '../constants';
import { delay, timeline } from 'popmotion';
import { getBoxSize } from '../helper';

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
    color = Color
  }) {

    const mesh = new THREE.Object3D();

    const box = new THREE.BoxGeometry(
      width, height, depth, SEGMENTS, SEGMENTS, SEGMENTS
    );
    box.translate(0, 0, box.parameters.depth / 2);

    // todo, try three.meshline
    const wireFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(box),
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

    mesh.add(wireFrame);

    this.material = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      transparent: true,
      opacity: 0.8,
      // shininess: 40,
      // emissive: 0xffffff,
      // side: THREE.DoubleSide,
      // flatShading: true
    });

    if (__DEV__) {
      const params = {
        opacity: this.material.opacity,
        shininess: this.material.shininess
      };

      const folder = menu.addFolder('box');
      folder.add(params, 'opacity').min(0).max(1).step(0.01).onChange(() => {
        this.material.opacity = params.opacity;
      });
      folder.add(params, 'shininess').min(0).max(200).step(1).onChange(() => {
        this.material.shininess = params.shininess;
      });
    }

    mesh.add(new THREE.Mesh(
      box,
      this.material
    ));

    return mesh;
  }

  update ({ size, opacity }) {
    const { x, y, z } = getBoxSize(size);

    this.material.opacity = opacity;

    this.obj.scale.set(x, y, 1e-6);

    this._animation = timeline([
      {
        track: 'z',
        from: 1e-6,
        to: z,
        duration: Durations[0]
      }
    ]).start(({ z }) => {
      this.obj.scale.setZ(z);
    });
  }

  leave () {
    if (this._animation) {
      delay(FrameDefault.Durations[1]).start({
        complete: () => {
          this._animation.reverse();
          this._animation.resume();
        }
      });
    }
  }
}
