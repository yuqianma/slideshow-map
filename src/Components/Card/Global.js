/**
 * Created by Jeffrey on 2018/5/8.
 */
import Component from '../Component';
import { Svg, Dom } from '../../Utils/Svg';

export default class Global extends Component {
  create ({ svg }) {

    this.svg = svg;

    this.obj = new Svg('foreignObject');

    this.video = new Dom('video', {
      id: 'global',
      src: 'dev/global.webm',
      autoplay: true,
      loop: true,
      muted: true,
      crossOrigin: 'anonymous',
      'webkit-playsinline': true,
      'playsinline': true,
    });

    this.video.hide();

    this.obj.append(this.video);
  }

  update () {
    const { x, y } = this.svg.viewBox.baseVal;

    this.video.style({
      transform: `translate(${- x - 80}px, ${- y - 50}px)`,
      width: `100px`,
      height: `100px`
    });

    this.video.show();

    // this.video.node.currentTime = 0;
    // this.video.node.play();
  }

  leave () {
    this.video.hide();
  }
}
