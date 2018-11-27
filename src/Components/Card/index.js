/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from '../Component';
import { delay, chain, composite, parallel } from 'popmotion';
import { Svg } from '../../Utils/Svg';

import {
  Card as Default,
  TITLE_FONT_SIZE_SCALE
} from '../../constants';
import {
  getGaps,
  calcFittedSize
} from '../../helper';

import Frame from './Frame';
import Title from './Title';
import List from './List';
import Description from './Description';
import Num from './Num';
import Global from './Global';
import Link from './Link';

const {
  Color,
  Gradient
} = Default;

export function createFilter (defs) {
  defs.filter('glow1').node.innerHTML = `
<feGaussianBlur result="blurOut" in="floodOut" stdDeviation="8" />
<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
`;
  defs.filter('glow2').node.innerHTML = `
<feGaussianBlur result="blurOut" in="floodOut" stdDeviation="2" />
<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
`;
}

export default class Card extends Component {
  create ({
    defs,
    svg,
    // globalUrl,
    effectGlobal
  }) {

    this.defs = defs;

    this.obj = new Svg('g');

    this.add(this.frame = new Frame({ defs }));

    this.effectGlobal = effectGlobal;

    this.add(this.num = new Num({ defs }));

    this.add(this.title = new Title({ defs }));

    this.add(this.list = new List({ defs }));

    this.add(this.description = new Description({ defs }));

    this.add(this.link = new Link());

    defs.clipPath('title-clip', null, 'path');

    createFilter(defs);

    this.visible = false;
  }

  update (props) {
    super.update(props);

    const {
      index,
      areaName,
      contents,
      description,
      fontFamily,
    } = props;

    const {
      fontSize,
      titleSize,
      contentsSize,
      frameSize,
      descriptionSize,
      linkSize,
    } = calcFittedSize(props);

    const gaps = getGaps(fontSize);

    if (linkSize) {
      this.link.update({
        position: [linkSize.x, linkSize.y, 0],
        ...linkSize
      });
    } else {
      this.link.update();
    }

    this.defs.clipPath('title-clip', {
      d: [
        'M', titleSize.d, 0,
        'L', titleSize.width, 0,
        'L', titleSize.width, titleSize.height + gaps.y,
        'L', 0, titleSize.height + gaps.x,
        'L', 0, titleSize.height,
        'Z'
      ].join(' ')
    });

    this.title.update({
      position: [titleSize.x, titleSize.y, 0],
      indent: titleSize.d,
      text: areaName,
      fontSize: fontSize * TITLE_FONT_SIZE_SCALE,
      fontFamily,
      backgroundColor1: Gradient[0],
      backgroundColor2: Gradient[1],
      textColor1: Gradient[1],
      textColor2: '#000',
      bottomLineColor: Gradient[1],
      ...titleSize
    });

    this.num.update({
      position: [frameSize.x, frameSize.y, 0],
      num: index,
      fontSize,
      fontFamily,
      ...frameSize
    });

    // this.effectGlobal.update(frameSize);

    this.frame.update({
      position: [frameSize.x, frameSize.y, 0],
      xgap: gaps.x,
      ygap: gaps.y,
      color1: Gradient[0],
      color2: Gradient[1],
      ...frameSize
    });

    this.list.update({
      position: [contentsSize.x, contentsSize.y, 0],
      contents,
      fontSize,
      fontFamily,
      ...contentsSize
    });

    this.description.update({
      position: [descriptionSize.x, descriptionSize.y, 0],
      color: Color,
      text: description,
      fontSize,
      fontFamily
    });
  }

  enterAction () {
    return chain(
      this.link.enterAction(),
      parallel(
        this.title.enterAction(),
        this.num.enterAction(),
        this.frame.enterAction(),
        this.list.enterAction(),
        this.description.enterAction()
      )
    );
  }

  beforeEnter () {
    this.visible = true;
  }

  enter (state) {
    if (state.link) {
      this.link.__enter(state);
    } else
    if (state.length) {
      [
        this.title,
        this.num,
        this.frame,
        this.list,
        this.description
      ].forEach((c, i) => {
        const v = state[i];
        v && c.__enter(v);
      });
    }
  }

  leaveAction () {
    return chain(
      parallel(
        this.title.enterAction(),
        this.num.enterAction(),
        this.frame.enterAction(),
        this.list.enterAction(),
        this.description.enterAction()
      ),
      this.link.enterAction()
    );
  }

  leave (state) {
    if (state.link) {
      this.link.__leave(state);
    } else
    if (state.length) {
      [
        this.title,
        this.num,
        this.frame,
        this.list,
        this.description
      ].forEach((c, i) => {
        const v = state[i];
        v && c.__leave(v);
      });
    }
  }

  afterLeave () {
    this.visible = false;
  }

  // update (props) {
  //
  //   const {
  //     index,
  //     areaName,
  //     contents,
  //     description,
  //     fontFamily,
  //   } = props;
  //
  //   const {
  //     fontSize,
  //     titleSize,
  //     contentsSize,
  //     frameSize,
  //     descriptionSize,
  //     linkSize,
  //   } = calcFittedSize(props);
  //
  //   const gaps = getGaps(fontSize);
  //
  //   if (linkSize) {
  //     this.link.position(linkSize.x, linkSize.y, 0);
  //     this.link.update(linkSize);
  //   }
  //
  //   this.defs.clipPath('title-clip', {
  //     d: [
  //       'M', titleSize.d, 0,
  //       'L', titleSize.width, 0,
  //       'L', titleSize.width, titleSize.height + gaps.y,
  //       'L', 0, titleSize.height + gaps.x,
  //       'L', 0, titleSize.height,
  //       'Z'
  //     ].join(' ')
  //   });
  //   this.title.position(titleSize.x, titleSize.y, 0);
  //   this.title.update({
  //     indent: titleSize.d,
  //     text: areaName,
  //     fontSize: fontSize * TITLE_FONT_SIZE_SCALE,
  //     fontFamily,
  //     backgroundColor1: Gradient[0],
  //     backgroundColor2: Gradient[1],
  //     textColor1: Gradient[1],
  //     textColor2: '#000',
  //     bottomLineColor: Gradient[1],
  //     ...titleSize
  //   });
  //
  //   this.num.position(frameSize.x, frameSize.y, 0);
  //   this.num.update({
  //     num: index,
  //     fontSize,
  //     fontFamily,
  //     ...frameSize
  //   });
  //
  //   // this.global.position(frameSize.x, frameSize.y, 0);
  //   // this.global.update(frameSize);
  //
  //   // this.effectGlobal.position(frameSize.x, frameSize.y, 0);
  //   this.effectGlobal.update(frameSize);
  //
  //   this.frame.position(frameSize.x, frameSize.y, 0);
  //   this.frame.update({
  //     xgap: gaps.x,
  //     ygap: gaps.y,
  //     color1: Gradient[0],
  //     color2: Gradient[1],
  //     ...frameSize
  //   });
  //
  //   this.list.position(contentsSize.x, contentsSize.y, 0);
  //   this.list.update({
  //     contents,
  //     fontSize,
  //     fontFamily,
  //     ...contentsSize
  //   });
  //
  //   this.description.position(descriptionSize.x, descriptionSize.y, 0);
  //   this.description.update({
  //     color: Color,
  //     text: description,
  //     fontSize,
  //     fontFamily
  //   });
  // }

  // leave () {
  //   this.frame.leave();
  //   this.num.leave();
  //   this.title.leave();
  //   this.list.leave();
  //   this.description.leave();
  //   this.link.leave();
  // }
}


