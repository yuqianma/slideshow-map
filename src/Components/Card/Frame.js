/**
 * Created by Jeffrey on 2018/4/30.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { Svg } from '../../Utils/Svg';
import { timeline } from 'popmotion';

/**
 * Frame & background
 */

export default class Frame extends Component {
  create ({ defs }) {

    this.defs = defs;

    const group = new Svg('g', {
      filter: 'url(#glow1)',
    });

    this.obj = group;

    group.append(this.background = new Svg('path', {
      opacity: 0.2,
    }));
    group.append(this.frame = new Svg('path', {
      'class': 'slideshow-map-frame',
      fill: 'none',
      stroke: 'url(#frame-g)',
      'stroke-width': 2.5,
    }));

    console.log(group.node);
    console.log(this.background.node);
  }

  _updateGradient ({
    color1,
    color2
  }) {
    this.defs.linearGradient(
      'frame-g',
      { x1: 0, x2: 1, y1: 1, y2: 0 },
      [{
        offset: '0',
        'stop-color': getColorStr(color1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(color2)
      }]
    );
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

    this.frame.attr({
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

    this.background.attr({
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
