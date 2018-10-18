import { measureText } from './Utils/Svg';
import {
  LINE_HEIGHT,
  TITLE_FONT_SIZE_SCALE,
  ANGLE,
  FONT_SIZE_RATIO,
  LINK_SCALE,
  BOUND_PADDING
} from './constants';

const S = 1.6e3;
const MIN_FONT_SIZE = 10;

// we have to know box size to calculate the link & card pos
export const getShapeSize = (size, scale, height) => {
  const s = S * height / scale;
  return {
    x: 0.618 * size * s,
    y: 0.618 * size * s,
    z: 2 * size * s,
  }
};

// x,y is left-bottom
export const getValidSize = ({ withLink, x, y, width, height }) => {
  const _width = width / 2 - x - BOUND_PADDING * width;
  let _height = height / 2 - y;
  if (!withLink) {
    // 无连线，留出顶部padding
    _height -= BOUND_PADDING * height;
    // 有连线的情况不要顶部padding
  }
  return {
    x,
    y,
    width: _width,
    height: _height
  }
};

export const getGaps = fontSize => ({
  x: fontSize / Math.tan(ANGLE),
  y: fontSize
});

export const getGlobalSize = fontSize => ({
  width: fontSize * 100 / 15, // approximately
  height: fontSize * 100 / 15
});

export const getLinkSize = ({fontSize, scale = LINK_SCALE}) => ({
  width: fontSize * Math.cos(ANGLE) * scale,
  height: fontSize * Math.sin(ANGLE) * scale
});

export const getDescriptionHeight = fontSize => fontSize * 2.6;// approximately

export function calcContentsSize ({
  contents,
  lineHeight,
  fontSize,
  fontFamily
}) {
  if (!contents || contents.length === 0) {
    return {
      width: 0,
      height: 0,
      rowHeight: 0
    }
  }

  const sizes = contents.map(text => measureText(text, { fontSize, fontFamily }));

  const maxWidth = Math.max(...sizes.map(s => s.width));
  const maxHeight = Math.max(...sizes.map(s => s.height));

  const rowHeight = maxHeight * lineHeight;

  return {
    width: maxWidth,
    height: rowHeight * sizes.length,
    rowHeight
  }
}

// component height
const getTitleHeight = (fontSize) => fontSize * TITLE_FONT_SIZE_SCALE * LINE_HEIGHT * 1.2;

export const getEmptyFrameSize = (fontSize) => {
  const {
    x: xgap,
    y: ygap,
  } = getGaps(fontSize);

  const titleHeight = getTitleHeight(fontSize);

  /*
    ____________________
   /|                   | | height
  /_|___________________| |
  d |
  ------- width --------
  */
  const d = getGaps(titleHeight).x;

  // the gap between main frame (line) & title & contents outline

  const leftPadding = xgap + d;

  const topPadding = ygap; // title top

  const rightPadding = xgap * 2;

  const bottomPadding = ygap * 1.5; // contents bottom

  const contentsTop = ygap; // gap between title & contents

  // corner
  /*
    a
    __
  b| /
   |/

  */
  const a = d + xgap; // h
  const b = titleHeight + ygap; // v

  return {
    a,
    b,
    d,
    leftPadding,
    topPadding,
    rightPadding,
    bottomPadding,
    contentsTop,
  }
};

export const _fitContentsSize = ({
  areaName,
  contents,
  description,
  fontSize,
  fontFamily,
}) => {
  // text size
  const areaNameSize = measureText(areaName, {
    fontSize: fontSize * TITLE_FONT_SIZE_SCALE,
    fontFamily
  });

  const contentsTextSize = calcContentsSize({
    contents,
    lineHeight: LINE_HEIGHT,
    fontSize,
    fontFamily
  });

  const descriptionTextSize = measureText(description, {
    fontSize, fontFamily
  });

  // get max text length as result width
  const contentsWidth = Math.max(
    areaNameSize.width,
    contentsTextSize.width,
    descriptionTextSize.width - fontSize // approximately
  );

  return {
    width: contentsWidth,
    height: contentsTextSize.height,
    rowHeight: contentsTextSize.rowHeight
  }
};

