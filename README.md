TODO:

# three.js-fbo

FBO Module for use with THREE.js.


## Examples

```js
import FBO from 'three.js-fbo';

const positionFBO = new FBO({
  tWidth = 512, // simulation texture width
  tHeight = 512,// simulation texture height
  numTargets = 3, // number of targets
  filterType = THREE.NearestFilter, // Three.js texture filter type
  format = THREE.RGBAFormat, // Three.js texture format type
  renderer, // Three.js renderer
  uniforms, // uniforms to pass to shaders
  simulationVertexShader, // simulation vertex shader
  simulationFragmentShader // simulation fragment shader
});

render() {
	positionFBO.simulate();
	material.uniforms.tPosition.value = positionFBO.getCurrentFrame();
}

```


## Contributors

* Tuqire Hussain <me@tuqire.com>
