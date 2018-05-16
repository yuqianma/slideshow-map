import '../src/three';
const context = require.context('./', true, /test\.js$/);

export default context
  .keys()
  .map(key => context(key));
