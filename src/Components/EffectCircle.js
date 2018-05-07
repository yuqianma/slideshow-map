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
    // texture.format = THREE.RGBFormat;

    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      map: texture
    });

    const geometry = new THREE.PlaneGeometry( 1000, 1000, 1 );

    return new THREE.Mesh( geometry, mat );
  }

  update () {
    this.video.node.currentTime = 0;
    // this.video.node.play();
  }

  leave () {
    // todo, fade
    // this.video.node.pause();
  }
}
