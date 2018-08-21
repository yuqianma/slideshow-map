// import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import config from '../config';

function main () {
  SlideshowMap.setAccessToken(config.accessToken);

  const slideshowMap = new SlideshowMap({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    effectCircleUrl: '',
    globalUrl: '',
    center: [118.78 - 0.1, 32.04 - 0.1],
    zoom: 13,
    pitch: 60,
    interval: 3000,
    locations: [{
      index: 1,
      type: 'pillar', // point
      size: 2,

      // color: '#0bd',

      // it's not center
      lngLat: [118.77680629491806, 32.0620757594658],

      zoom: 14,
      pitch: 45,

      fontFamily: 'sans-serif',

      areaName: '江苏省南京市紫峰大厦',
      contents: [
        '外文名称: Greenland Square Zifeng Tower',
        '建筑高度: 450m',
        '建筑面积: 137529.00㎡',
        '楼层信息: 地上89层，地下3层',
        '开工日期: 2005年5月底',
        '竣工日期: 2010年9月28日'
      ],
      description: '江苏省南京市',
      // fixed: true,
    }, {
      index: 2,
      type: 'point',
      size: 2,
      color: '#0b9',
      lngLat: [120.299, 31.568],
      zoom: 14.21,
      pitch: 50,
      areaName: '江苏省无锡市',
      contents: [
        'AAAAAAAAAAAAAAAAAAAAA',
        'BBBBBBBBBBB',
        'CCCCCCCCCCCCCCCC'
      ],
      description: '江苏省无锡市',
    }]
  });
}

main();


