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
    width = 20,
    height = 20,
    depth = 20,
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
    const { lngLat } = options;

    this.obj.scale.setZ(1e-6);

    timeline([
      {
        track: 'z',
        from: 1e-6,
        to: 1,
        duration: Durations[0]
      },
      // Durations[1],
      // {
      //   track: 'z',
      //   from: 1,
      //   to: 1e-6,
      //   duration: Durations[2]
      // }
    ]).start(({ z }) => {
      this.obj.scale.setZ(z);
    });
  }

  leave () {

  }
}
