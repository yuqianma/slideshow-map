/**
 * Created by Jeffrey on 2018/4/26.
 */

import Component from '../Component';
import { Link as Default, Frame as FrameDefault } from '../../constants';
import { timeline, delay } from 'popmotion';
import { getRotatedColor } from '../../Utils/Utils';

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

    link.visible = false;

    return link;
  }

  update (props) {
    super.update(props);
    const geometry = this.obj.geometry;

    this.obj.material.color = getRotatedColor(Color, props.color);

    geometry.vertices[0].set(0, 0, 0);
    geometry.vertices[1].set(0, 0, 0);
    geometry.verticesNeedUpdate = true;
  }

  enterAction () {
    const { width, height } = this.props;
    return timeline([
      {
        track: 'link',
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
    ])
  }

  beforeEnter () {
    this.visible = true;
  }

  enter ({ link }) {
    const geometry = this.obj.geometry;

    geometry.vertices[1].setX(link.x);
    geometry.vertices[1].setY(link.y);
    geometry.verticesNeedUpdate = true;

  }

  leaveAction () {
    const { width, height } = this.props;
    return timeline([
      {
        track: 'link',
        from: {
          x: width,
          y: height,
        },
        to: {
          x: 0,
          y: 0,
        },
        duration: Durations[1]
      }
    ])
  }

  leave (state) {
    this.enter(state);
  }

  afterLeave () {
    this.visible = false;
  }
}

