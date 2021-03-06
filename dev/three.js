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

var geometry = new THREE.PlaneGeometry( 5, 10, 10 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );
// scene.add( plane );


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

function extrude () {
  var length = 10, width = 10;

  var shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, width );
  shape.lineTo( length, width );
  shape.lineTo( length, 0 );
  shape.lineTo( 0, 0 );

  var extrudeSettings = {
    steps: 2,
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 1
  };

  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var mesh = new THREE.Mesh( geometry, material ) ;
  scene.add( mesh );
}


function video () {
  var video = document.createElement('video');
  video.loop = true;
  video.crossOrigin = 'anonymous';

  var source = document.createElement('source');
  source.src = './dev/global.webm';

  video.muted = true;

  video.append(source);


  // document.body.appendChild(video);

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.border = '1px solid #0b9';
  canvas.width = 200;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');

  video.addEventListener('play', function () {
    console.log('start');
    var $this = this; //cache
    (function loop() {
      if (!$this.paused && !$this.ended) {
        ctx.clearRect(0, 0, 256, 256);
        ctx.drawImage($this, 0, 0);
        setTimeout(loop, 1000 / 30); // drawing at 30fps
      } else {
        console.log('stop');
      }
    })();
  }, 0);

  const texture = new THREE.Texture( canvas );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBAFormat;

  texture.onUpdate = function (v) {
    // console.log(v);
  };

  const mat = new THREE.MeshBasicMaterial({
    // color: 0xffffff,
    opacity: 0.5,
    transparent: true,
    map: texture
  });

  function frame () {
    texture.needsUpdate = true;
    requestAnimationFrame(frame);
  }
  frame();

  const geometry = new THREE.PlaneGeometry( 20, 22, 1 );

  const videoMesh = new THREE.Mesh( geometry, mat );

  scene.add(videoMesh);

  video.play();

  window.video = video;
}

video();

// extrude();

var render = function () {
  requestAnimationFrame(render);
  // if (!options.fixed) {
    // mesh.rotation.x += Math.PI * 30 / 180;
    // mesh.rotation.y += 0.005;
    // mesh.rotation.z += 0.005;
  // }
  renderer.render(scene, camera);

  // plane.lookAt( camera.position );
  // plane.quaternion.copy(camera.quaternion)
};

render();
