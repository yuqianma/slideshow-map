/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { SPF } from '../../constants';
import { measureText } from '../../Utils/Svg';
import { delay } from 'popmotion';
import Item from './Item';

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
      let item = null;// lastItmes.shift(); // pop will lead to seq bug

      if (!item) {
        item = new Item({ defs });
        this.obj.add(item.obj);
      }

      item.position(0, -rowHeight * i, 0);

      delay(45 * SPF + 1000 * i / contents.length).start({
        complete: () => {
          item.update({
            text,
            height: rowHeight,
            fontSize,
            fontFamily,
          });
        }
      });

      return item
    });

    if (lastItmes.length) {
      lastItmes.forEach(item => {
        this.remove(item);
      });
    }
  }

  leave () {
    this.items.forEach((item, i) => {
      delay(1000 * i / this.items.length).start({
        complete: () => {
          item.leave();
        }
      });
    })
  }
}
