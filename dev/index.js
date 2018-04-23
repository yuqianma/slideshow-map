import * as THREE from '../src/three';
import SlideshowMap from '../src/index';
import mapboxgl from 'mapbox-gl';

const slideshowMap = new SlideshowMap({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [118.78, 32.04],
  zoom: 15.95,
  pitch: 60,
  bearing: -60,
  // heading: 41,
  hash: true
});

// slideshowMap.map.on('load', () => {
// });

// slideshowMap.map.addControl(new mapboxgl.ScaleControl({
//   unit: 'metric'
// }));

function init () {
  const geometry = new THREE.BoxGeometry(200, 200, 400, 1, 1, 1);
  geometry.translate(0, 0, geometry.parameters.depth / 2);
  const blueMaterial = new THREE.LineBasicMaterial({
    // color: 0x156289,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });

  const cube = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), blueMaterial);
  cube.userData.name = 'Blue cube';
  slideshowMap.threebox.addAtCoordinate(cube, [118.78, 32.04, 0], {preScale: 1});
}

init();

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
