/**
 * Created by Jeffrey on 2018/4/29.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { Svg } from '../../Utils/Svg';
import { timeline, easing } from 'popmotion';
import { SPF } from '../../constants';
import { getTruncated } from '../../helper';

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
    super.update(props);
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
      el.node.textContent = getTruncated(
        text,
        width - indent - fontSize, // 标题 - 左边缩进 - 右边出血(约等于字体大小)
        { fontSize, fontFamily, fontWeight: 'bold' }
      );
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

    this.hollowTextClip.attr({ height });
    this.mainTextClip.attr({ x: indent, height });
    this.hollowBackground.attr({ width: 0 });
  }

  enterAction () {
    const {
      width,
      indent,
    } = this.props;

    return timeline([
      // 30 * SPF
      [
        { track: 'mainBackground', from: { width: 0 }, to: { width }, duration: 60 * SPF, ease: easing.circOut },
        { track: 'text', from: { x: width / 2 }, to: { x: indent }, duration: 60 * SPF, ease: easing.easeIn },
      ],

      0,
      { track: 'clipWidth', from: width / 4, to: width / 3, duration: 30 * SPF, ease: easing.easeOut },
      { track: 'clipWidth',                  to: 0,         duration: 30 * SPF, ease: easing.easeIn },

      0,
      { track: 'clipX', from: 0, to: width, duration: 60 * SPF },

      24 * SPF,
      { track: 'bottomLine', from: { x: width / 2, width: 0 }, to: { x: 0, width }, duration: 60 * SPF },

    ]);
  }

  enter ({
    mainBackground,
    text,
    clipWidth,
    clipX,
    bottomLine
  }) {
    this.mainBackground.attr(mainBackground);

    this.mainText.attr(text);
    this.hollowText.attr(text);

    this.mainTextClip.attr({ width: clipX });
    this.hollowBackground.attr({ width: clipWidth, x: clipX });
    this.hollowTextClip.attr({ width: clipWidth, x: clipX });

    this.bottomLine.attr(bottomLine);
  }

  leaveAction () {
    const {
      width,
      indent,
    } = this.props;

    return timeline([
      [
        { track: 'mainBackground', from: { width }, to: { width: 0 }, duration: 60 * SPF, ease: easing.easeIn },
        { track: 'text', from: { x: indent }, to: { x: width / 2 }, duration: 60 * SPF, ease: easing.circOut },

        { track: 'clipX', from: width, to: 0, duration: 60 * SPF },
        { track: 'bottomLine', from: { x: 0, width }, to: { x: width / 2, width: 0 }, duration: 60 * SPF }
      ],

      0,
      { track: 'clipWidth', from: 0, to: width / 3, duration: 30 * SPF, ease: easing.easeIn },
      { track: 'clipWidth', to: width / 4, duration: 30 * SPF, ease: easing.easeOut },
      { track: 'clipWidth', to: 0, duration: 0 }

    ]);
  }

  leave (state) {
    this.enter(state);
  }

  // update (props) {
  //   const {
  //     width,
  //     height,
  //     indent,
  //     text,
  //     fontSize,
  //     fontFamily,
  //     backgroundColor1,
  //     backgroundColor2,
  //     textColor1,
  //     textColor2,
  //     bottomLineColor
  //   } = props;
  //
  //   this._updateGradient(props);
  //
  //   this.mainBackground.attr({
  //     width: 0,
  //     height
  //   });
  //
  //   this.hollowBackground.attr({
  //     width: 0,
  //     height
  //   });
  //
  //
  //   [this.mainText, this.hollowText].forEach(el => {
  //     el.node.textContent = getTruncated(
  //       text,
  //       width - indent - fontSize, // 标题 - 左边缩进 - 右边出血(约等于字体大小)
  //       { fontSize, fontFamily, fontWeight: 'bold' }
  //     );
  //     el.attr({
  //       x: indent,
  //       y: height / 2,
  //       // 'text-anchor': 'middle',
  //       style: `font-weight: bold; font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
  //     });
  //   });
  //
  //   this.hollowText.attr({
  //     fill: getColorStr(backgroundColor2)
  //   });
  //
  //   this.bottomLine.attr({
  //     y: height + 5,
  //     width: 0,
  //     height: 1.5
  //   });
  //
  //   this._enter(props);
  // }
  //
  // _enter ({
  //   height,
  //   width,
  //   indent
  // }) {
  //
  //   this.hollowTextClip.attr({ height });
  //   this.mainTextClip.attr({ x: indent, height });
  //   this.hollowBackground.attr({ width: 0 });
  //
  //   this._animates && this._animates.forEach(a => {
  //     // a.seek && a.seek(1);
  //     a.stop();
  //   });
  //
  //   this._animates = [];
  //   let i = -1;
  //
  //   this._animates[++i] = timeline([
  //     30 * SPF,
  //     { track: 'width', from: 0, to: width, duration: 60 * SPF, ease: easing.circOut }
  //   ]).start((v) => {
  //     this.mainBackground.attr(v);
  //   });
  //
  //   this._animates[++i] = timeline([
  //     (30 + 24) * SPF,
  //     { track: 'line', from: { x: width / 2, width: 0 }, to:   { x: 0, width }, duration: 60 * SPF,}
  //   ]).start(({line}) => {
  //     this.bottomLine.attr(line);
  //   });
  //
  //   this._animates[++i] = timeline([
  //     30 * SPF,
  //     { track: 'x', from: width / 2, to: indent, duration: 60 * SPF, ease: easing.easeIn }
  //   ]).start((v) => {
  //     this.mainText.attr(v);
  //     this.hollowText.attr(v);
  //   });
  //
  //   this._animates[++i] = timeline([
  //     { track: 'width', from: 0, to: 0, duration: 0},
  //     30 * SPF,
  //     { track: 'width', from: width / 4, to: width / 3, duration: 30 * SPF, ease: easing.easeOut },
  //     { track: 'width', to: 0, duration: 30 * SPF, ease: easing.easeIn },
  //     '' + - 60 * SPF,
  //     { track: 'x', from: 0, to: width, duration: 60 * SPF }
  //   ]).start((v) => {
  //     this.mainTextClip.attr({ width: v.x });
  //     this.hollowBackground.attr(v);
  //     this.hollowTextClip.attr(v);
  //   });
  //
  // }
  //
  // _leave () {
  //   this._animates.forEach(a => {
  //     a.reverse();
  //     a.resume();
  //   });
  // }
}
