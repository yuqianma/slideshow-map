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

    this._createClip();

    return group
  }

  _createClip () {
    const defs = this.defs;

    this._clips = {
      text: createRectClip(defs)('list-text-clip')(),
    };

  }

  update ({
    contents,
    width,
    rowHeight,
    fontSize,
    fontFamily
  }) {

    const defs = this.defs;

    attr(this._clips.text)({
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

      item.obj.position.setY(-rowHeight * i);

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
        this.obj.remove(item.obj);
      });
    }
  }
}
