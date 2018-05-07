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
  create ({
    a = [0, 0, 0],
    b = [0, 0, 0],
    color = Default.Color
  }) {

    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(...a),
      new THREE.Vector3(...b)
    );

    const link = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial({
      color
    }) );

    return link;
  }

  update (options) {
    const {
      x, y,
      dx, dy
    } = options;

    const geometry = this.obj.geometry;

    geometry.vertices[0].set(x, y, 0);
    geometry.vertices[1].set(x, y, 0);
    geometry.verticesNeedUpdate = true;

    this._animate = timeline([
      Durations[0],
      {
        track: 'v',
        from: {
          x,
          y,
        },
        to: {
          x: x + dx,
          y: y + dy,
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

  leave () {
    this._animate.reverse();
    this._animate.resume();
  }
}

