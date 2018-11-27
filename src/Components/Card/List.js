/**
 * Created by Jeffrey on 2018/5/2.
 */

import Component from '../Component';
import { SPF } from '../../constants';
import { measureText } from '../../Utils/Svg';
import { parallel } from 'popmotion';
import Item from './Item';
import { getTruncated } from '../../helper';

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
      const item = new Item({ defs });
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
    // delay 45 SPF head

    const itemNo = this.items.length - 1;
    const all = this.items.map((item, i) => item.enterAction({ delay: i / itemNo * 60 * SPF }));

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
    const itemNo = this.items.length - 1;
    const all = this.items.map((item, i) => item.leaveAction({ delay: i / itemNo * 60 * SPF }));

    return parallel(...all);
  }

  leave (values) {
    this.enter(values);
  }

  afterLeave () {
    this.visible = false;
  }

  // update ({
  //   contents,
  //   width,
  //   height,
  //   rowHeight,
  //   fontSize,
  //   fontFamily
  // }) {
  //
  //   const defs = this.defs;
  //
  //   let itemCount = Math.floor(height / rowHeight);
  //
  //   // if (itemCount < contents.length) {
  //   //   itemCount = Math.max(0, itemCount - 1);
  //   // }
  //
  //   this.clip.attr({
  //     width: width + fontSize,
  //     height: rowHeight
  //   });
  //
  //   this.items.forEach(item => {
  //     this.remove(item);
  //   });
  //
  //   const showContents = contents.slice(0, itemCount);
  //
  //   this.items = showContents.map((text, i) => {
  //     let item = null;// lastItmes.shift(); // pop will lead to seq bug
  //
  //     if (!item) {
  //       item = new Item({ defs });
  //       this.obj.add(item.obj);
  //     }
  //
  //     item.position(0, -rowHeight * i, 0);
  //
  //     delay(45 * SPF + 1000 * i / showContents.length).start({
  //       complete: () => {
  //         item.update({
  //           text: getTruncated(text, width, { fontSize, fontFamily }),
  //           height: rowHeight,
  //           fontSize,
  //           fontFamily,
  //         });
  //       }
  //     });
  //
  //     return item
  //   });
  //
  //   if (itemCount > 0 && itemCount < contents.length) {
  //     const item = new Item({ defs });
  //     this.obj.add(item.obj);
  //     item.position(0, -rowHeight * itemCount + rowHeight / 2, 0);
  //     delay(45 * SPF + 1000 * itemCount / showContents.length).start({
  //       complete: () => {
  //         item.update({
  //           text: '…',
  //           height: rowHeight,
  //           fontSize,
  //           fontFamily,
  //           hideMarker: true
  //         });
  //       }
  //     });
  //
  //     this.items.push(item);
  //   }
  // }
  //
  // leave () {
  //   this.items.forEach((item, i) => {
  //     delay(1000 * i / this.items.length).start({
  //       complete: () => {
  //         item.leave();
  //       }
  //     });
  //   })
  // }
}
