import { getTruncated } from '../src/helper';
import { getRotatedColor } from '../src/Utils/Utils';
import { MainColor, Box } from '../src/constants';

describe('Truncate', function () {
  const style = { fontSize: 10 };
  it('should keep short texts', function () {
    expect(getTruncated('123', 100, style)).to.be.equal('123');
  });
  it('should keep origin if only one char is truncated', function () {
    expect(getTruncated('国国国国', 35, style)).to.be.equal('国国国国');
  });
  it('should truncate', function () {
    expect(getTruncated('国国国国国国国国', 35, style)).to.be.equal('国国国…');
  });
});

describe('Color Rotate', function () {
  it('should return the same color when ref & given default main color', function () {
    expect(getRotatedColor(MainColor, MainColor).getHSL({})).to.be.eql(new THREE.Color(MainColor).getHSL({}));
  });

  it('should return the `WireFrameColor` color when ref `WireFrameColor` & given default main color', function () {
    expect(getRotatedColor(Box.WireFrameColor, MainColor).getHSL({})).to.be.eql(new THREE.Color(Box.WireFrameColor).getHSL({}));
  });

  it('should return color with h = 0 when ref default main color given red', function () {
    expect(getRotatedColor(MainColor, 'red').getHSL({}).h).to.be.eql(0);
  });
});
