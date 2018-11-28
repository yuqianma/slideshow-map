/**
 * Created by Jeffrey on 2018/5/7.
 */

import Component from './Component';
import { timeline } from 'popmotion';
import { SPF } from '../constants';
import { getVideoTexture } from '../Utils/getVideoTexture';

export default class EffectGlobal extends Component {
  create (props) {
    this.texture = getVideoTexture({
      src: props.src || 'dev/global.webm',
      width: 200,
      height: 220
    });

    const mat = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      transparent: true,
      map: this.texture
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

  update (props) {
    super.update(props);
    const frameSize = props;
    const s = frameSize.a / 200 * 2.5;
    this.videoMesh.scale.set(s, s, 1);
    this.wrapper.position.set(frameSize.x - frameSize.a * 0.5, frameSize.y + frameSize.b * 0.3, 0);

    this.obj.visible = false;
  }

  enterAction () {
    return timeline([
      { track: 'v', from: 0, to: 1, duration: 60 * SPF}
    ]);
  }

  beforeEnter () {
    this.texture.video.currentTime = 0;
    // play() is required for auto play
    this.texture.video.play();
    this.obj.visible = true;
    this.videoMesh.material.opacity = 0;
  }

  enter ({ v }) {
    this.videoMesh.material.opacity = v;
  }

  leaveAction () {
    return timeline([
      { track: 'v', from: 1, to: 0, duration: 60 * SPF}
    ]);
  }

  leave (state) {
    this.enter(state);
  }

  afterLeave () {
    this.texture.video.pause();
    this.texture.video.currentTime = 0;
  }
}
