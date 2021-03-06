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

    const group = new Svg('g', { filter: defs.getDef('glow2') });
    this.obj = group;

    group.append(this.marker = new Svg('path', {
      d: TRI.d,
    }));

    group.append(this.text = new Svg('text', {
      'clip-path': defs.getDef('list-text-clip')
    }));

    group.hide();
  }

  update (props) {
    super.update(props);

    const {
      position,
      height,
      markerColor = getColorStr(MainColor),
      textColor = '#fff',
      text,
      fontSize,
      fontFamily,
      hideMarker = false
    } = props;

    this.position(...position);

    // this.obj.show();

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
      dy: fontSize * 1 / 3,
      style: `font-size: ${fontSize}; font-family: ${fontFamily};`,
    });

  }

  enterAction ({ delay }) {
    const {
      text,
      height,
    } = this.props;
    const tScale = height / TRI.height * 0.5;

    const textWidth = measureText(text, this.props).width;

    return timeline([
      { track: 'visible', from: 0, to: 1, duration: delay, ease: easing.linear },
      {
        track: 'v',
        from: { scale: 0, rotate: -300, x: -textWidth },
        to: { scale: tScale, rotate: 0, x: 0 },
        duration: 60 * SPF,
        ease: easing.easeOut,
      }
    ]);
  }

  enter ({ visible, v }) {
    const height = this.props.height;
    if (visible >= 1) {
      this.obj.show();
    } else {
      this.obj.hide();
    }
    this.marker.style('transform', trans(height, v.scale, v.rotate));
    this.text.attr({ x: v.x });
  }

  leaveAction ({ delay }) {
    const {
      text,
      height,
    } = this.props;
    const tScale = height / TRI.height * 0.5;

    const textWidth = measureText(text, this.props).width;

    return timeline([
      delay,
      {
        track: 'v',
        from: { scale: tScale, rotate: 0, x: 0 },
        to: { scale: 0, rotate: -300, x: -textWidth },
        duration: 60 * SPF,
        ease: easing.easeIn,
      },
      { track: 'visible', from: 1, to: 0, duration: 1 }
    ]);
  }

  leave (state) {
    this.enter(state);
  }
}
