/**
 * Created by Jeffrey on 2018/5/4.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { SPF } from '../../constants';
import { Svg, measureText } from '../../Utils/Svg';
import { timeline } from 'popmotion';

export default class Num extends Component {
  create ({ defs }) {
    this.defs = defs;

    const g = this.defs.linearGradient('num-g', null, [{
        offset: '0',
        'stop-color': 'rgba(255, 255, 255, 1)'
      }, {
        offset: '0',
        'stop-color': 'rgba(255, 255, 255, 0)'
      }]
    );

    this.stops = g.stops();

    return new Svg('text', {
      opacity: 0.8,
      fill: 'url(#num-g)',
    });
  }

  update (props) {
    console.log(props);
    let {
      num,
      fontSize,
      fontFamily,
    } = props;

    fontSize *= 3.5;

    this.obj.node.textContent = (num + '').padStart(2, '0');
    this.obj.attr({
      x: - fontSize / 2 - props.a,
      y: fontSize / 2 + props.b / 4,
      'text-anchor': 'right',
      style: `font-weight: bold; font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: alphabetic`,
    });

    this._animate = timeline([
      45 * SPF,
      { track: 'v', from: 0, to: 1, duration: 60 * SPF}
    ]).start( ({v}) => {
      this.stops[1].attr({
        offset: `${Math.min(v * 200, 100)}%`,
        'stop-color': `rgba(255, 255, 255, ${v < 0.5 ? 0 : (v - 0.5) * 2})`
      });
    });

  }

  leave () {
    this._animate.reverse();
    this._animate.resume();
  }
}
