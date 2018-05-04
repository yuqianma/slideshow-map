// import * as THREE from './three';
import * as ThreeboxConstants from './constants'
import * as utils from './Utils/Utils';
import { Defs } from './Utils/Svg';
import CameraSync from './Camera/CameraSync';
import SymbolLayer3D from './Layers/SymbolLayer3D';
import { EffectComposer, BloomPass, RenderPass, KernelSize } from 'postprocessing';


//var AnimationManager = require("./Animation/AnimationManager.js");

function Threebox(map) {
  this.map = map;

  // Set up a THREE.js scene
  this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  this.renderer.setPixelRatio(window.devicePixelRatio || 1);
  this.renderer.setSize(this.map.transform.width, this.map.transform.height);
  this.renderer.shadowMap.enabled = true;

  this.map._container.appendChild(this.renderer.domElement);
  this.renderer.domElement.style["position"] = "absolute";
  this.renderer.domElement.style["pointer-events"] = "none";
  this.renderer.domElement.style["z-index"] = 1000;
  //this.renderer.domElement.style["transform"] = "scale(1,-1)";

  this.svgRenderer = new THREE.SVGRenderer();
  this.svgRenderer.setSize(this.map.transform.width, this.map.transform.height);
  this.svgRenderer.setClearColor(0x000000, 0);
  this.map._container.appendChild(this.svgRenderer.domElement);
  this.svgRenderer.domElement.style["position"] = "absolute";
  this.svgRenderer.domElement.style["pointer-events"] = "none";
  this.svgRenderer.domElement.style["z-index"] = 1001;

  var _this = this;
  this.map.on("resize", function () {
    _this.renderer.setSize(_this.map.transform.width, _this.map.transform.height);
    _this.svgRenderer.setSize(_this.map.transform.width, _this.map.transform.height);
  });


  this.scene = new THREE.Scene();
  this.svgScene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(
    26,
    this.map.transform.width / this.map.transform.height,
    0.000001,
    5000000000
  );
  this.layers = [];
  if (__DEV__) {
    window.camera = this.camera;
    window.threebox = this;
    var axesHelper = new THREE.AxesHelper(10000);
    this.scene.add(axesHelper);
  }

  // The CameraSync object will keep the Mapbox and THREE.js camera movements in sync.
  // It requires a world group to scale as we zoom in. Rotation is handled in the camera's
  // projection matrix itself (as is field of view and near/far clipping)
  // It automatically registers to listen for move events on the map so we don't need to do that here
  this.world = new THREE.Group();
  this.scene.add(this.world);

  this.plane = new THREE.Group();
  this.svgScene.add(this.plane);

  this.defs = new Defs();
  this.svgScene.add(this.defs);

  this.cameraSynchronizer = new CameraSync(this.map, this.camera, this.world, this.plane);

  this.clock = new THREE.Clock();
  // this.installPass();
  //this.animationManager = new AnimationManager();
  this.update();
}

