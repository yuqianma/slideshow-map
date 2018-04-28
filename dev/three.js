// import * as three from 'three';
import '../src/three';
import OrbitControls from 'three-orbitcontrols';

var scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x000000, 300, 800);
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

var gridHelper = new THREE.GridHelper(1000, 10);
scene.add(gridHelper);

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);
// lights[3] = new THREE.PointLight(0xffffff, 2, 0);
lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);
// lights[3].position.set(0, 2, 2);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);
// scene.add(lights[3]);

lights.map(l => {
  var pointLightHelper = new THREE.PointLightHelper( l, 1 );
  scene.add( pointLightHelper );
});

// var spotLight = new THREE.SpotLight( 0xffffff );
// // spotLight.decay = 1;
// spotLight.angle = 0.1;
// spotLight.intensity = 2;
// spotLight.penumbra = 0.5;
// spotLight.distance = 40;
// spotLight.position.set( 0, 10, 10 );
// scene.add( spotLight );
//
// var spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );

var axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);


function segmentBox () {
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

// generateGeometry();

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
}


function loadBlender () {
  // var loader = new THREE.JSONLoader();
  // loader.load('./dev/circle_rotate.json', function(geometry, material) {
  //   mesh = new THREE.Mesh(geometry, material);
  //   scene.add(mesh);
  // });

  // var loader = new THREE.ObjectLoader();
  //
  // loader.load(
  //   // resource URL
  //   "./dev/node_bloom_scene.json",
  //
  //   // onLoad callback
  //   // Here the loaded data is assumed to be an object
  //   function ( obj ) {
  //     // Add the loaded object to the scene
  //     scene.add( obj );
  //   },
  //
  //   // onProgress callback
  //   function ( xhr ) {
  //     console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  //   },
  //
  //   // onError callback
  //   function ( err ) {
  //     console.error( 'An error happened' );
  //   }
  // );
}


function fatLine () {

  const box = new THREE.BoxGeometry(20, 20, 20);
  const wire = new THREE.WireframeGeometry(box);

  var geometry = new THREE.LineGeometry();
  geometry.setPositions( wire.attributes.position.array );
  geometry.setColors( new THREE.Color('#fff') );

  const matLine = new THREE.LineMaterial( {

    color: 0xffffff,
    linewidth: 0.002, // in pixels
    // vertexColors: THREE.VertexColors,
    //resolution:  // to be set by renderer, eventually
    dashed: false

  } );

  const line = new THREE.Line2( geometry, matLine );
  // line.computeLineDistances();
  // line.scale.set( 1, 1, 1 );
  scene.add( line );
}

function drawShapePath () {
  var x = 0, y = 0;

  var heartShape = new THREE.Shape();

  heartShape.moveTo( x + 5, y + 5 );
  heartShape.lineTo( 20, 20 );
  heartShape.lineTo( 40, 40 );
  heartShape.lineTo( 5, 5 );
  // heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );

  var geometry = new THREE.ShapeGeometry( heartShape );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var mesh = new THREE.Line( geometry, material ) ;
  scene.add( mesh );

}

function glow () {
  const box = new THREE.BoxGeometry(2, 2, 2);
  const mat = new THREE.MeshPhongMaterial({ color: 0x00bbdd });

  // const mat = new THREE.ShaderMaterial( {
  //
  //   uniforms: {
  //     amplitude: { value: 1.0 },
  //     color:     { value: new THREE.Color( 0xffffff ) },
  //   },
  //   vertexShader:   document.getElementById( 'vertexshader' ).textContent,
  //   fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
  //
  //   blending:       THREE.AdditiveBlending,
  //   depthTest:      false,
  //   transparent:    true
  //
  // });

  const mesh = new THREE.Mesh(box, mat);

  scene.add(mesh);
}

glow();

var render = function () {
  requestAnimationFrame(render);
  // if (!options.fixed) {
    // mesh.rotation.x += Math.PI * 30 / 180;
    // mesh.rotation.y += 0.005;
    // mesh.rotation.z += 0.005;
  // }
  renderer.render(scene, camera);
};

render();
