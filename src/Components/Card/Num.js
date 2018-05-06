/**
 * Created by Jeffrey on 2018/5/4.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { SPF } from '../../constants';
import { Svg } from '../../Utils/Svg';
import { tween } from 'popmotion';

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
      fill: 'url(#num-g)',
    });
  }

  update (props) {
    const { num } = props;

    this.obj.node.textContent = num;

    tween({ duration: 60 * SPF }).start( v => {
      this.stops[1].attr({
        offset: `${Math.min(v * 200, 100)}%`,
        'stop-color': `rgba(255, 255, 255, ${v < 0.5 ? 0 : (v - 0.5) * 2})`
      });
    });
  }

  leave () {
    tween({ duration: 60 * SPF }).start( v => {
      v = 1 - v;
      this.stops[1].attr({
        offset: `${Math.min(v * 200, 100)}%`,
        'stop-color': `rgba(255, 255, 255, ${v < 0.5 ? 0 : (v - 0.5) * 2})`
      });
    });
  }
}
