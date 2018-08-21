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
    mesh.add(new THREE.LineSegments2(
      new THREE.WireframeGeometry2(box),
      new THREE.LineMaterial({
        color,
        // transparent: true,
        // opacity: 0.1,
        linewidth: 0.0015,
      })
    ));

    this.material = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      // shininess: 0,
      // emissive: 0xffffff,
      // side: THREE.DoubleSide,
      flatShading: true
    });

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
