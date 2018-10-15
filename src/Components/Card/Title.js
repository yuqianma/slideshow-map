/**
 * Created by Jeffrey on 2018/4/29.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { Svg } from '../../Utils/Svg';
import { timeline, easing } from 'popmotion';
import { SPF } from '../../constants';

export default class Title extends Component {
  create ({
    defs,
  }) {

    this.defs = defs;

    const group = new Svg('g', {
      'clip-path': defs.getDef('title-clip')
    });

    this.obj = group;

    group.append(this.mainBackground = new Svg('rect', {
      fill: defs.getDef('title-main-background-g')
    }));

    group.append(this.mainText = new Svg('text', {
      fill: defs.getDef('title-main-text-g'),
      'clip-path': defs.getDef('title-main-text-clip')
    }));

    group.append(this.hollowBackground = new Svg('rect', {
      fill: '#000',
    }));

    group.append(this.hollowText = new Svg('text', {
      'clip-path': defs.getDef('title-hollow-text-clip')
    }));

    group.append(this.bottomLine = new Svg('rect', {
      fill: defs.getDef('title-main-background-g'),
    }));

    this.mainTextClip = defs.clipPath('title-main-text-clip', null, 'rect');
    this.hollowTextClip = defs.clipPath('title-hollow-text-clip', null, 'rect');

  }

  _updateGradient ({
    backgroundColor1,
    backgroundColor2,
    textColor1,
    textColor2,
  }) {
    this.defs.linearGradient('title-main-background-g', null, [{
        offset: '0',
        'stop-color': getColorStr(backgroundColor1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(backgroundColor2)
      }]
    );

    this.defs.linearGradient('title-main-text-g', null, [{
        offset: '0',
        'stop-color': getColorStr(textColor1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(textColor2)
      }]
    );
  }

  update (props) {
    const {
      width,
      height,
      indent,
      text,
      fontSize,
      fontFamily,
      backgroundColor1,
      backgroundColor2,
      textColor1,
      textColor2,
      bottomLineColor
    } = props;

    this._updateGradient(props);

    this.mainBackground.attr({
      width: 0,
      height
    });

    this.hollowBackground.attr({
      width: 0,
      height
    });


    [this.mainText, this.hollowText].forEach(el => {
      el.node.textContent = text;
      el.attr({
        x: indent,
        y: height / 2,
        // 'text-anchor': 'middle',
        style: `font-weight: bold; font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
      });
    });

    this.hollowText.attr({
      fill: getColorStr(backgroundColor2)
    });

    this.bottomLine.attr({
      y: height + 5,
      width: 0,
      height: 1.5
    });

    this.enter(props);
  }

  enter ({
    height,
    width,
    indent
  }) {

    this.hollowTextClip.attr({ height });
    this.mainTextClip.attr({ x: indent, height });
    this.hollowBackground.attr({ width: 0 });

    this._animates && this._animates.forEach(a => {
      // a.seek && a.seek(1);
      a.stop();
    });

    this._animates = [];
    let i = -1;

    this._animates[++i] = timeline([
      30 * SPF,
      { track: 'width', from: 0, to: width, duration: 60 * SPF, ease: easing.circOut }
    ]).start((v) => {
      this.mainBackground.attr(v);
    });

    this._animates[++i] = timeline([
      (30 + 24) * SPF,
      { track: 'line', from: { x: width / 2, width: 0 }, to:   { x: 0, width }, duration: 60 * SPF,}
    ]).start(({line}) => {
      this.bottomLine.attr(line);
    });

    this._animates[++i] = timeline([
      30 * SPF,
      { track: 'x', from: width / 2, to: indent, duration: 60 * SPF, ease: easing.easeIn }
    ]).start((v) => {
      this.mainText.attr(v);
      this.hollowText.attr(v);
    });

    this._animates[++i] = timeline([
      { track: 'width', from: 0, to: 0, duration: 0},
      30 * SPF,
      { track: 'width', from: width / 4, to: width / 3, duration: 30 * SPF, ease: easing.easeOut },
      { track: 'width', to: 0, duration: 30 * SPF, ease: easing.easeIn },
      '' + - 60 * SPF,
      { track: 'x', from: 0, to: width, duration: 60 * SPF }
    ]).start((v) => {
      this.mainTextClip.attr({ width: v.x });
      this.hollowBackground.attr(v);
      this.hollowTextClip.attr(v);
    });

  }

  leave () {
    this._animates.forEach(a => {
      a.reverse();
      a.resume();
    });
  }
}
