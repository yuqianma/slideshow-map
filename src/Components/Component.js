/**
 * Created by Jeffrey on 2018/4/26.
 */

export default class Component {
  constructor () {
    this.obj = null;
  }

  get visible () {
    return this.obj.visible
  }

  set visible (v) {
    this.obj.visible = v
  }
}
