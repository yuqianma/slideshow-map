/**
 * Created by Jeffrey on 2018/4/30.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { SPF } from '../../constants';
import { Svg } from '../../Utils/Svg';
import { timeline } from 'popmotion';

/**
 * Frame & background
 */

export default class Frame extends Component {
  create ({ defs }) {

    this.defs = defs;

    const group = new Svg('g', {
      filter: defs.getDef('glow1'),
      opacity: 0
    });

    this.obj = group;

    group.append(this.background = new Svg('path', {
      opacity: 0.1,
    }));
    group.append(this.frame = new Svg('path', {
      'class': 'slideshow-map-frame',
      fill: 'none',
      stroke: defs.getDef('frame-g'),
      'stroke-width': 2.5,
    }));

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
      xgap,
      ygap,
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
        'M', a, -ygap,
        'L', width + xgap, -ygap,
        'L', width + xgap, height - b,
        'L', width - a + xgap * 2, height - ygap,
        'L', xgap, height - ygap,
        'L', xgap, b - ygap * 2,
        'Z'
      ].join(' ')
    });

    if (this._animate) {
      // this._animate.seek && this._animate.seek(1);
      this._animate.stop();
    }

    this._animate = timeline([
      30 * SPF,
      { track: 'opacity', from: 0, to: 1, duration: 60 * SPF }
    ]).start(({opacity}) => {
      this.obj.attr({
        opacity
      });
    });

  }

  leave () {
    this._animate.reverse();
    this._animate.resume();
  }
}
