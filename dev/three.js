import * as three from 'three';
import OrbitControls from 'three-orbitcontrols';

const THREE = Object.assign(three, {OrbitControls});

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 300, 800);
var camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.x = 10;
camera.position.y = 20;
camera.position.z = 30;
camera.lookAt(new THREE.Vector3(0, 0, 0));

console.log(camera);

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth - 2, window.innerHeight - 4);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

var orbit = new OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;

var gridHelper = new THREE.GridHelper(1000, 100);
scene.add(gridHelper);

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

var axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

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

var options = {
  fixed: false,
};

scene.add(mesh);

var data = {
  width: 5,
  height: 10,
  depth: 5,
  widthSegments: 1,
  heightSegments: 1,
  depthSegments: 1
};

function generateGeometry() {

  updateGroupGeometry(mesh,
    new THREE.BoxGeometry(
      data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments
    )
  );

}

generateGeometry();

function updateGroupGeometry(mesh, geometry) {

  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new THREE.WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;

  // these do not update nicely together if shared

}

function boxs(Num) {
  const mat = new THREE.MeshPhongMaterial();

  let i = -Num / 2;
  while (++i < Num / 2) {
    let j = -Num / 2;
    while (++j < Num / 2) {
      const box = new THREE.BoxGeometry(1, 1, 1);
      box.translate(i * 20, 0, j * 20);
      mesh.add(new THREE.Mesh(box, mat));
    }
  }
}

// boxs(50);


var render = function () {
  requestAnimationFrame(render);
  if (!options.fixed) {
    // mesh.rotation.x += Math.PI * 30 / 180;
    // mesh.rotation.y += 0.005;
    // mesh.rotation.z += 0.005;
  }
  renderer.render(scene, camera);
};

render();