/**
 * Created by Jeffrey on 2018/4/24.
 */

import Component from './Component';
import { Box as Default } from '../constants';
import { timeline } from 'popmotion';

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

    mesh.add(new THREE.Mesh(
      box,
      new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.8,
        // shininess: 0,
        // emissive: 0xffffff,
        // side: THREE.DoubleSide,
        flatShading: true
      })
    ));

    return mesh;
  }

  update (options) {
    const { x, y, z } = options;

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
      this._animation.reverse();
      this._animation.resume();
    }
  }
}
