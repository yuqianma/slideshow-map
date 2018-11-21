/**
 * Created by Jeffrey on 2018/11/21.
 */
import { $test } from '../src';

describe('Options Process', function () {
  describe('Style', function () {
    it('should convert default style name: `black`/`satellite` to mapbox tiles', function () {
      expect($test.mergeDefaultOptions({ style: 'black' })).to.nested.include({
        'style.sources.image-tiles.tiles[0]': $test.TILES.BLACK
      });
      expect($test.mergeDefaultOptions({ style: 'satellite' })).to.nested.include({
        'style.sources.image-tiles.tiles[0]': $test.TILES.SATELLITE
      });
    });

    it('should convert tile url to mapbox tiles', function () {
      expect($test.mergeDefaultOptions({ style: 'http://foo' })).to.nested.include({
        'style.sources.image-tiles.tiles[0]': 'http://foo'
      });
      expect($test.mergeDefaultOptions({ style: 'https://foo' })).to.nested.include({
        'style.sources.image-tiles.tiles[0]': 'https://foo'
      });
    });

    it('should remain mapbox inner style', function () {
      expect($test.mergeDefaultOptions({ style: 'mapbox://styles/mapbox/dark-v9' })).to.include({
        style: 'mapbox://styles/mapbox/dark-v9'
      });
    });

    it('should remain custom style options', function () {
      expect($test.mergeDefaultOptions({
        style: {
          "version": 8,
          "sources": {}
        }
      })).to.be.eql({
        style: {
          "version": 8,
          "sources": {}
        }
      });
    });
  });
});
