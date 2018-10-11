/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor, SPF } from '../../constants';
import { getColorStr } from '../../Utils/Utils';
import { Svg, measureText } from '../../Utils/Svg';
import { timeline, easing } from 'popmotion';

const TRI = {
  // centered path
  d: 'M11.12-.73-5-10a.84.84,0,0,0-1.26.73V9.3A.84.84,0,0,0-5,10L11.12.73A.84.84,0,0,0,11.12-.73Z',
  width: 24,
  height: 24,
};

const trans = (height, s, r) => `translate(${-height / 2}px, ${height / 2}px) scale(${s}) rotate(${r}deg)`;

export default class Item extends Component {
  create ({ defs }) {
    this.defs = defs;

    this.textWidth = 0;

    const group = new Svg('g', { filter: 'url(#glow2)' });
    this.obj = group;

    group.append(this.marker = new Svg('path', {
      d: TRI.d,
    }));

    group.append(this.text = new Svg('text', {
      'clip-path': 'url(#list-text-clip)'
    }));

    group.hide();
  }

  update (props) {
    const {
      height,
      markerColor = getColorStr(MainColor),
      textColor = '#fff',
      text,
      fontSize,
      fontFamily,
      hideMarker = false
    } = props;

    this.obj.show();

    if (hideMarker) {
      this.marker.hide();
    }

    this.marker.attr({
      fill: markerColor
    });

    this.text.node.textContent = text;
    this.text.attr({
      fill: textColor,
      y: height / 2,
      style: `font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
    });

    this.textWidth = measureText(text, props).width;

    this.enter(props);
  }

  enter ({
    height
  }) {

    const tScale = height / TRI.height * 0.5;

    if (this._animate) {
      // this._animate.seek && this._animate.seek(1);
      this._animate.stop();
    }

    this._animate = timeline([
      {
        track: 'v',
        from: { scale: 0, rotate: -300, x: -this.textWidth },
        to: { scale: tScale, rotate: 0, x: 0 },
        duration: 60 * SPF,
        ease: easing.easeOut,
      }
    ]).start(({ v }) => {
      this.marker.style('transform', trans(height, v.scale, v.rotate));
      this.text.attr({ x: v.x });
    });

  }

  leave () {
    this._animate.reverse();
    this._animate.resume();
  }
}
