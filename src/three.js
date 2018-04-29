// may be replaced by revised 64bit version threejs in Threebox

const three = THREE;

// `THREE` will be replaced by `LibThree.js`, thus we prevent js in examples using `window.THREE`
import 'three/examples/js/renderers/Projector.js';
import 'three/examples/js/renderers/SVGRenderer.js';

import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/OutlinePass';

import 'three/examples/js/lines/LineSegmentsGeometry';
import 'three/examples/js/lines/LineGeometry';
import 'three/examples/js/lines/WireframeGeometry2';
import 'three/examples/js/lines/LineMaterial';
import 'three/examples/js/lines/LineSegments2';
import 'three/examples/js/lines/Line2';
import 'three/examples/js/lines/Wireframe';

__DEV__ && (window.THREE = three);

export default three
