/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from '../Component';
import { Card as Default, SPF } from '../../constants';
import { delay } from 'popmotion';
import { getColorStr } from '../../Utils/Utils';
import { Svg, measureText } from '../../Utils/Svg';

import Frame from './Frame';
import Title from './Title';
import { default as List, calcContentsSize } from './List';
import Description from './Description';
import Num from './Num';

const {
  Color,
  Gradient
} = Default;

const tan = Math.tan;

const LINE_HEIGHT = 1.2;
const TITLE_LINE_HEIGHT = 1.5;

const ANGLE = 50 / 180 * Math.PI;

const Y_GAP = 14;
const X_GAP = Y_GAP / tan(ANGLE);

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
  }) {

    this.defs = defs;

    this.obj = new Svg('g');

    this.add(this.frame = new Frame({ defs }));

    this.add(this.num = new Num({ defs }));

    this.add(this.title = new Title({ defs }));

    this.add(this.list = new List({ defs }));

    this.add(this.description = new Description({ defs }));

    defs.clipPath('title-clip', null, 'path');

    createFilter(defs);
  }

  update (props) {
    const {
      index,
      areaName,
      fontSize,
      fontFamily,
      contents,
      description,
    } = props;

    const {
      frameSize,
      titleSize,
      contentsSize,
      a,
      b,
      d
    } = calcSize(props);

    this.description.position(0, -frameSize.height, 0);
    this.defs.clipPath('title-clip', {
      d: [
        'M', d, 0,
        'L', titleSize.width, 0,
        'L', titleSize.width, titleSize.height + Y_GAP,
        'L', 0, titleSize.height + X_GAP,
        'L', 0, titleSize.height,
        'Z'
      ].join(' ')
    });
    this.title.position(X_GAP, -Y_GAP, 0);
    this.list.position(contentsSize.x, contentsSize.y, 0);

    delay(30 * SPF).start({
      complete: () => {
        this.description.update({
          color: Color,
          text: description,
          fontSize,
          fontFamily
        });
      }
    });

    delay(45 * SPF).start({
      complete: () => {

        this.num.update({
          num: index,
          fontSize,
          fontFamily
        });

        this.frame.update({
          a,
          b,
          xgap: X_GAP,
          ygap: Y_GAP,
          color1: Gradient[0],
          color2: Gradient[1],
          ...frameSize
        });

        this.title.update({
          indent: d,
          text: areaName,
          fontSize: fontSize * TITLE_LINE_HEIGHT,
          fontFamily,
          backgroundColor1: Gradient[0],
          backgroundColor2: Gradient[1],
          textColor1: Gradient[1],
          textColor2: '#000',
          bottomLineColor: Gradient[1],
          ...titleSize
        });

        this.list.update({
          contents,
          width: contentsSize.width, // for clip
          rowHeight: contentsSize.rowHeight,
          fontSize,
          fontFamily,
        });
      }
    });
  }

  leave () {
    this.frame.leave();
    this.title.leave();
    this.list.leave();
    this.description.leave();
  }
}

export const calcSize = ({
  areaName,
  contents,
  fontSize,
  fontFamily
}) => {

  // calculate pos & size

  const titleFontSize = fontSize * TITLE_LINE_HEIGHT;

  const areaNameSize = measureText(areaName, {
    fontSize: titleFontSize,
    fontFamily
  });

  const titleSize = {
    height: areaNameSize.height * LINE_HEIGHT
  };

/*
  ____________________
 /|                   | | height
/_|___________________| |
d |
------- width --------
*/
  const d = titleSize.height / tan(ANGLE);

  const contentsTextSize = calcContentsSize({
    contents,
    lineHeight: LINE_HEIGHT,
    fontSize,
    fontFamily
  });

  const leftPadding = d + X_GAP;

  const topPadding = Y_GAP;

  const rightPadding = X_GAP * 2;

  const bottomPadding = Y_GAP * 2;

  const contentsTop = Y_GAP;

  const contentsWidth = Math.max(areaNameSize.width, contentsTextSize.width);

  // corner
  const a = d + X_GAP; // h
  const b = titleSize.height + Y_GAP; // v

  const contentsSize = {
    ...contentsTextSize,
    x: a,
    y: - b - contentsTop,
    width: contentsWidth,
  };

  titleSize.width = d + contentsSize.width + rightPadding + X_GAP;

  const frameSize = {
    width: leftPadding + contentsSize.width + rightPadding,
    height: topPadding + titleSize.height + contentsTop + contentsSize.height + bottomPadding
  };

  return {
    frameSize,
    titleSize,
    contentsSize,
    a,
    b,
    d
  }
};
