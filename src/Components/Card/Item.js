/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor } from '../../constants';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

export default class Item extends Component {
  create ({ defs }) {
    this.defs = defs;

    const group = svgObject('g')({
      filter: 'url(#glow2)',
    });

    const p = -10, h = 10;
    this.marker = svg('path')({
      d: `M0 0 L ${h/2*1.73} ${h/2} L 0 ${h} Z`,
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
      style: `transform: translate(-15px, ${height / 2 - 5}px);`,
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
