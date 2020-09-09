// import * as THREE from '../three';
import * as utils from '../Utils/Utils';
import * as ThreeboxConstants from '../constants';

function CameraSync(map, camera, world, plane, plane2) {
  this.map = map;
  this.camera = camera;
  this.active = true;

  this.camera.matrixAutoUpdate = false;   // We're in charge of the camera now!

  // Postion and configure the world group so we can scale it appropriately when the camera zooms
  this.world = world || new THREE.Group();
  this.world.position.x = this.world.position.y = ThreeboxConstants.WORLD_SIZE / 2;
  this.world.matrixAutoUpdate = false;

  this.plane = plane || new THREE.Group();
  this.plane.position.x = this.plane.position.y = ThreeboxConstants.WORLD_SIZE / 2;
  this.plane.matrixAutoUpdate = false;

  this.plane2 = plane2 || new THREE.Group();
  this.plane2.position.x = this.plane2.position.y = ThreeboxConstants.WORLD_SIZE / 2;
  this.plane2.matrixAutoUpdate = false;

  // Listen for move events from the map and update the Three.js camera
  const _this = this;
  this.map.on('move', function () {
    // console.log('update');
    _this.updateCamera();
  });
  this.updateCamera();
}

CameraSync.prototype = {
  updateCamera: function (ev) {
    if (!this.camera) {
      console.log('nocamera')
      return;
    }

    console.log(this.map.transform);

    // Build a projection matrix, paralleling the code found in Mapbox GL JS
    const fov = 0.6435011087932844;
    const cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height;
    const halfFov = fov / 2;
    const groundAngle = Math.PI / 2 + this.map.transform._pitch;
    const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

    // Calculate z distance of the farthest fragment that should be rendered.
    const furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;

    // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
    const farZ = furthestDistance * 1.01;

    this.camera.projectionMatrix = utils.makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);


    const cameraWorldMatrix = new THREE.Matrix4();
    const cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, cameraToCenterDistance);
    const cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
    const cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);

    // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
    // If this is applied directly to the projection matrix, it will work OK but break raycasting
    cameraWorldMatrix
      .premultiply(cameraTranslateZ)
      .premultiply(cameraRotateX)
      .premultiply(cameraRotateZ);

    this.camera.matrixWorld.copy(cameraWorldMatrix);



    const zoomPow = this.map.transform.scale;
    // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
    const scale = new THREE.Matrix4;
    const translateCenter = new THREE.Matrix4;
    const translateMap = new THREE.Matrix4;
    const rotateMap = new THREE.Matrix4;

    scale.makeScale(zoomPow, zoomPow, zoomPow);
    translateCenter.makeTranslation(ThreeboxConstants.WORLD_SIZE / 2, -ThreeboxConstants.WORLD_SIZE / 2, 0);
    // https://github.com/mapbox/mapbox-gl-js/commit/cedefd66f6519f20b9f73a1389e02afa868ca39f#diff-5dddfe9d7b5b4413ee54284bc1f7966d
    // transform.x -> transform.point.x
    translateMap.makeTranslation(-this.map.transform.point.x, this.map.transform.point.y, 0);
    rotateMap.makeRotationZ(Math.PI);
    this.world.matrix = new THREE.Matrix4;
    this.world.matrix
      .premultiply(rotateMap)
      .premultiply(translateCenter)
      .premultiply(scale)
      .premultiply(translateMap);

    // ... I'm a bit confused by matrix & worldMatrix...
    const planeMatrix = new THREE.Matrix4;
    // const _cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, 0);
    const _cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
    const _cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);
    planeMatrix
      // .premultiply(_cameraTranslateZ)
      .premultiply(_cameraRotateX)
      .premultiply(_cameraRotateZ);

    // utils.prettyPrintMatrix(this.plane.matrix.elements);
    // utils.prettyPrintMatrix(planeMatrix.elements);

    this.plane.matrix.copy(planeMatrix);
    this.plane2.matrix.copy(planeMatrix);


    // utils.prettyPrintMatrix(cameraWorldMatrix.elements);
    // utils.prettyPrintMatrix(this.camera.matrixWorldInverse.elements);
    // utils.prettyPrintMatrix(this.camera.projectionMatrix.elements);
  }

}

export default CameraSync
