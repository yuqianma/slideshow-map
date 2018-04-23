/**
 * Created by Jeffrey on 2018/4/20.
 */

import * as THREE from 'three';
import { makePerspectiveMatrix } from './utils';
import { WORLD_SIZE } from "./constants";

export default class CameraSync {

  constructor(map, camera, world) {
    this.map = map;
    this.camera = camera;
    this.active = true;

    this.camera.matrixAutoUpdate = false;   // We're in charge of the camera now!

    // Postion and configure the world group so we can scale it appropriately when the camera zooms
    this.world = world || new THREE.Group();
    this.world.position.x = this.world.position.y = WORLD_SIZE / 2;
    this.world.matrixAutoUpdate = false;

    // Listen for move events from the map and update the Three.js camera
    this.map.on('move', () => {
      this.updateCamera();
    });
    this.updateCamera();
  }

  _updateCamera(ev) {
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

    this.camera.projectionMatrix = makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);


    const cameraWorldMatrix = new THREE.Matrix4();
    const cameraTranslateZ = new THREE.Matrix4().makeTranslation(0,0,cameraToCenterDistance);
    const cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
    const cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);

    // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
    // If this is applied directly to the projection matrix, it will work OK but break raycasting
    cameraWorldMatrix
      .premultiply(cameraTranslateZ)
      .premultiply(cameraRotateX)
      .premultiply(cameraRotateZ);

    this.camera.matrixWorld.copy(cameraWorldMatrix);


    const zoomPow =  this.map.transform.scale;
    // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
    const scale = new THREE.Matrix4;
    const translateCenter = new THREE.Matrix4;
    const translateMap = new THREE.Matrix4;
    const rotateMap = new THREE.Matrix4;

    scale.makeScale(zoomPow, zoomPow , zoomPow );
    translateCenter.makeTranslation(WORLD_SIZE/2, -WORLD_SIZE / 2, 0);
    translateMap.makeTranslation(-this.map.transform.x, this.map.transform.y , 0);
    rotateMap.makeRotationZ(Math.PI);
    this.world.matrix = new THREE.Matrix4;
    this.world.matrix
      .premultiply(rotateMap)
      .premultiply(translateCenter)
      .premultiply(scale)
      .premultiply(translateMap)
  }

  // https://github.com/peterqliu/threebox/blob/b25bd6614a16b6dd92aa95984df84d6a40bf9c30/src/Camera/CameraSync.js
  updateCamera(ev) {
    if (!this.camera) {
      console.warn('nocamera');
      return;
    }

    const transform = this.map.transform;

    // Build a projection matrix, paralleling the code found in Mapbox GL JS
    // https://github.com/mapbox/mapbox-gl-js/blob/03680eb57489cf442f8c538141ea27c73d98d532/src/geo/transform.js#L502
    const fov = transform._fov;
    const cameraToCenterDistance = transform.cameraToCenterDistance;
    const halfFov = fov / 2;
    const groundAngle = Math.PI / 2 + transform._pitch;
    const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

    // Calculate z distance of the farthest fragment that should be rendered.
    const furthestDistance = Math.cos(Math.PI / 2 - transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;

    // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
    const farZ = furthestDistance * 1.01;

    this.camera.projectionMatrix = makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);

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
    translateCenter.makeTranslation(WORLD_SIZE / 2, -WORLD_SIZE / 2, 0);
    translateMap.makeTranslation(-transform.x, transform.y, 0);
    rotateMap.makeRotationZ(Math.PI);
    this.world.matrix = new THREE.Matrix4;
    this.world.matrix
      .premultiply(rotateMap)
      .premultiply(translateCenter)
      .premultiply(scale)
      .premultiply(translateMap)

  }
}
