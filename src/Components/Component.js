/**
 * Created by Jeffrey on 2018/4/26.
 */

export default class Component {
  constructor (props) {
    this.props = props || {};

    this.obj = this.create(this.props);
  }

  create () {
    console.error('empty component.create');
  }

  get visible () {
    return this.obj.visible
  }

  set visible (v) {
    this.obj.visible = v
  }
}
