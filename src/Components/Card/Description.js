/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { SPF } from '../../constants';
import { getColorStr } from '../../Utils/Utils';
import { Svg } from '../../Utils/Svg';
import { timeline, tween, physics, delay, chain, easing } from 'popmotion';
import { getTruncated } from '../../helper';

const Path = {
  Outer: 'M-2.631,9.96c-0.149,0.403-0.531,0.652-0.938,0.652c-0.116,0-0.233-0.02-0.348-0.062  C-8.303,8.92-11.25,4.681-11.25,0c0-0.776,0.079-1.549,0.234-2.299c0.113-0.541,0.641-0.891,1.183-0.775  c0.541,0.112,0.889,0.642,0.776,1.183C-9.186-1.276-9.25-0.64-9.25,0c0,3.849,2.423,7.335,6.029,8.674  C-2.702,8.867-2.438,9.442-2.631,9.96z M11.015-2.3c-0.113-0.541-0.644-0.89-1.183-0.775C9.291-2.963,8.943-2.434,9.056-1.892  C9.185-1.273,9.25-0.637,9.25,0c0,3.851-2.426,7.338-6.035,8.676c-0.518,0.191-0.782,0.768-0.59,1.285  c0.149,0.403,0.531,0.652,0.938,0.652c0.115,0,0.233-0.02,0.348-0.062C8.301,8.924,11.25,4.684,11.25,0  C11.25-0.773,11.171-1.547,11.015-2.3z M-8.012-5.396c0.294,0,0.585-0.128,0.782-0.375C-5.462-7.982-2.827-9.25,0-9.25  c2.824,0,5.458,1.266,7.226,3.474c0.344,0.43,0.973,0.501,1.405,0.156c0.431-0.345,0.501-0.975,0.155-1.406  C6.638-9.71,3.436-11.25,0-11.25c-3.438,0-6.643,1.542-8.792,4.229C-9.137-6.589-9.066-5.96-8.636-5.615  C-8.451-5.468-8.23-5.396-8.012-5.396z',
  Inner: 'M7.625,0c0-4.205-3.421-7.625-7.625-7.625S-7.625-4.204-7.625,0c0,4.205,3.421,7.625,7.625,7.625  S7.625,4.205,7.625,0z M0,6.875c-3.791,0-6.875-3.084-6.875-6.875c0-3.791,3.084-6.875,6.875-6.875S6.875-3.791,6.875,0  C6.875,3.791,3.791,6.875,0,6.875z',
  width: 22,
  height: 22,
};

export default class Description extends Component {
  create ({ defs }) {
    this.defs = defs;

    const group = new Svg('g');
    this.obj = group;

    const marker = this.marker = new Svg('g', {
      opacity: 0
    });

    marker.append(this.outer = new Svg('path', {
      d: Path.Outer,
    }));

    marker.append(this.inner = new Svg('path', {
      d: Path.Inner,
    }));

    marker.append(this.core = new Svg('circle', {
      r: 3,
      fill: '#fff',
    }));

    group.append(marker);
    group.append(this.text = new Svg('text'));

    return group
  }

  update (props) {
    super.update(props);

    const {
      width,
      color,
      fontSize,
      fontFamily,
    } = props;

    const textIndent = fontSize * 1.5;

    const text = getTruncated(props.text, width - textIndent, { fontSize, fontFamily });

    this.props.text = text;

    const height = fontSize * 2.6;

    this.marker.node.style.transform = `translate(${fontSize / 2}px, ${height / 2}px) scale(${fontSize / 18})`;

    this.marker.attr({
      fill: getColorStr(color)
    });

    // this.text.textContent = text;
    this.text.attr({
      x: textIndent,
      y: height / 2,
      fill: getColorStr(color),
      style: `font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: middle`,
    });

    this.core.attr('r', 0);
    this.outer.attr('opacity', 0);
    this.marker.attr('opacity', 1);
    this.inner.attr('opacity', 0);

    this.obj.visible = false;
  }

  enterAction () {
    const { text } = this.props;
    // 16 SPF

    return timeline([
      { track: 'r', from: 0, to: 3, duration: 76 * SPF, ease: easing.backOut },

      0 * SPF,
      { track: 'i', from: 0, to: text.length, duration: 60 * SPF, ease: easing.backIn }
    ]);
  }

  beforeEnter (props) {
    const {
      color,
      text,
      fontSize,
      fontFamily,
    } = props;

    this._animates = [];

    this._animates[0] = tween({
      from: 0, to: 360, duration: 500 * SPF, loop: Infinity, ease: easing.linear
    }).start((v) => {
      this.outer.style('transform', `rotate(${v}deg)`);
    });

    this._animates[1] = physics({
      velocity: 1000,
      friction: 0.8,
      to: 1,
      springStrength: 1500
    }).start((v) => {
      this.outer.attr('opacity', v);
    });

    this._animates[2] = chain(
      delay(14 * SPF),
      physics({
        velocity: 1000,
        friction: 0.8,
        to: 1,
        springStrength: 1500
      })
    ).start((v) => {
      this.inner.attr('opacity', v);
    });

    this.obj.visible = true;
  }

  enter ({ r, i }) {
    this.core.attr({ r });
    this.text.node.textContent = this.props.text.substr(0, i);
  }

  leaveAction () {
    const { text } = this.props;
    return timeline([
      { track: 'i', from: text.length, to: 0, duration: 60 * SPF, ease: easing.backOut }
    ]);
  }

  leave ({ i }) {
    this.text.node.textContent = this.props.text.substr(0, i);
    this.marker.attr({ opacity: i });
  }

  afterLeave () {
    this._animates.forEach(ani => ani.stop());
    this._animates = [];
  }

}
