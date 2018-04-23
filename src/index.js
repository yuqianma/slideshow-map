import * as three from 'three';
import OrbitControls from 'three-orbitcontrols';
import mapboxgl from 'mapbox-gl';
import CameraSync from './camera-sync';

window.mapboxgl = mapboxgl;

import { PROJECTION_WORLD_SIZE } from "./constants";

const THREE = Object.assign(three, {OrbitControls});

const overlay = document.querySelector('#overlay');

const width = overlay.clientWidth;
const height = overlay.clientHeight;

const center = [118.78, 32.04];
// const center = [-73.8709, 40.8255];
// const center = [9.850297272205353, -0.0014349818228118253];
// const center = [0, 85.05113];
// const center = [0, 0];

mapboxgl.accessToken = 'pk.eyJ1IjoibWF5cTA0MjIiLCJhIjoiY2phamMwOHV4MjllajMzbnFyeTMwcmZvYiJ9.aFMw4Aws5zY9Y4NwYqFMlQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center,
  zoom: 12,
  pitch: 60,
  bearing: -60,
  maxZoom: 21,
  minZoom: 0,
  hash: true,
});

map.on('load', function () {
  map.addLayer({
    "id": "highlight",
    "type": "fill",
    "source": {
      "type": "vector",
      "url": "mapbox://mapbox.8ibmsn6u"
    },
    "source-layer": "original",
    "paint": {
      "fill-color": "#fd6b50",
      "fill-opacity": 0.25
    },
    "filter": ["==", "borocode", ""]
  });
});

window.map = map;

var scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x000000, 300, 800);
var camera = new THREE.PerspectiveCamera(36, width / height, 1, 2000);
// camera.position.x = 10;
// camera.position.y = 20;
// camera.position.z = 30;
// camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
overlay.appendChild(renderer.domElement);

// var orbit = new OrbitControls( camera, renderer.domElement );
// orbit.enableZoom = false;

var gridHelper = new THREE.GridHelper(2000, 100);
// scene.add(gridHelper);

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);
lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

var axesHelper = new THREE.AxesHelper(2000);
window.axesHelper = axesHelper;
// scene.add(axesHelper);

var group = new THREE.Group();
scene.add(group);

group.add(axesHelper);
// group.add(gridHelper);

var mesh = new THREE.Object3D();

mesh.add(new THREE.LineSegments(
  new THREE.Geometry(),
  new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  })
));
mesh.add(new THREE.Mesh(
  new THREE.Geometry(),
  new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    flatShading: true
  })
));

group.add(mesh);

var options = {
  fixed: false,
};

var data = {
  width: 1e3 * PROJECTION_WORLD_SIZE,
  height: 1e3 * PROJECTION_WORLD_SIZE,
  depth: 5e3 * PROJECTION_WORLD_SIZE,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1
};

function getY (lat) {
  const y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  return (180 - y) * 512 / 360 - 256;
}

mesh.position.set(-center[0] / 360 * 512, getY(center[1]), 0);
window.mesh = mesh;

const cameraSync = new CameraSync(map, camera, group);

function generateGeometry() {

  const box = new THREE.BoxGeometry(
    data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments
  );

  box.translate(0, 0, box.parameters.depth / 2);

  window.box = box;

  // box.position.set();

  updateGroupGeometry(mesh, box);

}

generateGeometry();

function updateGroupGeometry(mesh, geometry) {

  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;

  // these do not update nicely together if shared

}

const render = function () {
  requestAnimationFrame(render);
  if (!options.fixed) {
    // mesh.rotation.x += Math.PI * 30 / 180;
    // mesh.rotation.y += 0.005;
    // mesh.rotation.z += 0.005;
  }
  renderer.render(scene, camera);
};


render();
