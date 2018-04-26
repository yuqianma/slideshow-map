/**
 * Created by Jeffrey on 2018/4/26.
 */

import Component from './Component';
import { Link as Default } from '../constants';
import { timeline } from 'popmotion';

const {
  Color,
  Durations
} = Default;

export default class Link extends Component {
  constructor ({
    a = [0, 0, 0],
    b = [0, 0, 0],
    color = Default.Color
  }) {
    super();

    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(...a),
      new THREE.Vector3(...b)
    );

    const link = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial({
      color
    }) );

    this.obj = link;
  }

  update (vector) {
    const { x, y } = vector;
    const geometry = this.obj.geometry;

    geometry.vertices[0].copy(vector);
    geometry.vertices[1].copy(vector);
    geometry.verticesNeedUpdate = true;

    timeline([
      Durations[0],
      {
        track: 'v',
        from: {
          x,
          y,
        },
        to: {
          x: x + 100,
          y: y + 200,
        },
        duration: Durations[1]
      }
      // Default.Durations[2],
    ]).start(({v}) => {
      geometry.vertices[1].setX(v.x);
      geometry.vertices[1].setY(v.y);
      geometry.verticesNeedUpdate = true;
    });
  }
}

