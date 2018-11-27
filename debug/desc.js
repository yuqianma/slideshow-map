import { SvgStage } from './Stage';
import Description from '../src/Components/Card/Description';
import { createFilter } from '../src/Components/Card';

const root = document.querySelector('#map');
const width = 500, height = 400;

const stage = new SvgStage({
  root,
  width,
  height
});

createFilter(stage.defs);

const desc = new Description({
  defs: stage.defs
});

stage.plane.add(desc.obj);

desc.position(0, 0, 1);

const props = {
  color: '#0bd',
  text: '测试文字',
  fontSize: 16,
  fontFamily: 'sans-serif'
};

desc.update(props);

const action = desc.enterAction(props);
let started = false;
window.animation = action.start({
  update: v => {
    if (!started) {
      started = true;
      desc.beforeEnter(props);
    }
    desc.enter(v);
  },
  complete: () => {
    const action = desc.leaveAction(props);
    window.animation = action.start({
      update: v => {
        desc.leave(v);
      }
    });
  }
});

window.stage = stage;
window.desc = desc;
