/**
 * Created by Jeffrey on 2018/4/28.
 */

import Component from '../Component';
import { Card as Default } from '../../constants';
import { tween, stagger, easing } from 'popmotion';
import { getColorStr } from '../../Utils/Utils';
import { svg, svgObject, attr, createRectClip, measureText } from '../../Utils/Svg';

import Frame from './Frame';
import Title from './Title';
import { default as List, calcContentsSize } from './List';

const {
  Color,
  Gradient
} = Default;

const tan = Math.tan;

const LINE_HEIGHT = 1.2;

const ANGLE = 45 / 180 * Math.PI;

const GAP = 14;

/*
  ____________________
 /|                   | | height
/_|___________________| |
d |
------- width --------
*/

export default class Card extends Component {
  create ({
    defs,
  }) {

    this.defs = defs;

    const group = new THREE.Group();

    this.frame = new Frame({ defs });

    this.title = new Title({ defs });

    this.list = new List({ defs });

    attr(this.title.obj.node)({
      'clip-path': 'url(#title-clip)'
    });

    group.add(this.frame.obj);
    group.add(this.title.obj);
    group.add(this.list.obj);

    this._createClip();

    return group
  }

  _createClip () {
    const defs = this.defs;

    const _clip = svg('clipPath')({ id: 'title-clip' });
    defs.appendChild(_clip);

    const clip = svg('path')();
    _clip.appendChild(clip);

    this._clips = {
      title: clip
    };
  }

  update (props) {
    const {
      areaName,
      fontSize,
      fontFamily,
      contents,
    } = props;

    this.obj.position.set(-50, 200, 0);

    // calculate pos & size

    const titleFontSize = fontSize * 1.5;

    const areaNameSize = measureText(areaName, {
        fontSize: titleFontSize,
        fontFamily
      });

    const titleSize = {
      height: areaNameSize.height * LINE_HEIGHT
    };

    const d = titleSize.height / tan(ANGLE);

    const contentsTextSize = calcContentsSize({
      contents,
      lineHeight: LINE_HEIGHT,
      fontSize,
      fontFamily
    });

    const contentsSize = {
      ...contentsTextSize,
      width: Math.max(areaNameSize.width, contentsTextSize.width),
    };

    const leftPadding = d + GAP;

    const topPadding = GAP;

    const rightPadding = GAP;

    const bottomPadding = GAP * 2;

    const contentTop = GAP;

    titleSize.width = d + contentsSize.width + rightPadding + GAP;

    const frameSize = {
      width: leftPadding + contentsSize.width + rightPadding,
      height: topPadding + titleSize.height + contentTop + contentsSize.height + bottomPadding
    };

    // corner
    const a = d + GAP; // h
    const b = titleSize.height + GAP; // v

    // update

    // frame
    this.frame.update({
      a,
      b,
      gap: GAP,
      color1: Gradient[0],
      color2: Gradient[1],
      ...frameSize
    });

    // title
    this.title.obj.position.set(GAP, -GAP, 0);

    attr(this._clips.title)({
      d: [
        'M', d, 0,
        'L', titleSize.width, 0,
        'L', titleSize.width, titleSize.height + GAP,
        'L', 0, titleSize.height + GAP,
        'L', 0, titleSize.height,
        'Z'
      ].join(' ')
    });

    this.title.update({
      indent: d,
      text: areaName,
      fontSize: titleFontSize,
      fontFamily,
      backgroundColor1: Gradient[0],
      backgroundColor2: Gradient[1],
      textColor1: Gradient[1],
      textColor2: '#000',
      bottomLineColor: Gradient[1],
      ...titleSize
    });

    // list
    this.list.obj.position.set(a, -b - contentTop, 0);

    this.list.update({
      contents,
      rowHeight: contentsSize.rowHeight,
      fontSize,
      fontFamily,
    });
  }
}
