/**
 * Created by Jeffrey on 2018/4/20.
 */

import { Matrix4 } from 'three';

export function makePerspectiveMatrix (fovy, aspect, near, far) {
  const out = new Matrix4();
  const f = 1.0 / Math.tan(fovy / 2),
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
