/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor, SPF } from '../../constants';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip, measureText } from '../../Utils/Svg';
import { timeline, easing } from 'popmotion';

const TRI = {
  // centered path
  d: 'M11.12-.73-5-10a.84.84,0,0,0-1.26.73V9.3A.84.84,0,0,0-5,10L11.12.73A.84.84,0,0,0,11.12-.73Z',
  width: 24,
  height: 24,
};

const trans = (height, s, r) => `translate(${-TRI.width / 2}px, ${height / 2}px) scale(${s}) rotate(${r}deg)`;

export default class Item extends Component {
  create ({ defs }) {
    this.defs = defs;

    this.textWidth = 0;

    const group = svgObject('g')({
      filter: 'url(#glow2)',
    });

    this.marker = svg('path')({
      d: TRI.d,
    });

    this.text = svg('text')({
      'clip-path': 'url(#list-text-clip)'
    });

    group.node.appendChild(this.marker);
    group.node.appendChild(this.text);

    return group
  }

  update (props) {
    const {
      height,
      markerColor = getColorStr(MainColor),
      textColor = '#fff',
      text,
      fontSize,
      fontFamily,
    } = props;

    attr(this.marker)({
      fill: markerColor
    });

    this.text.textContent = text;
    attr(this.text)({
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

    timeline([
      {
        track: 'v',
        from: {
          scale: 0,
          rotate: -300,
          x: -this.textWidth,
        },
        to: {
          scale: 0.5,
          rotate: 0,
          x: 0
        },
        duration: 60 * SPF,
        ease: easing.easeOut,
      }
    ]).start(({ v }) => {

      this.marker.style.transform = trans(height, v.scale, v.rotate);

      this.text.setAttribute('x', v.x);
    });

  }

  dispose () {

  }
}
