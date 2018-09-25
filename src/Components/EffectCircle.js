/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';
import { Dom } from '../Utils/Svg';

export default class EffectCircle extends Component {
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
      opacity: 0.8,
      transparent: true,
      map: texture
    });

    const geometry = new THREE.PlaneGeometry( 8, 8, 1 );

    return new THREE.Mesh( geometry, mat );
  }

  update ({ boxSize }) {
    this.video.node.currentTime = 0;
    this.video.node.play();

    const s = boxSize.x;

    this.obj.scale.set(s, s, 1);
  }

  leave () {
    // todo, fade
    this.video.node.pause();
    this.video.node.currentTime = 0;
  }
}
