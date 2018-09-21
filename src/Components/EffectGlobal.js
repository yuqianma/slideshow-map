/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';
import { Dom } from '../Utils/Svg';
import { timeline } from 'popmotion';
import { SPF } from '../constants';

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

    this.videoMesh = new THREE.Mesh( geometry, mat );

    this.wrapper = new THREE.Group();
    this.wrapper.add(this.videoMesh);

    this.obj = new THREE.Group();
    this.obj.add(this.wrapper);

    this.obj.visible = false;

    return this.obj;
  }

  update (frameSize) {
    // console.log(frameSize);
    // mesh has been translated in `animateComponents`
    const s = frameSize.a / 200 * 3;
    this.videoMesh.scale.set(s, s, 1);
    this.wrapper.position.set(frameSize.x - frameSize.a * 0.7, frameSize.y + frameSize.b * 0.3, 0);


    this.video.node.currentTime = 0;
    this.obj.visible = true;
    this.videoMesh.material.opacity = 0;

    this._animate = timeline([
      45 * SPF,
      { track: 'v', from: 0, to: 1, duration: 60 * SPF}
    ]).start( ({v}) => {
      this.videoMesh.material.opacity = v;
    });
    // this.video.node.play();
  }

  leave () {
    this._animate.reverse();
    this._animate.resume();
  }
}
