import { getTruncated } from '../src/helper';

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
