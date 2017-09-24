import THREE from 'three';
import { createDataTexture } from './utils';

export default class FBO {
	constructor({
		tWidth = 512,
		tHeight = 512,
		numTargets = 3,
		filterType = THREE.NearestFilter,
		format = THREE.RGBAFormat,
		renderer,
		uniforms,
		simulationVertexShader,
		simulationFragmentShader
	} = {}) {
		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.numTargets = numTargets;
		this.filterType = filterType;
		this.format = format;
		this.renderer = renderer;

		this.simulationShader = new THREE.ShaderMaterial({
			uniforms: Object.assign({}, uniforms, {
				numFrames: { type: 'f', value: 60 },
				tPrev: { type: 't', value: null },
				tCurr: { type: 't', value: null }
			}),
			vertexShader: simulationVertexShader,
			fragmentShader:  simulationFragmentShader
		});

		this.cameraRTT = new THREE.OrthographicCamera(-tWidth / 2, tWidth / 2, tHeight / 2, -tHeight / 2, -1000000, 1000000);
		this.cameraRTT.position.z = 0.1;

		this.sceneRTTPos = new THREE.Scene();
		this.sceneRTTPos.add(this.cameraRTT);

		this.floatType = this.getType();
		this.targets = [];

		for (let i = 0; i < this.numTargets; i++) {
			this.targets.push(this.createTarget());
		}

		this.plane = new THREE.PlaneBufferGeometry(tWidth, tHeight);
		const quad = new THREE.Mesh(this.plane, this.simulationShader);
		this.sceneRTTPos.add(quad);

		this.count = -1;
	}

	/**
		Tests if rendering to float render targets is available
		THREE.FloatType not available on ios
	**/
	getType() {
		const renderTarget = new THREE.WebGLRenderTarget(16, 16, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
		});
		this.renderer.get().render(this.sceneRTTPos, this.cameraRTT, renderTarget);
		const gl = this.renderer.get().context;
		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status !== gl.FRAMEBUFFER_COMPLETE) {
			console.log('FloatType not supported');
		  return THREE.HalfFloatType;
		}
		return THREE.FloatType;
	}

	createTarget() {
		const target = new THREE.WebGLRenderTarget(this.tWidth, this.tHeight, {
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			minFilter: this.filterType,
			magFilter: this.filterType,
			format: this.format,
			type: this.floatType
		});
		target.texture.generateMipmaps = false;

		return target;
	}

	setTextureUniform(name, data) {
		const dataTexture = createDataTexture({
			data,
			tWidth: this.tWidth,
			tHeight: this.tHeight,
			format: this.format,
			filterType: this.filterType
		});

		if (typeof name === 'object') {
			name.forEach(sName => this.simulationShader.uniforms[sName].value = dataTexture);
		} else {
			this.simulationShader.uniforms[name].value = dataTexture;
		}
	}

	simulate() {
		this.count++;

		if (this.count === this.numTargets) {
			this.count = 0;
		}

		const prev = (this.count === 0 ? this.numTargets : this.count) - 1;
		const prevTarget = this.targets[prev];

		this.renderer.render({
			scene: this.sceneRTTPos,
			camera: this.cameraRTT,
			renderTarget: this.getCurrentFrame(),
			force: false
		});

		this.simulationShader.uniforms.tPrev.value = prevTarget;
		this.simulationShader.uniforms.tCurr.value = this.getCurrentFrame();
	}

	getCurrentFrame() {
		return this.targets[this.count];
	}
}
