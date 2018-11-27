import { SvgStage } from './Stage';
import List from '../src/Components/Card/List';
import { createFilter } from '../src/Components/Card';

const root = document.querySelector('#map');
const width = 500, height = 400;

const stage = new SvgStage({
  root,
  width,
  height
});

createFilter(stage.defs);

const list = new List({
  defs: stage.defs
});

stage.plane.add(list.obj);

list.position(0, 0, 1);

const props = {
  contents: [
    '测试1',
    '测试2',
    'AAAAAAAAAAA',
    'BBBBBBBBBBBB'
  ],
  width: 300,
  height: 300,
  rowHeight: 20,
  fontSize: 14,
  fontFamily: 'sans-serif'
};

// list.update(props);

list.update(props);

const action = list.enterAction(props);

window.animation = action.start({
  update: v => {
    list.enter(v);
  },
  complete: () => {
    const action = list.leaveAction(props);
    window.animation = action.start({
      update: v => {
        list.leave(v);
      }
    });
  }
});

window.stage = stage;
window._list = list;
