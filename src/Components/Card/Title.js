/**
 * Created by Jeffrey on 2018/4/29.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline, easing } from 'popmotion';
import { SPF } from '../../constants';

export default class Title extends Component {
  create ({
    defs,
  }) {

    this.defs = defs;

    const group = svgObject('g')({
      'class': 'dev-title-g'
    });
    
    const rect = svg('rect');
    const text = svg('text');

    this.mainBackground = rect({
      fill: 'url(#title-main-background-g)'
    });
    this.mainText = text({
      fill: 'url(#title-main-text-g)',
      'clip-path': 'url(#title-main-text-clip)'
    });
    this.hollowBackground = rect({
      fill: '#000',
      // 'clip-path': 'url(#title-hollow-clip)'
    });
    this.hollowText = text({
      'clip-path': 'url(#title-hollow-clip)'
    });
    this.bottomLine = rect({
      fill: 'url(#title-main-background-g)',
    });

    group.node.appendChild(this.mainBackground);
    group.node.appendChild(this.mainText);
    group.node.appendChild(this.hollowBackground);
    group.node.appendChild(this.hollowText);
    group.node.appendChild(this.bottomLine);

    this._createGradient();
    this._createClip();

    return group
  }

  _createClip () {
    const defs = this.defs;

    this._clips = {
      mainText: createRectClip(defs)('title-main-text-clip')(),
      hollow: createRectClip(defs)('title-hollow-clip')(),
    };

  }

  _createGradient () {
    const defs = this.defs;
    this._gradients = {
      mainBackground: linearGradient(defs)('title-main-background-g'),
      mainText: linearGradient(defs)('title-main-text-g'),
    };
  }

  _updateGradient ({
    backgroundColor1,
    backgroundColor2,
    textColor1,
    textColor2,
  }) {
    this._gradients.mainBackground({
      stops: [{
        offset: '0',
        'stop-color': getColorStr(backgroundColor1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(backgroundColor2)
      }]
    });

    this._gradients.mainText({
      stops: [{
        offset: '0',
        'stop-color': getColorStr(textColor1)
      }, {
        offset: '100%',
        'stop-color': getColorStr(textColor2)
      }]
    });
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

    attr(this.mainBackground)({
      width: 0,
      height
    });

    attr(this.hollowBackground)({
      width: 0,
      height
    });


    [this.mainText, this.hollowText].forEach(node => {
      node.textContent = text;
      attr(node)({
        x: indent,
        y: height / 2,
        // 'text-anchor': 'middle',
        style: `font-weight: bold; font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
      });
    });

    attr(this.hollowText)({
      fill: getColorStr(backgroundColor2)
    });

    attr(this.bottomLine)({
      y: height + 5,
      width: 0,
      height: 1.5
    });

    this.enter(props);
  }

  enter ({
    width,
    indent
  }) {

    const mainBackground = attr(this.mainBackground);
    const hollowBackground = attr(this.hollowBackground);
    const mainText = attr(this.mainText);
    const hollowText = attr(this.hollowText);
    const bottomLine = attr(this.bottomLine);

    const mainTextClip = attr(this._clips.mainText);
    const hollowTextClip = attr(this._clips.hollow);

    hollowTextClip({
      height: 40
    });

    timeline([
      {
        track: 'width',
        from: 0,
        to: width,
        duration: 60 * SPF,
        ease: easing.circOut
      }
    ]).start((v) => {
      mainBackground(v);
    });

    timeline([
      {
        track: 'line',
        from: {
          x: width / 2,
          width: 0,
        },
        to: {
          x: 0,
          width
        },
        duration: 60 * SPF,
      }
    ]).start(({line}) => {
      bottomLine(line);
    });

    timeline([
      [{
        track: 'width',
        from: 0,
        to: width / 3,
        duration: 30 * SPF
      }, {
        track: 'x',
        from: 0,
        to: width,
        duration: 60 * SPF
      }],
      [{
        track: 'width',
        to: 0,
        duration: 30 * SPF
      }]
    ]).start((v) => {
      mainTextClip({
        x: indent,
        height: 40,
        width: v.x
      });
      hollowBackground(v);
      hollowTextClip(v);
    });

    timeline([
      {
        track: 'x',
        from: width,
        to: indent,
        duration: 60 * SPF
      }
    ]).start((v) => {
      mainText(v);
      hollowText(v);
    });

  }

  leave () {

  }
}
