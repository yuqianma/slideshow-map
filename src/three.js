// may be replaced by revised 64bit version threejs in Threebox

const three = THREE;

// `THREE` will be replaced by `three.js`, thus we prevent js in examples using `window.THREE`
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/OutlinePass';

export default three
