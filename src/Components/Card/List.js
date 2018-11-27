/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { SPF } from '../../constants';
import { measureText } from '../../Utils/Svg';
import { parallel } from 'popmotion';
import Item from './Item';
import { getTruncated } from '../../helper';
import { action } from 'popmotion/lib/index';

export default class List extends Component {
  create ({ defs }) {
    this.defs = defs;

    this.items = [];

    this.clip = defs.clipPath('list-text-clip', null, 'rect');

    const g = new THREE.Group();

    g.visible = false;

    return g;
  }

  update (props) {
    super.update(props);
    const {
      contents,
      width,
      height,
      rowHeight,
      fontSize,
      fontFamily
    } = props;

    const defs = this.defs;

    let itemCount = Math.floor(height / rowHeight);

    this.clip.attr({
      width: width + fontSize,
      height: rowHeight
    });

    this.items.forEach(item => {
      this.remove(item);
    });

    const showContents = contents.slice(0, itemCount);
    this.items = showContents.map((text, i) => {
      const item = new Item({ defs, text, i });
      this.add(item);
      item.update({
        position: [0, -rowHeight * i, 0],
        text: getTruncated(text, width, { fontSize, fontFamily }),
        height: rowHeight,
        fontSize,
        fontFamily
      });

      return item;
    });

    if (itemCount > 0 && itemCount < contents.length) {
      const item = new Item({ defs });
      this.add(item);
      item.update({
        position: [0, -rowHeight * itemCount + rowHeight / 2, 0],
        text: '…',
        height: rowHeight,
        fontSize,
        fontFamily,
        hideMarker: true
      });
      this.items.push(item);
    }
  }

  enterAction () {
    if (!this.items.length) {
      return action(({ update, complete }) => {
        update([]);
        complete();
      });
    }
    const itemNo = this.items.length - 1;
    const all = this.items.map((item, i) => item.enterAction({ delay: itemNo ? i / itemNo * 30 * SPF : 0 }));

    return parallel(...all);
  }

  beforeEnter () {
    this.visible = true;
  }

  enter (values) {
    values.map((v, i) => {
      this.items[i].enter(v);
    });
  }

  leaveAction () {
    if (!this.items.length) {
      return action(({ update, complete }) => {
        update([]);
        complete();
      });
    }

    const itemNo = this.items.length - 1;
    const all = this.items.map((item, i) => item.leaveAction({ delay: itemNo ? i / itemNo * 30 * SPF : 0 }));

    return parallel(...all);
  }

  leave (values) {
    this.enter(values);
  }

  afterLeave () {
    this.visible = false;
  }
}
