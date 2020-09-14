// import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import config from '../config';
import { opt4 } from './data';

const opt1 = {
  container: 'map',
  // style: 'mapbox://styles/mapbox/dark-v9',
  style: 'black',
  // style: 'http://support.supermap.com.cn:8090/iserver/services/map-china400/wms111/China?&service=WMS&request=GetMap&layers=0%2C0.0%2C0.1%2C0.73%2C0.76%2C0.77%2C0.78%2C0.79&styles=&format=image%2Fjpeg&transparent=false&version=1.1.1&height=256&width=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}',
  // style: 'https://demo.mapserver.org/cgi-bin/wms?&service=WMS&request=GetMap&layers=bluemarble,cities&styles=&format=image%2Fjpeg&transparent=false&version=1.1.1&height=256&width=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}',
  // style: {
  //   "version": 8,
  //   "sources": {
  //     "osm-tiles": {
  //       "type": "raster",
  //       'tiles': [
  //         // 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  //         // 'https://tilemap.geoq.cn/database/ytt_basemap/layergroup/a2b1bbaf4829217716e36b70c1d54b6f/0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50/{z}/{x}/{y}.png',
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

    color: '#00fffc',
    labelScale: 1.2,

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
      // '1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      '2',
      '3',
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
    color: '#0f0',
    labelScale: 1.2,
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
  'interval': 600000,
  'locations': [{
    // showCard: false,
    'lngLat': ['20.299', '32.0'],
    'areaName': '江苏省',
    'seriesName': ['人口', '大学'],
    'description': '测试',
    'index': 1,
    'value': ['333333', '666'],
    'zoom': 4.5,
    'pitch': 45,
    'size': 5,
    // 'fixed': true,
    // 'type': 'pillar',
    'opacity': 0.7,
    'contents': [
      '人口:￥333333',
      // "大学:￥666",
      // '区域电话：12345678900',
      // 'aaaaaa',
      // 'bbbbbbb'
    ]
  },
    {
      // showCard: false,
      'lngLat': ['137.0', '23.0'],
      'areaName': '无锡',
      'seriesName': ['人口', '大学'],
      'description': '也是假的',
      'index': 2,
      'value': ['3333333', '444'],
      'zoom': 3.5,
      'pitch': 45,
      'size': 10,
      'fixed': false,
      'type': 'pillar',
      'opacity': 1,
      'contents': ['人口:￥3333333', '大学:￥444']
    },
    {
      showCard: false,
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
      'type': 'pillar',
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
      'type': 'pillar',
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
    'description': '绿地一期AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'index': 1,
    'value': ['333333', '666'],
    'zoom': 4,
    'pitch': 45,
    'size': 5,
    'fixed': false,
    'type': 'pillar',
    'opacity': 0.8,
    'contents': [
      '人口:￥333333',
      '大学:￥666',
      'Abghf',
      '区域电话：12345678900'
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

const opt5 = {
  style: 'black',
  'language': 'zh_CN',
  'zoom': '6',
  'playZoom': '6',
  'interval': 8000,
  'title': {
    'useHtml': true,
    'text': '',
    'style': {
      'fontFamily': 'Microsoft YaHei',
      'fontSize': '21.333333333333332px',
      'color': 'rgba(255,255,255,1.0)',
      'fontWeight': '',
      'lineHeight': 'normal',
      'FONT_SCALE': 1
    },
    'align': 'left',
    'borderRadius': 0,
    'opacity': 100
  },
  'border': {'borderColor': 'rgb(0,0,0)', 'borderWidth': 0, 'borderRadius': 0},
  'type': 'pillar',
  'size': 4,
  'opacity': 1,
  'tooltip': {'areaName': '', 'seriesName': '', 'value': '', 'description': '', 'showCard': true, 'fixed': false},
  'center': ['13', '53'],
  'locations': [{
    // CHART-4039
    // pillar出界
    // https://zh.wikipedia.org/wiki/%E9%BA%A5%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1%E6%B3%95
    // bug原因：两级地图变形了，计算时没考虑这个，暂缓……
    'lngLat': [53, 74],
    'areaName': '方式',
    'description': '',
    'seriesName': ['大幅度'],
    'value': ['324'],
    'zoom': '6',
    'pitch': 45,
    'size': 10,
    'showCard': true,
    'fixed': false,
    'type': 'pillar',
    'opacity': 1,
    'index': 3,
    'contents': ['大幅度:324'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [13, 0],
    'areaName': '二十个',
    'description': '',
    'seriesName': ['3大V'],
    'value': ['252'],
    'zoom': '6',
    'pitch': 45,
    'size': 10,
    'showCard': true,
    'fixed': false,
    'type': 'pillar',
    'opacity': 1,
    'index': 1,
    'contents': ['3大V:252'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }],
  'exportImage': true,
  'container': 'map',
  'pitch': 60,
  'interactive': false,
  'trackResize': false
};

const opt6 = {
  'trialLicenseWater': '正在试用功能——扩展图表',
  'hyperLink': {},
  'refreshTime': 0,
  'emptyDataTip': {
    'enabled': true,
    'content': [{'style': {'fontSize': '24px', 'fontFamily': 'PingFangSC-Regular,Microsoft Yahei', 'color': '#979797'}}]
  },
  'language': 'zh_CN',
  'style': {
    'version': 8,
    'sources': {
      'image-tiles': {
        'type': 'raster',
        'tiles': ['https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'],
        'tileSize': 256
      }
    },
    'layers': [{'id': 'simple-tiles', 'type': 'raster', 'source': 'image-tiles', 'minzoom': 0, 'maxzoom': 22}]
  },
  'zoom': 11,
  'playZoom': 11,
  'interval': 80000,
  'title': {
    'useHtml': true,
    'text': '传参分类名',
    'style': {
      'fontFamily': '微软雅黑',
      'fontSize': '21px',
      'color': 'rgba(255,255,255,1.0)',
      'fontWeight': '',
      'lineHeight': 'normal',
      'FONT_SCALE': 1,
      'fill': 'rgba(255,255,255,1.0)'
    },
    'align': 'left',
    'borderRadius': 0,
    'opacity': 100
  },
  'border': {'borderColor': 'rgb(0,0,0)', 'borderWidth': 0, 'borderRadius': 0},
  'type': 'pillar',
  'size': 5,
  'opacity': 1,
  'tooltip': {'areaName': '', 'seriesName': '', 'value': '', 'description': '', 'showCard': true, 'fixed': true},
  'center': ['120.3189534644', '31.4967394989'],
  'locations': [{
    'lngLat': [120.3189534644, 31.4967394989],
    'areaName': '无锡XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2432', '2546'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    // 'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 1,
    'contents': ['index1:2432', 'index2:2546'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [126.542418434, 45.8077839548],
    'areaName': '哈尔滨XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3821', '3218'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 2,
    'contents': ['index1:3821', 'index2:3218'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [129.63244, 44.55269],
    'areaName': '牡丹江XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3243', '581'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 3,
    'contents': ['index1:3243', 'index2:581'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [125.3301296792, 43.8219013261],
    'areaName': '长春XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2842', '4217'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 4,
    'contents': ['index1:2842', 'index2:4217'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [126.54944, 43.83784],
    'areaName': '吉林XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2387', '1371'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 5,
    'contents': ['index1:2387', 'index2:1371'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.2854, 31.92005],
    'areaName': '江阴XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1963', '4376'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 6,
    'contents': ['index1:1963', 'index2:4376'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [123.4631, 41.67718],
    'areaName': '沈阳XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3472', '1377'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 7,
    'contents': ['index1:3472', 'index2:1377'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [122.24469, 43.65247],
    'areaName': '通辽XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2900', '4513'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 8,
    'contents': ['index1:2900', 'index2:4513'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [121.44801, 37.46353],
    'areaName': '烟台XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1900', '1323'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 9,
    'contents': ['index1:1900', 'index2:1323'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.23065, 37.72913],
    'areaName': '乐陵XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1800', '4908'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 10,
    'contents': ['index1:1800', 'index2:4908'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [113.62493, 34.74725],
    'areaName': '郑州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1700', '2045'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 11,
    'contents': ['index1:1700', 'index2:2045'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [112.12255, 32.009],
    'areaName': '襄阳XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1300', '3640'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 12,
    'contents': ['index1:1300', 'index2:3640'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [106.55073, 29.56471],
    'areaName': '重庆XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2100', '713'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 13,
    'contents': ['index1:2100', 'index2:713'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [100.26764, 25.60648],
    'areaName': '大理XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2000', '3727'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 14,
    'contents': ['index1:2000', 'index2:3727'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [99.16181, 25.11205],
    'areaName': '保山XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2300', '2629'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 15,
    'contents': ['index1:2300', 'index2:2629'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.28577, 34.2044],
    'areaName': '徐州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1800', '865'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 16,
    'contents': ['index1:1800', 'index2:865'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [119.01595, 33.61016],
    'areaName': '淮安盱眙XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1400', '4158'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 17,
    'contents': ['index1:1400', 'index2:4158'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.15515, 30.27415],
    'areaName': '杭州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3500', '1322'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 18,
    'contents': ['index1:3500', 'index2:1322'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.65518, 27.77838],
    'areaName': '瑞安XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2300', '3194'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 19,
    'contents': ['index1:2300', 'index2:3194'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.69939, 27.99492],
    'areaName': '温州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2302', '2079'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 20,
    'contents': ['index1:2302', 'index2:2079'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.64725, 24.51347],
    'areaName': '漳州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2303', '2170'],
    'zoom': 11,
    'pitch': 45,
    'size': 8,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 21,
    'contents': ['index1:2303', 'index2:2170'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }],
  'autoLink': {},
  'container': 'map',
  'pitch': 60,
  'interactive': false,
  'trackResize': false
};

const opt7 = {
  'trialLicenseWater': '正在试用功能——扩展图表',
  'hyperLink': {},
  'refreshTime': 0,
  'emptyDataTip': {
    'enabled': true,
    'content': [{'style': {'fontSize': '24px', 'fontFamily': 'PingFangSC-Regular,Microsoft Yahei', 'color': '#979797'}}]
  },
  'language': 'zh_CN',
  'style': {
    'version': 8,
    'sources': {
      'image-tiles': {
        'type': 'raster',
        'tiles': ['https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'],
        'tileSize': 256
      }
    },
    'layers': [{'id': 'simple-tiles', 'type': 'raster', 'source': 'image-tiles', 'minzoom': 0, 'maxzoom': 22}]
  },
  'zoom': 11,
  'playZoom': 11,
  'interval': 8000,
  'title': {
    'useHtml': true,
    'text': '传参分类名韩文',
    'style': {
      'fontFamily': '微软雅黑',
      'fontSize': '21px',
      'color': 'rgba(255,255,255,1.0)',
      'fontWeight': '',
      'lineHeight': 'normal',
      'FONT_SCALE': 1,
      'fill': 'rgba(255,255,255,1.0)'
    },
    'align': 'left',
    'borderRadius': 0,
    'opacity': 100
  },
  'border': {'borderColor': 'rgb(0,0,0)', 'borderWidth': 0, 'borderRadius': 0},
  'type': 'pillar',
  'size': 5,
  'opacity': 1,
  'tooltip': {'areaName': '', 'seriesName': '', 'value': '', 'description': '', 'showCard': true, 'fixed': true},
  'center': ['120.3189534644', '31.4967394989'],
  'locations': [{
    'lngLat': [120.3189534644, 31.4967394989],
    'areaName': '无锡XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2432', '2546'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 1,
    'contents': ['index1:2432', 'index2:2546'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [126.542418434, 45.8077839548],
    'areaName': '哈尔滨XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3821', '3218'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 2,
    'contents': ['index1:3821', 'index2:3218'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [129.63244, 44.55269],
    'areaName': '牡丹江XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3243', '581'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 3,
    'contents': ['index1:3243', 'index2:581'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [125.3301296792, 43.8219013261],
    'areaName': '长春XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2842', '4217'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 4,
    'contents': ['index1:2842', 'index2:4217'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [126.54944, 43.83784],
    'areaName': '吉林XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2387', '1371'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 5,
    'contents': ['index1:2387', 'index2:1371'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.2854, 31.92005],
    'areaName': '江阴XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1963', '4376'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 6,
    'contents': ['index1:1963', 'index2:4376'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [123.4631, 41.67718],
    'areaName': '沈阳XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3472', '1377'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 7,
    'contents': ['index1:3472', 'index2:1377'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [122.24469, 43.65247],
    'areaName': '通辽XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2900', '4513'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 8,
    'contents': ['index1:2900', 'index2:4513'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [121.44801, 37.46353],
    'areaName': '烟台XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1900', '1323'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 9,
    'contents': ['index1:1900', 'index2:1323'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.23065, 37.72913],
    'areaName': '乐陵XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1800', '4908'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 10,
    'contents': ['index1:1800', 'index2:4908'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [113.62493, 34.74725],
    'areaName': '郑州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1700', '2045'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 11,
    'contents': ['index1:1700', 'index2:2045'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [112.12255, 32.009],
    'areaName': '襄阳XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1300', '3640'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 12,
    'contents': ['index1:1300', 'index2:3640'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [106.55073, 29.56471],
    'areaName': '重庆XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2100', '713'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 13,
    'contents': ['index1:2100', 'index2:713'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [100.26764, 25.60648],
    'areaName': '大理XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2000', '3727'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 14,
    'contents': ['index1:2000', 'index2:3727'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [99.16181, 25.11205],
    'areaName': '保山XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2300', '2629'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 15,
    'contents': ['index1:2300', 'index2:2629'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.28577, 34.2044],
    'areaName': '徐州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1800', '865'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 16,
    'contents': ['index1:1800', 'index2:865'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [119.01595, 33.61016],
    'areaName': '淮安盱眙XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['1400', '4158'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 17,
    'contents': ['index1:1400', 'index2:4158'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.15515, 30.27415],
    'areaName': '杭州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['3500', '1322'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 18,
    'contents': ['index1:3500', 'index2:1322'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.65518, 27.77838],
    'areaName': '瑞安XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2300', '3194'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 19,
    'contents': ['index1:2300', 'index2:3194'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [120.69939, 27.99492],
    'areaName': '温州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2302', '2079'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 20,
    'contents': ['index1:2302', 'index2:2079'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }, {
    'lngLat': [117.64725, 24.51347],
    'areaName': '漳州XXX国际广场',
    'description': '',
    'seriesName': ['index1', 'index2'],
    'value': ['2303', '2170'],
    'zoom': 11,
    'pitch': 45,
    'size': 2.5,
    'showCard': true,
    'fixed': true,
    'type': 'pillar',
    'opacity': 1,
    'index': 21,
    'contents': ['index1:2303', 'index2:2170'],
    'fontFamily': 'Microsoft YaHei, sans-serif'
  }],
  'autoLink': {},
  'container': 'map',
  'pitch': 60,
  'interactive': false,
  'trackResize': false
};

const CHART15570 = {
  "trialLicenseWater": "正在试用功能——扩展图表",
  "hyperLink": {},
  "refreshTime": 0,
  "emptyDataTip": {
    "emptyDataImage": { "src": "/webroot/decision/view/report?op=fr_attach&cmd=ah_image&id=EMPTY_CHART_IMAGE_ID_PRE", "width": 505, "height": 465, "auto": true },
    "enabled": true, "content": [{ "style": { "fontSize": "24px", "fontFamily": "PingFangSC-Regular,Microsoft Yahei", "color": "#979797" } }]
  }, "language": "en_US",
  "style": {
    "version": 8, "sources": { "image-tiles": { "type": "raster", "tiles": ["https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"], "tileSize": 256 } },
    "layers": [{ "id": "simple-tiles", "type": "raster", "source": "image-tiles", "minzoom": 0, "maxzoom": 22 }]
  },
  "zoom": 11, "playZoom": 11, "interval": 100000,
  "title": {
    "useHtml": true,
    "text": "经纬度、区域名、说明信息一致时才算通一条数据",
    "style": { "fontFamily": "楷体", "fontSize": "12px", "color": "rgba(255,255,255,1.0)", "fontWeight": "bold", "fontStyle": "italic", "lineHeight": "normal", "FONT_SCALE": 1, "fill": "rgba(255,255,255,1.0)" },
    "align": "left", "borderRadius": 0, "opacity": 100
  },
  "border": { "borderColor": "rgba(0,0,0,1.0)", "borderWidth": 0, "borderRadius": 0 },
  "type": "pillar", "size": 5, "opacity": 1, "tooltip": { "areaName": "", "seriesName": "", "value": "", "description": "", "showCard": true, "fixed": true },
  "center": ["121.45", "45.01"],
  "locations": [
    // { "lngLat": [121.45, 45.01], "areaName": "A", "description": "哈哈哈哈", "seriesName": ["销售额"], "value": ["1600000000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 1, "contents": ["销售额:1600000000"], "fontFamily": "Microsoft YaHei, sans-serif" },
    // { "lngLat": [121.45, 45.01], "areaName": "A", "description": "一样一样", "seriesName": ["利润额"], "value": ["160000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 2, "contents": ["利润额:160000"], "fontFamily": "Microsoft YaHei, sans-serif" },
    { "lngLat": [130.45, 43.1], "areaName": "B", "description": "哈哈哈哈", "seriesName": ["销售额"], "value": ["17000000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 3, "contents": ["销售额:17000000"], "fontFamily": "Microsoft YaHei, sans-serif" },
    { "lngLat": [130.45, 43.1], "areaName": "B", "description": "呀呀呀呀呀呀", "seriesName": ["利润额"], "value": ["1800000000000000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 4, "contents": ["利润额:1800000000000000"], "fontFamily": "Microsoft YaHei, sans-serif" },
    { "lngLat": [124.45, 42.01], "areaName": "C", "description": "哈哈哈哈哈", "seriesName": ["销售额"], "value": ["190000000000000000000000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 5, "contents": ["销售额:190000000000000000000000"], "fontFamily": "Microsoft YaHei, sans-serif" },
    { "lngLat": [124.45, 42.01], "areaName": "C", "description": "呀呀呀呀呀呀", "seriesName": ["利润额"], "value": ["200000000000000000"], "zoom": 11, "pitch": 45, "size": 2.5, "showCard": true, "fixed": true, "type": "pillar", "opacity": 1, "index": 6, "contents": ["利润额:200000000000000000"], "fontFamily": "Microsoft YaHei, sans-serif" }
  ], "autoLink": {},
  "container": 'map',
  "pitch": 60, "interactive": false,
  "trackResize": false
};

function main () {
  SlideshowMap.setAccessToken(config.accessToken);

  const getOpt = (opt) => JSON.parse(JSON.stringify(opt));

  let slideshowMap = new SlideshowMap(getOpt(opt1));
  window._slideshowMap = slideshowMap;

  // window._refresh = () => {
  //   opt6.locations.reverse();
  //   var option = getOpt(opt6);
  //   // delete option.container;
  //   // slideshowMap.dispose();
  //   // slideshowMap = new SlideshowMap(option);
  //   slideshowMap.refresh(option);
  // }

  // setInterval(() => {
  //   _refresh();
  // }, 5000);

  // slideshowMap.on('exitBegin', function (e) {
  //   console.log('exitBegin', e, e.nextItem);
  // });
  // slideshowMap.on('exitEnd', function (e, data) {
  //   console.log('exitEnd', e, e.nextItem);
  // });
  //
  // setTimeout(() => {
  //   slideshowMap.refresh(opt1);
  // }, 3000);
}

main();
