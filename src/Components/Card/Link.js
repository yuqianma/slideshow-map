/**
 * Created by Jeffrey on 2018/4/26.
 */

import Component from '../Component';
import { Link as Default, Frame as FrameDefault } from '../../constants';
import { timeline, delay } from 'popmotion';

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
      width, height
    } = options;

    const geometry = this.obj.geometry;

    geometry.vertices[0].set(0, 0, 0);
    geometry.vertices[1].set(0, 0, 0);
    geometry.verticesNeedUpdate = true;

    if (this._animate) {
      // this._animate.seek && this._animate.seek(1);
      this._animate.stop();
    }

    this._animate = timeline([
      Durations[0],
      {
        track: 'v',
        from: {
          x: 0,
          y: 0,
        },
        to: {
          x: width,
          y: height,
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
    delay(FrameDefault.Durations[1] / 3).start({
      complete: () => {
        if (this._animate) {
          this._animate.reverse();
          this._animate.resume();
        }
      }
    });
  }
}

