import { SvgStage } from './Stage';
import Title from '../src/Components/Card/Title';

import { Card } from '../src/constants';

const { Gradient } = Card;

const root = document.querySelector('#map');
const width = 500, height = 400;

const stage = new SvgStage({
  root,
  width: 600,
  height: 500
});

const title = new Title({
  defs: stage.defs
});

stage.plane.add(title.obj);

title.position(0, 0, 1);

const props = {
  width: 200,
  height: 30,
  indent: 20,
  text: '标题测试',
  fontSize: 16,
  fontFamily: 'sans-serif',
  backgroundColor1: Gradient[0],
  backgroundColor2: Gradient[1],
  textColor1: Gradient[1],
  textColor2: '#000',
  bottomLineColor: Gradient[1],
};

title.update(props);

const action = title.enterAction(props);
let started = false;
window.animation = action.start({
  update: v => {
    if (!started) {
      started = true;
      // title.beforeEnter(props);
    }
    title.enter(v);
  },
  complete: () => {
    const action = title.leaveAction(props);
    window.animation = action.start({
      update: v => {
        title.leave(v);
      }
    });
  }
});

window.stage = stage;
window.title = title;
