import { calcFittedSize } from '../src/helper';

// http://www.finedevelop.com/pages/viewpage.action?pageId=22676298
describe('Layout: calcContentsSize', function () {
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
  }];

  cases.forEach(({ type, input, output }) => {
    describe(type, function () {
      const result = calcFittedSize(input);
      it(`should have fontSize ${output.fontSize}`, function () {
        expect(result.fontSize).to.be.equal(output.fontSize);
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