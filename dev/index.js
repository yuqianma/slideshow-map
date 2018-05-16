// import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import mapboxgl from 'mapbox-gl';

const slideshowMap = new SlideshowMap({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [118.78 - 0.1, 32.04 - 0.1],
  zoom: 14,
  pitch: 60,
  // bearing: -60,
  // heading: 41,
  hash: true
});

slideshowMap.installComponents();

window.map = slideshowMap.map;

window.flyTo = {
  nanjing: () => map.flyTo({
    center: [118.78, 32.04],
    zoom: 15.00,
    pitch: 60
  }),

  wuxi: () => map.flyTo({
    center: [120.299, 31.568],
    zoom: 12.21,
    pitch: 50,
    speed: 0.5
  })
};

// slideshowMap.map.on('load', () => {
// });

// slideshowMap.map.addControl(new mapboxgl.ScaleControl({
//   unit: 'metric'
// }));

const testOptions = {
  index: 1,
  areaName: '江苏省南京市紫峰大厦',
  contents: [
    '外文名称: Greenland Square Zifeng Tower',
    '建筑高度: 450m',
    '建筑面积: 137529.00㎡',
    // '楼层信息: 地上89层，地下3层',
    // '开工日期: 2005年5月底',
    // '竣工日期: 2010年9月28日',
    // '投资单位: 南京国资，上海绿地南京事业部',
    // '建筑造价: 40亿',
    // '电梯数量: 54台',
    // '地铁信息: 鼓楼站（3号出口）',
    // '总设计师: 杨德虎',
    // '总工程师: 张宁'
  ],
  description: '江苏省南京市',
  pillar: true,
  // fixed: true,
  size: 2,
  fontFamily: 'sans-serif',
  lngLat: [118.77680629491806, 32.0620757594658],
  zoom: 14,
  pitch: 45,
};

window.run = () => slideshowMap.flyTo(testOptions);

window.runCard = () => slideshowMap._test(testOptions);

window.setTimeout(() => {

  run();
}, 100);

// runCard();
window.setTimeout(() => {
  // cancelAnimationFrame(window.threebox._updateid)
}, 1000);