export const calcCardSize = ({
  areaName,
  contents,
  description,
  fontSize,
  fontFamily,
  fitContentsSize
}) => {

  if (!fitContentsSize) {
    fitContentsSize = _fitContentsSize
  }

  const {
    x: xgap,
    y: ygap,
  } = getGaps(fontSize);

  const {
    a, b, d,
    leftPadding,
    topPadding,
    rightPadding,
    bottomPadding,
    contentsTop,
  } = getEmptyFrameSize(fontSize);

  // text size
  const contentsTextSize = fitContentsSize({
    areaName,
    contents,
    description,
    fontSize,
    fontFamily,
  });

  const contentsWidth = contentsTextSize.width;

  // xy 坐标原点是frame线 内轮廓线 包围矩形 左上角，就是大约序号数字那里
  const titleSize = {
    x: xgap,
    y: -ygap,
    d,
    width: d + contentsWidth + rightPadding + xgap,
    height: getTitleHeight(fontSize)
  };

  const contentsSize = {
    ...contentsTextSize,
    x: a,
    y: - b - contentsTop,
    width: contentsWidth,
  };

  const frameSize = {
    x: 0,
    y: 0,
    a,
    b,
    width: leftPadding + contentsWidth + rightPadding,
    height: topPadding + titleSize.height + contentsTop + contentsSize.height + bottomPadding
  };

  const descriptionSize = {
    x: 0,
    y: -frameSize.height,
    width: frameSize.width,
    height: getDescriptionHeight(fontSize),
  };

  return {
    titleSize,
    contentsSize,
    frameSize,
    descriptionSize
  }

};

const moveBounds = (sizes, { x, y }) => {
  const nextSizes = {};
  Object.keys(sizes).forEach(k => {
    const c = {...sizes[k]};
    c.x += x;
    c.y += y;
    nextSizes[k] = c;
  });
  return nextSizes
};

const getPlacedSizesWithLink = ({
  fontSize,
  sizes,
  linkScale
}) => {
  const linkSize = getLinkSize({ fontSize, scale: linkScale });
  const offsetX = linkSize.width;
  const offsetY = linkSize.height
    + sizes.descriptionSize.height
    + sizes.frameSize.height;

  const nextSizes = moveBounds(sizes, { x: offsetX, y: offsetY });

  return {
    ...nextSizes,
    linkSize: {
      x: 0,
      y: 0,
      ...linkSize
    }
  }
};

const getPlacedSizesNoLink = ({
  fontSize,
  width,
  height,
  sizes
}) => {
  const { frameSize } = sizes;
  const gaps = getGaps(fontSize);

  const globalSize = getGlobalSize(fontSize);
  const offsetX = width - frameSize.width - gaps.x;
  const offsetY = height - globalSize.height / 2;

  return moveBounds(sizes, { x: offsetX, y: offsetY });
};

export const getPlacedSizes = (opt) => {
  const { fontSize } = opt;
  if ( !fontSize ) {
    throw 'fontSize error'
  }
  return opt.withLink ? getPlacedSizesWithLink(opt) : getPlacedSizesNoLink(opt);
};

// the area to adjust
const getAreaSize = ({
  fontSize,
  frameSize,
  withLink,
  linkScale,
}) => {
  const gaps = getGaps(fontSize);
  const globalSize = getGlobalSize(fontSize);
  const linkSize = withLink ? getLinkSize({fontSize, scale: linkScale}) : { width: 0, height: 0};
  const descriptionHeight = getDescriptionHeight(fontSize);

  return {
    width: linkSize.width
    + frameSize.width
    + gaps.x, // add right margin

    height: globalSize.height / 2 // top margin
    + frameSize.height
    + descriptionHeight
    + linkSize.height,
  };
};

const cutCardHorizontalSizes = (sizes, dx) => {
  if (sizes.titleSize.width > dx
    && sizes.contentsSize.width > dx
    && sizes.frameSize.width > dx
    && sizes.descriptionSize.width > dx
  ) {
    sizes.titleSize.width -= dx;
    sizes.contentsSize.width -= dx;
    sizes.frameSize.width -= dx;
    sizes.descriptionSize.width -= dx;
  }
};

