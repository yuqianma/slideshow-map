import { MainColor } from '../constants';

export function prettyPrintMatrix(uglymatrix) {
  uglymatrix = uglymatrix.elements || uglymatrix;
  for (var s = 0; s < 4; s++) {
    var quartet = [uglymatrix[s],
      uglymatrix[s + 4],
      uglymatrix[s + 8],
      uglymatrix[s + 12]];
    console.log(quartet.map(function (num) {
      return num.toFixed(4)
    }))
  }
  console.log('----');
}

if (__DEV__) {
  window.prettyPrintMatrix = prettyPrintMatrix;
}

export function makePerspectiveMatrix(fovy, aspect, near, far) {
  var out = new THREE.Matrix4();
  var f = 1.0 / Math.tan(fovy / 2),
    nf = 1 / (near - far);
  out.elements[0] = f / aspect;
  out.elements[1] = 0;
  out.elements[2] = 0;
  out.elements[3] = 0;
  out.elements[4] = 0;
  out.elements[5] = f;
  out.elements[6] = 0;
  out.elements[7] = 0;
  out.elements[8] = 0;
  out.elements[9] = 0;
  out.elements[10] = (far + near) * nf;
  out.elements[11] = -1;
  out.elements[12] = 0;
  out.elements[13] = 0;
  out.elements[14] = (2 * far * near) * nf;
  out.elements[15] = 0;
  return out;
}

//gimme radians
export function radify(deg) {

  if (typeof deg === 'object') {
    return deg.map(function (degree) {
      return Math.PI * 2 * degree / 360
    })
  }

  else return Math.PI * 2 * deg / 360
}

//gimme degrees
export function degreeify(rad) {
  return 360 * rad / (Math.PI * 2)
}

export const getColorStr = color => new THREE.Color(color).getStyle();

const DefaultColorHue = (function () {
  const hsl = {};
  new THREE.Color(MainColor).getHSL(hsl);
  return hsl.h;
})();

export const getRotatedColor = (refColor, color) => {
  if (!color) {
    __DEV__ && console.warn('no color');
    color = MainColor;
  }

  const colorHSL = new THREE.Color(color).getHSL({});
  const hueOffset = colorHSL.h - DefaultColorHue;

  const c = new THREE.Color(refColor);
  c.offsetHSL(hueOffset, 0, 0);
  return c;
}
