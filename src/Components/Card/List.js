/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { getColorStr, radify } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip, measureText } from '../../Utils/Svg';
import { timeline } from 'popmotion';
import Item from './Item';

export function calcContentsSize ({
  contents,
  lineHeight,
  fontSize,
  fontFamily
}) {
  if (!contents || contents.length === 0) {
    return {
      width: 0,
      height: 0,
      rowHeight: 0
    }
  }

  const sizes = contents.map(text => measureText(text, { fontSize, fontFamily }));

  const maxWidth = Math.max(...sizes.map(s => s.width));
  const maxHeight = Math.max(...sizes.map(s => s.height));

  const rowHeight = maxHeight * lineHeight;

  return {
    width: maxWidth,
    height: rowHeight * sizes.length,
    rowHeight
  }
}

export default class List extends Component {
  create ({ defs }) {
    this.defs = defs;

    this.items = [];

    const group = new THREE.Group();

    return group
  }

  update ({
    contents,
    rowHeight,
    fontSize,
    fontFamily
  }) {

    const defs = this.defs;

    this.items = contents.map((text, i) => {
      const item = this.items[i] || new Item({ defs });
      item.update({
        text,
        height: rowHeight,
        fontSize,
        fontFamily,
      });
      this.obj.add(item.obj);

      item.obj.position.setY(-rowHeight * i);

      return item
    });
  }
}
