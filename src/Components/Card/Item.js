/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor } from '../../constants';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

const TRI = {
  d: 'M20.5,11.3L4.4,2C3.8,1.7,3.1,2.1,3.1,2.7v18.6c0,0.6,0.7,1,1.3,0.7l16.1-9.3C21,12.4,21,11.6,20.5,11.3z',
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
      transform-origin: ${TRI.width / 2}px ${TRI.height / 2}px;
      transform: scale(0.5, 0.5) translate(${-TRI.width*2}px, ${height / 2 - TRI.height / 2}px);
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
