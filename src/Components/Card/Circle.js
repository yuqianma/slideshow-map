/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { MainColor } from '../../constants';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

const sqrt3 = Math.sqrt(3);

export default class Circle extends Component {
  create ({ defs }) {
    this.defs = defs;

    const group = svgObject('g')();

    const circle = svg('circle');

    this.outer = circle({
      r: 10,
      fill: 'none',
      stroke: '#fff',
      'stroke-width': 3,
    });

    this.inner = circle({
      r: 7,
      fill: 'none',
      stroke: '#fff',
      'stroke-width': 1,
    });

    this.core = circle({
      r: 0,
      fill: '#fff'
    });

    this.text = svg('text')();

    group.node.appendChild(this.outer);
    group.node.appendChild(this.inner);
    group.node.appendChild(this.core);
    group.node.appendChild(this.text);

    return group
  }

  update ({
    color,
    text,
    height = 20,
    fontSize,
    fontFamily,
  }) {

    this.text.textContent = text;
    attr(this.text)({
      x: 20,
      y: height / 2,
      fill: color,
      style: `font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
    });
  }
}
