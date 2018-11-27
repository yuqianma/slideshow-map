/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';
import { Dom } from '../Utils/Svg';
import { action } from 'popmotion';

export default class EffectCircle extends Component {
  create (props) {
    this.video = new Dom('video', {
      loop: true,
      crossOrigin: 'anonymous',
      'webkit-playsinline': true,
      'playsinline': true,
    });
    this.video.style({
      display: 'none',
    });

    this.video.node.muted = true;

    this.source = new Dom('source', {
      src: props.src || 'dev/circle.webm'
    });

    this.video.append(this.source);
    // document.body.appendChild(this.video.node);

    const texture = new THREE.VideoTexture( this.video.node );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    const mat = new THREE.MeshBasicMaterial({
      opacity: 0.8,
      transparent: true,
      map: texture
    });

    const geometry = new THREE.PlaneGeometry( 8, 8, 1 );

    return new THREE.Mesh( geometry, mat );
  }

  get opacity () {
    return this.obj.material.opacity;
  }

  set opacity (v) {
    this.obj.material.opacity = v;
    return true;
  }

  play () {
    this.video.node.currentTime = 0;
    // play() is required for auto play
    this.video.node.play();
  }

  stop () {
    this.video.node.pause();
  }

  update ({ boxSize }) {

    const s = boxSize.x;

    this.obj.scale.set(s, s, 1);
  }
}
