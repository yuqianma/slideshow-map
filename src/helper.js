import { measureText } from './Utils/Svg';
import {
  LINE_HEIGHT,
  TITLE_FONT_SIZE_SCALE,
  ANGLE,
  FONT_SIZE_RATIO,
  LINK_SCALE
} from './constants';

const getGaps = fontSize => ({
  x: fontSize / Math.tan(ANGLE),
  y: fontSize
});

const getGlobalSize = fontSize => ({
  width: fontSize * 100 / 15, // approximately
  height: fontSize * 100 / 15
});

const getLinkSize = fontSize => ({
  width: fontSize * Math.cos(ANGLE) * LINK_SCALE,
  height: fontSize * Math.sin(ANGLE) * LINK_SCALE
});

const getDescriptionHeight = fontSize => fontSize * 1.3;// approximately

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

// assume no text there
export const getEmptyFrameSize = ({
  fontSize,
}) => {
  const {
    x: xgap,
    y: ygap,
  } = getGaps(fontSize);

  const titleHeight = fontSize * TITLE_FONT_SIZE_SCALE * 1.2; // bbox height 1.2

  /*
    ____________________
   /|                   | | height
  /_|___________________| |
  d |
  ------- width --------
  */
  const d = titleHeight / Math.tan(ANGLE);

  // the gap between main frame (line) & title & contents outline

  const leftPadding = xgap + d;

  const topPadding = ygap; // title top

  const rightPadding = xgap * 2;

  const bottomPadding = ygap * 2; // contents bottom

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
    titleHeight,
  }
};

export const calcCardSize = ({
  areaName,
  contents,
  description,
  fontSize,
  fontFamily,
}) => {
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
  } = getEmptyFrameSize({ fontSize });

  // calculate pos & size

  const titleFontSize = fontSize * TITLE_FONT_SIZE_SCALE;

  // text size
  const areaNameSize = measureText(areaName, {
    fontSize: titleFontSize,
    fontFamily
  });

  // component size
  const titleSize = {
    height: areaNameSize.height * LINE_HEIGHT
  };

  const contentsTextSize = calcContentsSize({
    contents,
    lineHeight: LINE_HEIGHT,
    fontSize,
    fontFamily
  });

  const descriptionTextSize = measureText(description, {
    fontSize, fontFamily
  });

  const contentsWidth = Math.max(
    areaNameSize.width,
    contentsTextSize.width,
    descriptionTextSize.width - fontSize // approximately
  );

  const contentsSize = {
    ...contentsTextSize,
    x: a,
    y: - b - contentsTop,
    width: contentsWidth,
  };

  titleSize.width = d + contentsSize.width + rightPadding + xgap;

  const frameSize = {
    a,
    b,
    width: leftPadding + contentsSize.width + rightPadding,
    height: topPadding + titleSize.height + contentsTop + contentsSize.height + bottomPadding
  };

  return {
    d,
    titleSize,
    contentsSize,
    frameSize
  }

};

// the area to adjust
const getAreaSize = ({
  fontSize,
  frameSize,
  withLink
}) => {
  const gap = getGaps(fontSize);
  const globalSize = getGlobalSize(fontSize);
  const linkSize = withLink ? getLinkSize(fontSize) : { width: 0, height: 0};
  const descriptionHeight = getDescriptionHeight(fontSize);

  return {
    width: linkSize.width + frameSize.width + gap.x, // add frame background

    height: globalSize.height / 2
    + frameSize.height
    + descriptionHeight
    + linkSize.height,
  };
};

/**
 * Fit card (link) into valid area
 * @param {number} viewportWidth - viewport width
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
 *    titleSize: {height: number},
 *    contentsSize: {width, height, rowHeight, x: number, y: number},
 *    d: number
 * }}
 */
export const calcFittedSize = ({
  viewportWidth,
  width,
  height,
  areaName,
  contents,
  description,
  fontFamily,
  fixed,
}) => {

  let fontSize = viewportWidth * FONT_SIZE_RATIO.MAX;

  let {
    d,
    titleSize,
    contentsSize,
    frameSize,
  } = calcCardSize({
    areaName,
    contents,
    description,
    fontSize,
    fontFamily
  });

  let areaSize = getAreaSize({ fontSize, frameSize, withLink: !fixed });

  const wRatio = areaSize.width / width;
  const hRatio = areaSize.height / height;

  const r = FONT_SIZE_RATIO.MAX / FONT_SIZE_RATIO.MIN;

  // normal
  if (wRatio <= 1 && hRatio <= 1) {
    return {
      fontSize,
      d,
      titleSize,
      contentsSize,
      frameSize,
    }
  }
  // a bit exceeded the boundary but don't need to ellipsis
  else if (wRatio <= r && hRatio <= r) {
    const minR = Math.min(wRatio, hRatio);
    fontSize = viewportWidth * FONT_SIZE_RATIO.MAX * minR;
    const size = calcCardSize({
      areaName,
      contents,
      description,
      fontSize,
      fontFamily
    });

    return {
      ...size,
      fontSize
    }
  }
  else {
    fontSize = viewportWidth * FONT_SIZE_RATIO.MIN;

    // It's too troublesome to get accurate ellipsis.
    // Simply cut the exceeded width; omit lines;

    let {
      d,
      titleSize,
      contentsSize,
      frameSize,
    } = calcCardSize({
      areaName,
      contents,
      description,
      fontSize,
      fontFamily
    });

    let areaSize = getAreaSize({ fontSize, frameSize, withLink: !fixed });

    // the length to cut
    const dx = areaSize.width - width;
    const dy = areaSize.height - height;

    if (dx) {
      // these widths have been aligned, so it's safe to cut
      titleSize.width -= dx;
      contentsSize.width -= dx;
      frameSize.width -= dx;
    }

    if (dy) {
      const rowHeight = contentsSize.rowHeight;
      const cutHeight = Math.ceil(dy / rowHeight) * rowHeight;
      contentsSize.height -= cutHeight;
      frameSize.height -= cutHeight;
    }

    return {
      fontSize,
      d,
      titleSize,
      contentsSize,
      frameSize,
    }

  }

};

