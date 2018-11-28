/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';

import { getVideoTexture } from '../Utils/getVideoTexture'

export default class EffectCircle extends Component {
  create (props) {
    this.texture = getVideoTexture({
      src: props.src || 'dev/circle.webm',
      width: 600,
      height: 600
    });

    const mat = new THREE.MeshBasicMaterial({
      opacity: 0.8,
      transparent: true,
      map: this.texture
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
    this.texture.video.currentTime = 0;
    // play() is required for auto play
    this.texture.video.play();
  }

  stop () {
    this.texture.video.pause();
  }

  update ({ boxSize }) {

    const s = boxSize.x;

    this.obj.scale.set(s, s, 1);
  }
}
