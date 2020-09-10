/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from '../Component';
import { delay, chain, composite, parallel } from 'popmotion';
import { Svg } from '../../Utils/Svg';
import { getRotatedColor } from '../../Utils/Utils';

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

    this.cardComponents = [
      this.title,
      this.num,
      this.effectGlobal,
      this.frame,
      this.list,
      this.description,
    ]
  }

  update (props) {
    super.update(props);

    const {
      index,
      areaName,
      contents,
      description,
      fontFamily,
      color,
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
        color,
        ...linkSize
      });
    } else {
      this.link.update({
        color
      });
    }

    const rotatedColor = getRotatedColor(Color, color).getStyle();

    const gradient = [
      getRotatedColor(Gradient[0], color).getStyle(),
      getRotatedColor(Gradient[1], color).getStyle()
    ];

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
      backgroundColor1: gradient[0],
      backgroundColor2: gradient[1],
      textColor1: gradient[1],
      textColor2: '#000',
      bottomLineColor: gradient[1],
      ...titleSize
    });

    this.num.update({
      position: [frameSize.x, frameSize.y, 0],
      num: index,
      fontSize,
      fontFamily,
      ...frameSize
    });

    this.effectGlobal.update({
      // this component isn't inner the group
      // set position manually
      position: props.position,
      color,
      ...frameSize
    });

    this.frame.update({
      position: [frameSize.x, frameSize.y, 0],
      xgap: gaps.x,
      ygap: gaps.y,
      color1: gradient[0],
      color2: gradient[1],
      ...frameSize
    });

    this.list.update({
      position: [contentsSize.x, contentsSize.y, 0],
      contents,
      fontSize,
      fontFamily,
      color: rotatedColor,
      ...contentsSize
    });

    this.description.update({
      position: [descriptionSize.x, descriptionSize.y, 0],
      width: descriptionSize.width,
      color: rotatedColor,
      text: description,
      fontSize,
      fontFamily
    });
  }

  enterAction () {
    const card = parallel(
      ...this.cardComponents.map(c => c.enterAction())
    );

    if (this.props.fixed) {
      return card;
    } else {
      return chain(
        this.link.enterAction(),
        card
      );
    }
  }

  beforeEnter () {
    this.visible = true;
  }

  enter (state) {
    if (state.link) {
      this.link.__enter(state);
    } else
    if (state.length) {
      this.cardComponents.forEach((c, i) => {
        const v = state[i];
        v && c.__enter(v);
      });
    }
  }

  leaveAction () {
    const cardActions = this.cardComponents.map(c => c.leaveAction());

    if (this.props.fixed) {
      return parallel(...cardActions);
    } else {
      return parallel(
        ...cardActions,
        this.link.leaveAction()
      );
    }
  }

  leave (state) {
    this.cardComponents.forEach((c, i) => {
      const v = state[i];
      v && c.__leave(v);
    });

    const linkState = state[this.cardComponents.length];

    if (linkState) {
      this.link.__leave(linkState);
    }
  }

  afterLeave () {
    this.visible = false;
    this.children.forEach(c => {
      c.afterLeave && c.afterLeave();
    });

    this.effectGlobal.afterLeave && this.effectGlobal.afterLeave();
  }

}


