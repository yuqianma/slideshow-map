/**
 * Created by Jeffrey on 2018/4/26.
 */

export default class Component {
  constructor (props) {
    this.props = props || {};

    this.children = [];

    this.__running = false;

    this._animates = [];

    this.obj = this.create(this.props) || this.obj;
  }

  create () {
    console.error('empty component.create');
  }

  update (props) {
    if (!props) { return; }
    this.props = {...this.props, ...props};
    const { position } = this.props;

    if (position) {
      this.position(...position);
    }
  }

  __enter (state) {
    if (!this.__running) {
      this.__running = true;
      this.beforeEnter && this.beforeEnter(this.props);
    }

    this.enter(state);
  }

  __leave (state) {
    this.leave(state);
    this.__running = false;
  }

  add (component) {
    this.children.push(component);
    this.obj.add(component.obj || component);
  }

  remove (component) {
    this.children.splice(this.children.indexOf(component), 1);
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
    this.obj.visible = v;
    return true;
  }
}
