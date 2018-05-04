/**
 * Created by Jeffrey on 2018/4/29.
 */

const svg = tag => document.createElementNS( 'http://www.w3.org/2000/svg', tag );

export class Svg extends THREE.SVGObject {
  constructor (tag, props) {
    const node = svg(tag);
    super(node);

    this.type = tag;
    if (props) {
      this.attr(props);
    }
  }

  attr (props, _) {
    if (arguments.length === 2) {
      this.node.setAttribute(props, _);
      return this
    }
    for (let k in props) {
      this.node.setAttribute(k, props[k]);
    }
    return this
  }

  style (props, _) {
    if (arguments.length === 2) {
      this.node.style[props] = _;
      return this
    }
    for (let k in props) {
      this.node.style[k] = props[k];
    }
    return this
  }

  append(el) {
    this.node.appendChild(el.node);
  }

  dispose () {
    this.node.parentNode.removeChild(this.node);
  }

}

export class Defs extends Svg {
  constructor () {
    super('defs');

    this.defs = {};
  }

  linearGradient (id, attrs, stops) {
    let g = this.defs[id];

    if (!g) {
      g = this.defs[id] = new LinearGradient({id});
      this.append(g);
    }

    if (!(g instanceof LinearGradient)) {
      throw `id:${id} collided!`
    }

    if (attrs) {
      g.attr(attrs);
    }

    if (stops) {
      g.stops(stops);
    }

    return g
  }

  clipPath (id, attrs, type) {
    let c = this.defs[id];

    if (!c) {
      if (!type) {
        throw `id:${id} 'type' must be set at first time`;
      }
      c = this.defs[id] = new Svg('clipPath', {id});
      const path = new Svg(type);
      c.path = path;
      c.append(path);
      this.append(c);
    }

    if (type && type !== c.path.type) {
      throw `id:${id} cannot change clip type`;
    }

    if (attrs) {
      c.path.attr(attrs);
    }

    return c.path
  }

  filter (id) {
    let f = this.defs[id];

    if (!f) {
      f = this.defs[id] = new Svg('filter', {id});
      this.append(f);
    }

    // set the innerHTML directly;

    return f
  }
}

export class LinearGradient extends Svg {
  constructor (props) {
    super('linearGradient', props);

    this._stopNodes = [];
  }

  stops (v) {
    const nextStops = [];
    v.forEach((s) => {
      let stop = this._stopNodes.shift();
      if (!stop) {
        stop = new Svg('stop');
        this.append(stop);
      }
      nextStops.push(stop.attr(s));
    });

    this._stopNodes.forEach(node => node.remove());

    return v
  }
}

const _hiddenSvgNode = svg('svg');
_hiddenSvgNode.style.cssText = 'visibility: hidden; position: absolute; top: -1000px';
const _textNode = svg('text');
_hiddenSvgNode.appendChild(_textNode);

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

const bodyReady = () => document.body.appendChild(_hiddenSvgNode);

if (document.body) {
  bodyReady();
} else {
  document.addEventListener('DOMContentLoaded', bodyReady);
}
