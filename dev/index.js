// import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import config from '../config';

function main () {
  SlideshowMap.setAccessToken(config.accessToken);

  const slideshowMap = new SlideshowMap({
    container: 'map',
    // style: 'mapbox://styles/mapbox/dark-v9',
    style: {
      "version": 8,
      "sources": {
        "osm-tiles": {
          "type": "raster",
          'tiles': [
            'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            // 'https://tilemap.geoq.cn/database/ytt_basemap/layergroup/a2b1bbaf4829217716e36b70c1d54b6f/0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50/{z}/{x}/{y}.png',
            // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            // 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6',
            // 'http://t3.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles'
          ],
          'tileSize': 256
        }
      },
      "layers": [{
        "id": "simple-tiles",
        "type": "raster",
        "source": "osm-tiles",
        "minzoom": 0,
        "maxzoom": 22
      }]
    },
    effectCircleUrl: '',
    globalUrl: '',
    hash: true,
    center: [118.78 - 0.1, 32.04 - 0.1],
    zoom: 13,
    pitch: 60,
    interval: 3000,

    "title": {
      // "backgroundColor": "rgba(255,255,255,0.7490196078431373)",
      "borderRadius": 0,
      "style": {
        "fontFamily": "Microsoft YaHei UI",
        "color": "#fff",
        "fontSize": "20pt",
        "fontWeight": ""
      },
      "useHtml": false,
      "text": "演示地图",
      "align": "left"
    },
    border: {
      "shadow": true,
      "borderRadius": 10,
      "borderWidth": 5,
      "borderColor": "#0b9",
      "backgroundColor": '#02192c'
    },
    locations: [{
      index: 1,
      type: 'pillar', // point
      size: 5,
      opacity: 0.8,

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
      fixed: true,
    }, {
      index: 2,
      type: 'point',
      size: 2,
      opacity: 0.8,
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

window._next = function () {
  if (window._nextTurn) {
    window._nextTurn();
  }
};
