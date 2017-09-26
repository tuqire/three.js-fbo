# three.js-fbo

FBO Module for use with THREE.js. Very useful for computing particles.


## Example

Example use case.

```js
import * as THREE from 'three';
import FBO from 'three.js-fbo';

let material; // a THREE.js material

const positionFBO = new FBO({
  tWidth = 512, // simulation texture width
  tHeight = 512,// simulation texture height
  numTargets = 3, // number of targets
  filterType = THREE.NearestFilter, // THREE.js texture filter type
  format = THREE.RGBAFormat, // THREE.js texture format type
  renderer, // THREE.js renderer
  uniforms, // uniforms to pass to shaders
  simulationVertexShader, // simulation vertex shader
  simulationFragmentShader // simulation fragment shader
});

// your render animation event func
render() {
	positionFBO.simulate();
	material.uniforms.tPosition.value = positionFBO.getCurrentFrame();
}

```


## Contributors

* Tuqire Hussain <me@tuqire.com>
