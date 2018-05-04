/**
 * Created by Jeffrey on 2018/4/26.
 */

export default class Component {
  constructor (props) {
    this.props = props || {};

    this.obj = this.create(this.props) || this.obj;
  }

  create () {
    console.error('empty component.create');
  }

  add (component) {
    this.obj.add(component.obj || component);
  }

  remove (component) {
    component.dispose && component.dispose();
    this.obj.remove(component.obj || component);
  }

  dispose () {

  }

  position (x, y, z) {
    this.obj.position.set(x, y, z);
  }

  get visible () {
    return this.obj.visible
  }

  set visible (v) {
    this.obj.visible = v
  }
}
