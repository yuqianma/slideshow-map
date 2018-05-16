/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from '../Component';
import { delay } from 'popmotion';
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

function createFilter (defs) {
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
  }) {

    this.defs = defs;

    this.obj = new Svg('g');

    this.add(this.frame = new Frame({ defs }));

    this.add(this.global = new Global({ svg }));

    this.add(this.num = new Num({ defs }));

    this.add(this.title = new Title({ defs }));

    this.add(this.list = new List({ defs }));

    this.add(this.description = new Description({ defs }));

    this.add(this.link = new Link());

    defs.clipPath('title-clip', null, 'path');

    createFilter(defs);
  }

  update (props) {

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
      this.link.position(linkSize.x, linkSize.y, 0);
      this.link.update(linkSize);
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
    this.title.position(titleSize.x, titleSize.y, 0);
    this.title.update({
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

    this.num.position(frameSize.x, frameSize.y, 0);
    this.num.update({
      num: index,
      fontSize,
      fontFamily
    });

    this.global.position(frameSize.x, frameSize.y, 0);
    this.global.update();

    this.frame.position(frameSize.x, frameSize.y, 0);
    this.frame.update({
      xgap: gaps.x,
      ygap: gaps.y,
      color1: Gradient[0],
      color2: Gradient[1],
      ...frameSize
    });

    this.list.position(contentsSize.x, contentsSize.y, 0);
    this.list.update({
      contents,
      fontSize,
      fontFamily,
      ...contentsSize
    });

    this.description.position(descriptionSize.x, descriptionSize.y, 0);
    this.description.update({
      color: Color,
      text: description,
      fontSize,
      fontFamily
    });
  }

  leave () {
    this.frame.leave();
    this.title.leave();
    this.list.leave();
    this.description.leave();
  }
}