const cutCardVerticalSizes = (sizes, dy) => {
  const rowHeight = sizes.contentsSize.rowHeight;
  let cutHeight = Math.ceil(dy / rowHeight) * rowHeight;

  const contentsSizeHeight = sizes.contentsSize.height - cutHeight;

  if (contentsSizeHeight > rowHeight && sizes.frameSize.height > cutHeight) {

  } else {
    // exceed, cut all
    cutHeight = sizes.contentsSize.height;
  }

  sizes.contentsSize.height -= cutHeight;
  sizes.frameSize.height -= cutHeight;
  sizes.descriptionSize.y += cutHeight;
};

/**
 * Fit card (link) into valid area
 * @param {number} viewportWidth - viewport width
 * @param {number} viewportHeight- viewport height
 * @param {number} width         - valid width
 * @param {number} height        - valid height
 * @param {string} areaName      - title text
 * @param {Array}  contents      - content items
 * @param {string} description   - bottom description text
 * @param {string} fontFamily    -
 * @param {boolean} fixed        - area is fixed or not (fixed no link)
 * @returns {{
 *    fontSize: number,
 *    frameSize: {a: number, b: number, width: number, height: number},
 *    titleSize: {},
 *    contentsSize: {width, height, rowHeight, x: number, y: number},
 *    descriptionSize: {}
 * }}
 */
export const calcFittedSize = ({
  viewportWidth,
  viewportHeight,
  width,
  height,
  areaName,
  contents,
  description,
  fontFamily,
  fixed,
}) => {

  const withLink = !fixed;

  let linkScale = LINK_SCALE;

  const minViewport = Math.min(viewportWidth, viewportHeight);
  const maxFontSize = Math.round(Math.max(minViewport * FONT_SIZE_RATIO.MAX, MIN_FONT_SIZE)),
        minFontSize = MIN_FONT_SIZE;

  let fontSize = maxFontSize;

  const getCardAreaSize = () => {
    let sizes = calcCardSize({
      areaName,
      contents,
      description,
      fontSize,
      fontFamily
    });

    let areaSize = getAreaSize({
      fontSize,
      frameSize: sizes.frameSize,
      withLink,
      linkScale
    });

    return {
      sizes, areaSize
    }
  };

  let { sizes, areaSize } = getCardAreaSize();

  if (maxFontSize === MIN_FONT_SIZE
    && (areaSize.width > width || areaSize.height > height)
  ) {
    // cannot be covered, decrease the link size
    linkScale = 1.5; // according to vis
    const tmp = getCardAreaSize();
    sizes = tmp.sizes;
    areaSize = tmp.areaSize;
  }

  const wRatio = areaSize.width / width;
  const hRatio = areaSize.height / height;

  const r = maxFontSize / minFontSize;

  if (wRatio <= 1 && hRatio <= 1) {
    // covered
  }
  else if (wRatio / r <= 1 && hRatio / r <= 1) {
    // covered after scale
    // a bit exceeded the boundary but no need to ellipsis
    const minR = Math.min(1 / wRatio, 1 / hRatio);
    fontSize = Math.floor(maxFontSize * minR);
    const tmp = getCardAreaSize();
    sizes = tmp.sizes;
  }
  else {
    // cannot be covered, omit some lines
    fontSize = minFontSize;

    // It's too troublesome to get accurate ellipsis.
    // Simply cut the exceeded width; omit lines;

    const tmp = getCardAreaSize();
    sizes = tmp.sizes;
    areaSize = tmp.areaSize;

    // the length to cut
    const dx = areaSize.width - width;
    const dy = areaSize.height - height;

    if (dx > 0) {
      cutCardHorizontalSizes(sizes, dx);
    }

    if (dy > 0) {
      cutCardVerticalSizes(sizes, dy);
    }
  }

  const placedSizes = getPlacedSizes({
    fontSize,
    sizes,
    width,
    height,
    withLink,
    linkScale
  });

  return {
    ...placedSizes,
    fontSize
  }

};

export const getTruncated = (text, width, style) => {
  let truncated = text;
  let tCount = 0;
  while (measureText(truncated, style).width > width) {
    truncated = truncated.substr(0, truncated.length - 1);
    ++tCount;
  }

  if (tCount === 1) {
    // prevent ABCD -> ABC…
    truncated = text;
  }
  else if (tCount > 1) {
    truncated += '…';
  }
  return truncated
};
