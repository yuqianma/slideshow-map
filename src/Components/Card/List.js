/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { measureText } from '../../Utils/Svg';
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

    this.clip = defs.clipPath('list-text-clip', null, 'rect');

    return new THREE.Group();
  }

  update ({
    contents,
    width,
    rowHeight,
    fontSize,
    fontFamily
  }) {

    const defs = this.defs;

    this.clip.attr({
      width,
      height: rowHeight
    });

    const lastItmes = this.items;

    this.items = contents.map((text, i) => {
      let item = lastItmes.shift(); // pop will lead to seq bug

      if (!item) {
        item = new Item({ defs });
        this.obj.add(item.obj);
      }

      item.position(0, -rowHeight * i, 0);
      item.update({
        text,
        height: rowHeight,
        fontSize,
        fontFamily,
      });

      return item
    });

    if (lastItmes.length) {
      lastItmes.forEach(item => {
        this.remove(item);
      });
    }
  }
}
