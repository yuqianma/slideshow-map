/**
 * Created by Jeffrey on 2018/4/29.
 */
import * as three from 'three';

// Imported object's property is non-writable
// This hack makes 'examples/js/renderers/Projector.js' be able to overwrite the property
export const THREE = Object.assign({}, three);
