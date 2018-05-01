/**
 * Created by Jeffrey on 2018/4/29.
 */

import Component from '../Component';
import { getColorStr } from '../../Utils/Utils';
import { svg, svgObject, attr, linearGradient, createRectClip } from '../../Utils/Svg';
import { timeline } from 'popmotion';

export default class Title extends Component {
  constructor ({
    defs,
  }) {
    super();

    this.defs = defs;

    const group = svgObject('g')();
    
    const rect = svg('rect');
    const path = svg('path');
    const text = svg('text');

    this.mainBackground = rect({
      fill: 'url(#title-mainBackground-g)'
    });
    this.mainText = text({
      fill: 'url(#title-mainText-g)'
    });
    this.hollowBackground = rect({
      fill: '#000'
    });
    this.hollowText = text();
    this.bottomLine = path();

    group.node.appendChild(this.mainBackground);
    group.node.appendChild(this.mainText);
    // group.node.appendChild(this.hollowBackground);
    // group.node.appendChild(this.hollowText);
    // group.node.appendChild(this.bottomLine);

    this.obj = group;

    this._createGradient();
    this._createClip();
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
      mainBackground: linearGradient(defs)('title-mainBackground-g'),
      mainText: linearGradient(defs)('title-mainText-g'),
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
      width,
      height
    });

    attr(this.hollowBackground)({
      width,
      height
    });


    [this.mainText, this.hollowText].forEach(node => {
      node.textContent = text;
      attr(node)({
        x: indent,
        y: height / 2,
        // 'text-anchor': 'middle',
        style: `font-size: ${fontSize}; font-family: ${fontFamily}; dominant-baseline: central`,
      });
    });

    attr(this.hollowText)({
      fill: getColorStr(backgroundColor2)
    });

    // animate
    // attr(this.bottomLine.node)({
    // });
  }

  enter () {

  }

  leave () {

  }
}
