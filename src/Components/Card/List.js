/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { SPF } from '../../constants';
import { measureText } from '../../Utils/Svg';
import { delay } from 'popmotion';
import Item from './Item';
import { getTruncated } from '../../helper';

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
    height,
    rowHeight,
    fontSize,
    fontFamily
  }) {

    const defs = this.defs;

    let itemCount = Math.floor(height / rowHeight);

    // if (itemCount < contents.length) {
    //   itemCount = Math.max(0, itemCount - 1);
    // }

    this.clip.attr({
      width: width + fontSize,
      height: rowHeight
    });

    this.items.forEach(item => {
      this.remove(item);
    });

    const showContents = contents.slice(0, itemCount);

    this.items = showContents.map((text, i) => {
      let item = null;// lastItmes.shift(); // pop will lead to seq bug

      if (!item) {
        item = new Item({ defs });
        this.obj.add(item.obj);
      }

      item.position(0, -rowHeight * i, 0);

      delay(45 * SPF + 1000 * i / showContents.length).start({
        complete: () => {
          item.update({
            text: getTruncated(text, width, { fontSize, fontFamily }),
            height: rowHeight,
            fontSize,
            fontFamily,
          });
        }
      });

      return item
    });

    if (itemCount < contents.length) {
      const item = new Item({ defs });
      this.obj.add(item.obj);
      item.position(0, -rowHeight * itemCount + rowHeight / 2, 0);
      delay(45 * SPF + 1000 * itemCount / showContents.length).start({
        complete: () => {
          item.update({
            text: '…',
            height: rowHeight,
            fontSize,
            fontFamily,
            hideMarker: true
          });
        }
      });

      this.items.push(item);
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
