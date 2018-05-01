/**
 * Created by Jeffrey on 2018/4/29.
 */

export const svg = tag => props => {
  const node = document.createElementNS( 'http://www.w3.org/2000/svg', tag );
  if (props) {
    return attr(node)(props)
  }
  return node
};

export const svgObject = tag => props => new THREE.SVGObject(svg(tag)(props));

export const attr = node => props => {
  for (let k in props) {
    node.setAttribute(k, props[k]);
  }
  return node
};

export const linearGradient = defs => id => props => {

  const {
    x1 = 0,
    x2 = 1,
    y1 = 0,
    y2 = 0,
    stops = []
  } = props;

  const linearGradient = attr(defs.querySelector('#' + id) || svg( 'linearGradient' )())({
    id,
    x1,
    x2,
    y1,
    y2
  });

  const stopDoms = [...linearGradient.querySelectorAll('stop')];

  stops.forEach((stop, i) => {
    linearGradient.appendChild(attr(stopDoms[i] || svg('stop')())(stop));
  });

  defs.appendChild(linearGradient);

  return linearGradient
};

export const createRectClip = defs => id => props => {

  const _clip = svg('clipPath')({id});
  defs.appendChild(_clip);

  const clip = svg('rect')(props);
  _clip.appendChild(clip);

  return clip
};

const _hiddenSvgNode = svg('svg')({
  style: 'visibility: hidden; position: absolute; top: -1000px'
});
const _textNode = svg('text')();
_hiddenSvgNode.appendChild(_textNode);
document.body.appendChild(_hiddenSvgNode);

export const measureText = (text, style) => {

  if (!text || !style) {
    return { width: 0, height: 0 }
  }

  _textNode.textContent = text;
  _textNode.style.cssText = '';

  for (let k in style) {
    _textNode.style[k] = style[k];
  }

  const bbox = _textNode.getBBox();

  return {
    width: bbox.width,
    height: bbox.height
  }
};
