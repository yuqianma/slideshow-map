import {
  getGaps,
  getLinkSize,
  getGlobalSize,
  getEmptyFrameSize,
  calcCardSize,
  getPlacedSizes,
  calcFittedSize
} from '../src/helper';

import {
  TITLE_FONT_SIZE_SCALE,
  LINE_HEIGHT,
} from '../src/constants';

const Epsilon = 1e-6;

// http://www.finedevelop.com/pages/viewpage.action?pageId=22676298
describe('Layout', function () {
  describe('getGaps', function () {
    it('should match angle 50', function () {
      const { x, y } = getGaps(10);
      expect(y / x).to.be.closeTo(Math.tan(50 / 180 * Math.PI), Epsilon);
    });
  });

  describe('getEmptyFrameSize', function () {
    const fontSize = 10;
    const { x, y } = getGaps(fontSize);
    // Seems like we write the fn again if we check every values;
    //
    // const titleHeight = fontSize * TITLE_FONT_SIZE_SCALE * LINE_HEIGHT * 1.2;
    // const d = getGaps(titleHeight).x;
    // const a = d + x;
    // const b = titleHeight + y;
    it('should have padding', function () {
      const result = getEmptyFrameSize(fontSize);
      const tests = {
        // leftPadding: x, // +d
        topPadding: y,
        rightPadding: 2 * x,
        bottomPadding: 1.5 * y
      };
      Object.keys(tests).forEach(k => {
        expect(result).to.have.property(k, tests[k]);
      });
    });
  });

  describe('calcCardSize', function () {
    // a stub
    const fitContentsSize = () => ({
      width: 326.6,
      height: 75.6,
      rowHeight: 25.2
    });
    const fontSize = 20;
    const gaps = getGaps(fontSize);
    const {
      a, b, d,
      leftPadding,
      topPadding,
      rightPadding,
      bottomPadding,
      contentsTop,
    } = getEmptyFrameSize(fontSize);
    const titleHeight = fontSize * TITLE_FONT_SIZE_SCALE * LINE_HEIGHT * 1.2;

    const result = calcCardSize({
      // omit other parameters as we have stub
      fontSize,
      fitContentsSize
    });

    it('should contain all texts', function () {
      expect(result.frameSize).to.be.eql({
        a, b,
        x: 0,
        y: 0,
        width: 326.6 + leftPadding + rightPadding,
        height: topPadding + titleHeight + contentsTop + 75.6 + bottomPadding
      });

      let tests = {
        d,
        x: gaps.x,
        y: -gaps.y,
        width: result.frameSize.width,
        height: titleHeight
      };
      Object.keys(tests).forEach(k => {
        expect(result.titleSize[k]).to.be.closeTo(tests[k], Epsilon);
      });

    });
  });

  describe.skip('getPlacedSizes', function () {
    const fontSize = 10;
    const gaps = getGaps(fontSize);
    const globalSize = getGlobalSize(fontSize);

    const sizes = calcCardSize({
      // omit other parameters as we have stub
      fontSize,
      fitContentsSize: () => ({
        width: 300,
        height: 120,
        rowHeight: 12
      })
    });

    describe('fixed', function () {
      const result = getPlacedSizes({
        fontSize,
        width: 1000,
        height: 900,
        sizes,
        withLink: false
      });
      it('should place card at top-right', function () {
        const { frameSize } = result;
        expect(frameSize.x + frameSize.width + gaps.x).to.be.equal(1000);
        expect(frameSize.y + globalSize.height / 2).to.be.equal(900);
      });
    });

    describe('non-fixed', function () {
      const result = getPlacedSizes({
        fontSize,
        width: 1000,
        height: 900,
        sizes,
        withLink: true
      });
      const linkSize = getLinkSize(fontSize);

      it('should place link at 0,0', function () {
        expect(result.linkSize).to.be.eql({
          x: 0,
          y: 0,
          ...linkSize
        });
      });
      it('should place description at the end of link', function () {
        const { descriptionSize } = result;
        expect(descriptionSize.x).to.be.equal(linkSize.width);
        expect(descriptionSize.y).to.be.equal(linkSize.height + descriptionSize.height);
      });
    });

  });

  describe.skip('calcContentsSize', function () {
    const cases = [{
      type: 'normal',
      input: {
        viewportWidth: 1000,
        width: 500,
        height: 400,
        areaName: '紫峰大厦',
        contents: [
          '短文字1',
          '短文字2'
        ],
        description: '南京',
        fontFamily: 'sans-serif',
        fixed: false,
      },
      output: {
        fontSize: 15,
        // d,
        // titleSize,
        // contentsSize,
        // frameSize,
      }
    }, {
      type: 'loooooong',
      input: {
        viewportWidth: 1000,
        width: 500,
        height: 400,
        areaName: '紫峰大厦',
        contents: [
          '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字1',
          '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字2'
        ],
        description: '南京',
        fontFamily: 'sans-serif',
        fixed: false,
      },
      output: {
        fontSize: 12,
        // d,
        // titleSize,
        // contentsSize,
        // frameSize,
      }
    }, {
      type: 'high',
      input: {
        viewportWidth: 1000,
        width: 500,
        height: 400,
        areaName: '紫峰大厦',
        contents: [
          '长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字长文字1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
        ],
        description: '南京',
        fontFamily: 'sans-serif',
        fixed: false,
      },
      output: {
        fontSize: 12,
        // d,
        // titleSize,
        // contentsSize,
        // frameSize,
      }
    }, {
      type: 'between',
      input: {
        viewportWidth: 1000,
        width: 500,
        height: 400,
        areaName: '紫峰大厦',
        contents: [
          '长文字长文字长文字长文字长文',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1',
          '1'
        ],
        description: '南京',
        fontFamily: 'sans-serif',
        fixed: false,
      },
      output: {
        fontSize: 13.87
      }
    }];

    cases.forEach(({ type, input, output }) => {
      describe(type, function () {
        const result = calcFittedSize(input);
        it(`should have fontSize ${output.fontSize}`, function () {
          expect(result.fontSize).to.be.closeTo(output.fontSize, 0.1);
        });
        it(`should limit the width`, function () {
          expect(result.titleSize.width).to.be.at.most(input.width);
          expect(result.contentsSize.width).to.be.at.most(input.width);
          expect(result.frameSize.width).to.be.at.most(input.width);
        });
        it(`should limit the height`, function () {
          expect(result.titleSize.height).to.be.at.most(input.height);
          expect(result.contentsSize.height).to.be.at.most(input.height);
          expect(result.frameSize.height).to.be.at.most(input.height);
        });
      });
    });
  });

});