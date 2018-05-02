/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor } from '../../constants';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

const TRI = {
  // centered path
  d: 'M11.12-.73-5-10a.84.84,0,0,0-1.26.73V9.3A.84.84,0,0,0-5,10L11.12.73A.84.84,0,0,0,11.12-.73Z',
  width: 24,
  height: 24,
};

export default class Item extends Component {
  create ({ defs }) {
    this.defs = defs;

    const group = svgObject('g')({
      filter: 'url(#glow2)',
    });

    this.marker = svg('path')({
      d: TRI.d,
    });

    this.text = svg('text')();

    group.node.appendChild(this.marker);
    group.node.appendChild(this.text);

    return group
  }

  update ({
    height,
    markerColor = getColorStr(MainColor),
    textColor = '#fff',
    text,
    fontSize,
    fontFamily,
  }) {
    attr(this.marker)({
      style: `
      transform: translate(${-TRI.width / 2}px, ${height / 2}px) scale(0.5) rotate(0deg);
      `,
      fill: markerColor
    });

    this.text.textContent = text;
    attr(this.text)({
      fill: textColor,
      y: height / 2,
      style: `font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
    });
  }

  dispose () {

  }
}
