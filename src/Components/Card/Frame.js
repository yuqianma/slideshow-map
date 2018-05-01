/**
 * Created by Jeffrey on 2018/4/30.
 */

import Component from '../Component';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

/**
 * Frame & background
 */

export default class Frame extends Component {
  create ({ defs }) {

    this.defs = defs;

    const group = svgObject('g')();

    const path = svg('path');

    this.background = path({
      opacity: 0.2,
    });
    this.frame = path({
      fill: 'none',
      stroke: 'url(#frame-g)',
      'stroke-width': 2.5,
    });

    group.node.appendChild(this.background);
    group.node.appendChild(this.frame);

    this._createGradient();

    return group
  }

  _createGradient () {
    const defs = this.defs;
    this._gradients = {
      frame: linearGradient(defs)('frame-g')
    };
  }

  _updateGradient ({
    color1,
    color2
  }) {
    this._gradients.frame({
      x1: 0,
      x2: 1,
      y1: 1,
      y2: 0,
      stops: [{
        offset: '0',
        'stop-color': getColorStr(color1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(color2)
      }]
    });
  }

  update (props) {
    const {
      a, // corner triangle horizontal line
      b, // corner triangle vertical line,
      gap,
      width, // width & height are frame's
      height,
      color1,
      color2,
    } = props;

    this._updateGradient(props);

    attr(this.frame)({
      d: [
        'M', a, 0,
        'L', width, 0,
        'L', width, height - b,
        'L', width - a, height,
        'L', 0, height,
        'L', 0, b,
        'Z'
      ].join(' ')
    });

    attr(this.background)({
      fill: getColorStr(color1),
      d: [
        'M', a, -gap,
        'L', width + gap, -gap,
        'L', width + gap, height - b,
        'L', width - a + gap * 2, height - gap,
        'L', gap, height - gap,
        'L', gap, b - gap * 2,
        'Z'
      ].join(' ')
    });
  }
}