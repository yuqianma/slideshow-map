/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';
import { Dom } from '../Utils/Svg';

export default class EffectGlobal extends Component {
  create (props) {
    this.video = new Dom('video', {
      autoplay: true,
      loop: true,
      crossOrigin: 'anonymous',
      'webkit-playsinline': true,
      'playsinline': true,
    });
    this.video.style({
      display: 'none',
    });

    this.source = new Dom('source', {
      src: props.src
    });

    this.video.append(this.source);
    // document.body.appendChild(this.video.node);

    const texture = new THREE.VideoTexture( this.video.node );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    const mat = new THREE.MeshBasicMaterial({
      // color: 0xffffff,
      opacity: 0.5,
      transparent: true,
      map: texture
    });

    const geometry = new THREE.PlaneGeometry( 200, 220, 1 );
    // geometry.translate(200 / 2, 220 / 2, 0);
    geometry.scale(0.3, 0.3, 1);

    const mesh = new THREE.Mesh( geometry, mat );

    mesh.visible = false;

    return mesh;
  }

  update (frameSize) {
    // console.log(frameSize);
    // mesh has been translated in `animateComponents`
    this.obj.geometry.translate(frameSize.x, frameSize.y, 0);

    this.video.node.currentTime = 0;
    this.obj.visible = true;
    // this.video.node.play();
  }

  leave () {
    // todo, fade
    // this.video.node.pause();
  }
}
