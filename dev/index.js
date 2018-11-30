// import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import config from '../config';
import { timeline } from 'popmotion';

const opt1 = {
  container: 'map',
  // style: 'mapbox://styles/mapbox/dark-v9',
  style: 'black',
  // style: {
  //   "version": 8,
  //   "sources": {
  //     "osm-tiles": {
  //       "type": "raster",
  //       'tiles': [
  //         // 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  //         'https://tilemap.geoq.cn/database/ytt_basemap/layergroup/a2b1bbaf4829217716e36b70c1d54b6f/0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50/{z}/{x}/{y}.png',
  //         // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  //         // 'http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6',
  //         // 'http://t3.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles'
  //       ],
  //       'tileSize': 256
  //     }
  //   },
  //   "layers": [{
  //     "id": "simple-tiles",
  //     "type": "raster",
  //     "source": "osm-tiles",
  //     "minzoom": 0,
  //     "maxzoom": 22
  //   }]
  // },
  effectCircleUrl: '',
  globalUrl: '',
  hash: true,
  center: [118.78 - 0.1, 32.04 - 0.1],
  zoom: 13,
  pitch: 60,
  interval: 3000,

  'title': {
    // "backgroundColor": "rgba(255,255,255,0.7490196078431373)",
    'borderRadius': 0,
    'style': {
      'fontFamily': 'Microsoft YaHei UI',
      'color': '#fff',
      'fontSize': '20pt',
      'fontWeight': ''
    },
    'useHtml': false,
    'text': '演示地图',
    'align': 'left'
  },
  border: {
    'shadow': true,
    'borderRadius': 10,
    'borderWidth': 5,
    'borderColor': '#0b9',
    'backgroundColor': '#02192c'
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
      '竣工日期: 2010年9月28日',
      // '1',
      // '2',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
      // '3',
    ],
    description: '江苏省南京市',
    // fixed: true,
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
};

const opt2 = {
  'border': {
    'borderColor': '#000000',
    'borderRadius': 0,
    'borderWidth': 0,
    'backgroundColor': '#06334B'
  },
  'refreshTime': 0,
  'center': [32, 42],
  'tooltip': {
    'areaName': '',
    'seriesName': '',
    'description': '',
    'fixed': false,
    'value': '¤#0'
  },
  'zoom': 8,
  'title': {
    'borderRadius': 0,
    backgroundColor: '#ccc',
    'extraCssText': '',
    'useHtml': true,
    'style': {
      'fontFamily': 'Microsoft YaHei',
      'color': 'rgba(0,0,0,1.0)',
      'fontSize': 30,
      'fontWeight': ''
    },
    'text': '测试测试测试测试',
    'align': 'left'
  },
  'type': 'point',
  'exportImage': true,
  'size': 10,
  'playZoom': 11,
  'style': 'black',
  'interval': 6000,
  'locations': [{
    'lngLat': ['20.299', '32.0'],
    'areaName': '江苏省',
    'seriesName': ['人口', '大学'],
    'description': '测试',
    'index': 1,
    'value': ['333333', '666'],
    'zoom': 4.5,
    'pitch': 45,
    'size': 4,
    // 'fixed': true,
    'type': 'point',
    'opacity': 0.7,
    'contents': [
      "人口:￥333333",
      "大学:￥666",
      '区域电话：12345678900',
      'aaaaaa',
      'bbbbbbb'
    ]
  },
      {
      "lngLat": ["137.0", "23.0"],
      "areaName": "无锡",
      "seriesName": ["人口", "大学"],
      "description": "也是假的",
      "index": 2,
      "value": ["3333333", "444"],
      "zoom": 3.5,
      "pitch": 45,
      "size": 10,
      "fixed": false,
      "type": "point",
      "opacity": 1,
      "contents": ["人口:￥3333333", "大学:￥444"]
    },
    {
      'lngLat': ['123', '47'],
      'areaName': '南京',
      'seriesName': ['大学'],
      'description': '也是假的',
      'index': 3,
      'value': ['333'],
      'zoom': 11,
      'pitch': 45,
      'size': 10,
      'fixed': false,
      'type': 'point',
      'opacity': 1,
      'contents': ['大学:￥333']
    }, {
      'lngLat': ['123', '47'],
      'areaName': '假南京',
      'seriesName': ['人口'],
      'description': '也是假的',
      'index': 4,
      'value': ['0000'],
      'zoom': 11,
      'pitch': 45,
      'size': 10,
      'fixed': false,
      'type': 'point',
      'opacity': 1,
      'contents': ['人口:￥0000']
    }],
  'opacity': 1,
  'container': 'map',
  // "effectCircleUrl": "report?op=chart&cmd=get_webm&path=com/fr/plugin/chart/requiredFile/circle.webm",
  // "globalUrl": "report?op=chart&cmd=get_webm&path=com/fr/plugin/chart/requiredFile/global.webm",
  'pitch': 60,
  // "interactive": false,
  // hash: true,
};

const opt3 = {
  'border': {
    'borderColor': 'red',
    'borderRadius': 5,
    'borderWidth': 5,
    'backgroundColor': '#06334B'
  },
  'refreshTime': 0,
  'center': [132, 32],
  'tooltip': {
    'areaName': '',
    'seriesName': '',
    'description': '',
    'fixed': false,
    'value': '¤#0'
  },
  'zoom': 11,
  'title': {
    'borderRadius': 0,
    backgroundColor: '#ccc',
    'extraCssText': '',
    'useHtml': true,
    'style': {
      'fontFamily': 'Microsoft YaHei',
      'color': 'rgba(0,0,0,1.0)',
      'fontSize': 30,
      'fontWeight': ''
    },
    'text': '测试测试测试测试',
    'align': 'left'
  },
  'type': 'point',
  'exportImage': true,
  'size': 10,
  'playZoom': 11,
  'style': 'black',
  'interval': 7000,
  'locations': [{
    'lngLat': ['20.299', '32.0'],
    'areaName': '温州市',
    'seriesName': ['人口', '大学'],
    'description': '绿地一期',
    'index': 1,
    'value': ['333333', '666'],
    'zoom': 4,
    'pitch': 45,
    'size': 5,
    'fixed': false,
    'type': 'point',
    'opacity': 0.8,
    'contents': [
      "人口:￥333333",
      "大学:￥666",
      'Abghf'
      // '区域电话：12345678900'
    ]
  }],
  'opacity': 1,
  'container': 'map',
  // "effectCircleUrl": "report?op=chart&cmd=get_webm&path=com/fr/plugin/chart/requiredFile/circle.webm",
  // "globalUrl": "report?op=chart&cmd=get_webm&path=com/fr/plugin/chart/requiredFile/global.webm",
  'pitch': 60,
  // "interactive": false,
  hash: true,
};

function main () {
  SlideshowMap.setAccessToken(config.accessToken);

  const slideshowMap = new SlideshowMap(opt2);

  function resize (num) {
    const dom = document.getElementById('map');
    dom.style.width = num + '%';
    dom.style.height = num + '%';
    slideshowMap.resize();
  }

  // timeline([
  //   300,
  //   { track: 'v', from: 100, to: 80, duration: 700 }
  // ]).start(({v}) => {
  //   resize(v);
  // });
}

main();

window._next = function () {
  if (window._nextTurn) {
    window._nextTurn();
  }
};

