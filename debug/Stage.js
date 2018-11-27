import { Defs } from '../src/Utils/Svg';

export class SvgStage {
  constructor ({ root, width, height }) {
    this.svgRenderer = new THREE.SVGRenderer();
    this.svgRenderer.setSize(width, height);
    this.svgRenderer.setClearColor(0x000000, 0);
    root.appendChild(this.svgRenderer.domElement);
    this.svgRenderer.domElement.style["position"] = "absolute";
    this.svgRenderer.domElement.style["pointer-events"] = "none";
    this.svgRenderer.domElement.style["z-index"] = 1001;

    this.svgScene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

    this.svgScene.add(this.camera);

    this.plane = new THREE.Group();
    this.svgScene.add(this.plane);

    this.defs = new Defs();
    this.svgScene.add(this.defs);
    this.defs.position.set(0, 0, 1);

    this.update();
  }

  update () {
    this.svgRenderer.render(this.svgScene, this.camera);

    this._updateid = requestAnimationFrame((timestamp) => {
      this.update(timestamp);
    });
  }
}