Threebox.prototype = {
  SymbolLayer3D: SymbolLayer3D,

  update: function (timestamp) {
    // Update any animations
    //this.animationManager.update(timestamp);

    // Render the scene
    this.renderer.render(this.scene, this.camera);
    this.svgRenderer.render(this.svgScene, this.camera);

    // Run this again next frame
    this._updateid = requestAnimationFrame((timestamp) => {
      this.update(timestamp);
    });

    // this.composer.render(this.clock.getDelta());
  },

  installPass () {
    const composer = this.composer = new EffectComposer(this.renderer, {
      stencilBuffer: true,
      depthTexture: true
    });

    composer.addPass(new RenderPass(this.scene, this.camera));

    const pass = new BloomPass({
      resolutionScale: 0.37,
      intensity: 0.64,
      distinction: 1.3,
      kernelSize: 5,
    });
    pass.combineMaterial.setScreenModeEnabled(false);
    pass.renderToScreen = true;
    composer.addPass(pass);

    this.bloomPass = pass;

    this.registerOptions();
  },

  registerOptions () {

    const menu = new dat.GUI();

    const composer = this.composer;
    const pass = this.bloomPass;

    const params = {
      "resolution": pass.resolutionScale,
      "kernel size": pass.kernelSize,
      "intensity": pass.intensity,
      "distinction": pass.distinction,
      "blend": true,
      "blend mode": "screen"
    };

    menu.add(params, "resolution").min(0.0).max(1.0).step(0.01).onChange(function() {

      pass.resolutionScale = params.resolution;
      composer.setSize();

    });

    menu.add(params, "kernel size").min(KernelSize.VERY_SMALL).max(KernelSize.HUGE).step(1).onChange(function() {

      pass.kernelSize = params["kernel size"];

    });

    menu.add(params, "intensity").min(0.0).max(3.0).step(0.01).onChange(function() {

      pass.intensity = params.intensity;

    });

    const folder = menu.addFolder("Luminance");

    folder.add(params, "distinction").min(1.0).max(10.0).step(0.1).onChange(function() {

      pass.distinction = params.distinction;

    });

    folder.open();

    menu.add(params, "blend").onChange(function() {

      pass.combineMaterial.uniforms.opacity1.value = params.blend ? 1.0 : 0.0;

    });

    menu.add(pass, "dithering");

    menu.add(params, "blend mode", ["add", "screen"]).onChange(function() {

      pass.combineMaterial.setScreenModeEnabled((params["blend mode"] !== "add"));

    });

  },

  projectToWorld: function (coords) {
    // Spherical mercator forward projection, re-scaling to WORLD_SIZE
    var projected = [
      -ThreeboxConstants.MERCATOR_A * coords[0] * ThreeboxConstants.DEG2RAD * ThreeboxConstants.PROJECTION_WORLD_SIZE,
      -ThreeboxConstants.MERCATOR_A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * coords[1] * ThreeboxConstants.DEG2RAD))) * ThreeboxConstants.PROJECTION_WORLD_SIZE
    ];

    var pixelsPerMeter = this.projectedUnitsPerMeter(coords[1]);

    //z dimension
    var height = coords[2] || 0;
    projected.push(height * pixelsPerMeter);

    var result = new THREE.Vector3(projected[0], projected[1], projected[2]);

    return result;
  },
  projectedUnitsPerMeter: function (latitude) {
    return Math.abs(ThreeboxConstants.WORLD_SIZE * (1 / Math.cos(latitude * Math.PI / 180)) / ThreeboxConstants.EARTH_CIRCUMFERENCE);
  },
  _scaleVerticesToMeters: function (centerLatLng, vertices) {
    var pixelsPerMeter = this.projectedUnitsPerMeter(centerLatLng[1]);
    var centerProjected = this.projectToWorld(centerLatLng);

    for (var i = 0; i < vertices.length; i++) {
      vertices[i].multiplyScalar(pixelsPerMeter);
    }

    return vertices;
  },
  projectToScreen: function (coords) {
    console.log("WARNING: Projecting to screen coordinates is not yet implemented");
  },
  unprojectFromScreen: function (pixel) {
    console.log("WARNING: unproject is not yet implemented");
  },
  unprojectFromWorld: function (pixel) {

    var unprojected = [
      -pixel.x / (ThreeboxConstants.MERCATOR_A * ThreeboxConstants.DEG2RAD * ThreeboxConstants.PROJECTION_WORLD_SIZE),
      2 * (Math.atan(Math.exp(pixel.y / (ThreeboxConstants.PROJECTION_WORLD_SIZE * (-ThreeboxConstants.MERCATOR_A)))) - Math.PI / 4) / ThreeboxConstants.DEG2RAD
    ];

    var pixelsPerMeter = this.projectedUnitsPerMeter(unprojected[1]);

    //z dimension
    var height = pixel.z || 0;
    unprojected.push(height / pixelsPerMeter);

    return unprojected;
  },

  _flipMaterialSides: function (obj) {

  },

  addAtCoordinate: function (obj, lnglat, options) {
    var geoGroup = new THREE.Group();
    geoGroup.userData.isGeoGroup = true;
    geoGroup.add(obj);
    this._flipMaterialSides(obj);
    this.world.add(geoGroup);
    this.moveToCoordinate(obj, lnglat, options);

    // Bestow this mesh with animation superpowers and keeps track of its movements in the global animation queue
    //this.animationManager.enroll(obj);

    return obj;
  },
  moveToCoordinate: function (obj, lnglat, options) {
    /** Place the given object on the map, centered around the provided longitude and latitude
     The object's internal coordinates are assumed to be in meter-offset format, meaning
     1 unit represents 1 meter distance away from the provided coordinate.
     */

    if (options === undefined) options = {};
    if (options.preScale === undefined) options.preScale = 1.0;
    if (options.scaleToLatitude === undefined || obj.userData.scaleToLatitude) options.scaleToLatitude = true;

    obj.userData.scaleToLatitude = options.scaleToLatitude;

    if (typeof options.preScale === 'number') options.preScale = new THREE.Vector3(options.preScale, options.preScale, options.preScale);
    else if (options.preScale.constructor === Array && options.preScale.length === 3) options.preScale = new THREE.Vector3(options.preScale[0], options.preScale[1], options.preScale[2]);
    else if (options.preScale.constructor !== THREE.Vector3) {
      console.warn("Invalid preScale value: number, Array with length 3, or THREE.Vector3 expected. Defaulting to [1,1,1]");
      options.preScale = new THREE.Vector3(1, 1, 1);
    }

    var scale = options.preScale;

    // Figure out if this object is a geoGroup and should be positioned and scaled directly, or if its parent
    var geoGroup;
    if (obj.userData.isGeoGroup) geoGroup = obj;
    else if (obj.parent && obj.parent.userData.isGeoGroup) geoGroup = obj.parent;
    else return console.error("Cannot set geographic coordinates of object that does not have an associated GeoGroup. Object must be added to scene with 'addAtCoordinate()'.")

    if (options.scaleToLatitude) {
      // Scale the model so that its units are interpreted as meters at the given latitude
      var pixelsPerMeter = this.projectedUnitsPerMeter(lnglat[1]);
      scale.multiplyScalar(pixelsPerMeter);
    }

    geoGroup.scale.copy(scale);

    geoGroup.position.copy(this.projectToWorld(lnglat));
    obj.coordinates = lnglat;

    return obj;
  },

  addGeoreferencedMesh: function (mesh, options) {
    /* Place the mesh on the map, assuming its internal (x,y) coordinates are already in (longitude, latitude) format
        TODO: write this
    */

  },

  addSymbolLayer: function (options) {
    const layer = new SymbolLayer3D(this, options);
    this.layers.push(layer);

    return layer;
  },

  getDataLayer: function (id) {
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layer.id === id) return layer;
    }
  },

  remove: function (obj) {
    this.world.remove(obj);
  },

  setupDefaultLights: function () {
    this.scene.add(new THREE.AmbientLight(0xCCCCCC));

    var sunlight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunlight.position.set(0, 800, 1000);
    sunlight.matrixWorldNeedsUpdate = true;
    this.world.add(sunlight);
    //this.world.add(sunlight.target);

    // var lights = [];
    // lights[ 0 ] = new THREE.PointLight( 0x999999, 1, 0 );
    // lights[ 1 ] = new THREE.PointLight( 0x999999, 1, 0 );
    // lights[ 2 ] = new THREE.PointLight( 0x999999, 0.2, 0 );

    // lights[ 0 ].position.set( 0, 200, 1000 );
    // lights[ 1 ].position.set( 100, 200, 1000 );
    // lights[ 2 ].position.set( -100, -200, 0 );

    // //scene.add( lights[ 0 ] );
    // this.scene.add( lights[ 1 ] );
    // this.scene.add( lights[ 2 ] );

  }
}

export default Threebox
