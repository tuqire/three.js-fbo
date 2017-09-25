'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FBO = function () {
	function FBO() {
		var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$tWidth = _ref.tWidth,
		    tWidth = _ref$tWidth === undefined ? 512 : _ref$tWidth,
		    _ref$tHeight = _ref.tHeight,
		    tHeight = _ref$tHeight === undefined ? 512 : _ref$tHeight,
		    _ref$numTargets = _ref.numTargets,
		    numTargets = _ref$numTargets === undefined ? 3 : _ref$numTargets,
		    _ref$filterType = _ref.filterType,
		    filterType = _ref$filterType === undefined ? _three2.default.NearestFilter : _ref$filterType,
		    _ref$format = _ref.format,
		    format = _ref$format === undefined ? _three2.default.RGBAFormat : _ref$format,
		    renderer = _ref.renderer,
		    uniforms = _ref.uniforms,
		    simulationVertexShader = _ref.simulationVertexShader,
		    simulationFragmentShader = _ref.simulationFragmentShader;

		_classCallCheck(this, FBO);

		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.numTargets = numTargets;
		this.filterType = filterType;
		this.format = format;
		this.renderer = renderer;

		this.simulationShader = new _three2.default.ShaderMaterial({
			uniforms: Object.assign({}, uniforms, {
				numFrames: { type: 'f', value: 60 },
				tPrev: { type: 't', value: null },
				tCurr: { type: 't', value: null }
			}),
			vertexShader: simulationVertexShader,
			fragmentShader: simulationFragmentShader
		});

		this.cameraRTT = new _three2.default.OrthographicCamera(-tWidth / 2, tWidth / 2, tHeight / 2, -tHeight / 2, -1000000, 1000000);
		this.cameraRTT.position.z = 0.1;

		this.sceneRTTPos = new _three2.default.Scene();
		this.sceneRTTPos.add(this.cameraRTT);

		this.floatType = this.getType();
		this.targets = [];

		for (var i = 0; i < this.numTargets; i++) {
			this.targets.push(this.createTarget());
		}

		this.plane = new _three2.default.PlaneBufferGeometry(tWidth, tHeight);
		var quad = new _three2.default.Mesh(this.plane, this.simulationShader);
		this.sceneRTTPos.add(quad);

		this.count = -1;
	}

	/**
 	Tests if rendering to float render targets is available
 	THREE.FloatType not available on ios
 **/


	_createClass(FBO, [{
		key: 'getType',
		value: function getType() {
			var renderTarget = new _three2.default.WebGLRenderTarget(16, 16, {
				format: _three2.default.RGBAFormat,
				type: _three2.default.FloatType
			});
			this.renderer.get().render(this.sceneRTTPos, this.cameraRTT, renderTarget);
			var gl = this.renderer.get().context;
			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				console.log('FloatType not supported');
				return _three2.default.HalfFloatType;
			}
			return _three2.default.FloatType;
		}
	}, {
		key: 'createTarget',
		value: function createTarget() {
			var target = new _three2.default.WebGLRenderTarget(this.tWidth, this.tHeight, {
				wrapS: _three2.default.ClampToEdgeWrapping,
				wrapT: _three2.default.ClampToEdgeWrapping,
				minFilter: this.filterType,
				magFilter: this.filterType,
				format: this.format,
				type: this.floatType
			});
			target.texture.generateMipmaps = false;

			return target;
		}
	}, {
		key: 'setTextureUniform',
		value: function setTextureUniform(name, data) {
			var _this = this;

			var dataTexture = (0, _utils.createDataTexture)({
				data: data,
				tWidth: this.tWidth,
				tHeight: this.tHeight,
				format: this.format,
				filterType: this.filterType
			});

			if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
				name.forEach(function (sName) {
					return _this.simulationShader.uniforms[sName].value = dataTexture;
				});
			} else {
				this.simulationShader.uniforms[name].value = dataTexture;
			}
		}
	}, {
		key: 'simulate',
		value: function simulate() {
			this.count++;

			if (this.count === this.numTargets) {
				this.count = 0;
			}

			var prev = (this.count === 0 ? this.numTargets : this.count) - 1;
			var prevTarget = this.targets[prev];

			this.renderer.render({
				scene: this.sceneRTTPos,
				camera: this.cameraRTT,
				renderTarget: this.getCurrentFrame(),
				force: false
			});

			this.simulationShader.uniforms.tPrev.value = prevTarget;
			this.simulationShader.uniforms.tCurr.value = this.getCurrentFrame();
		}
	}, {
		key: 'getCurrentFrame',
		value: function getCurrentFrame() {
			return this.targets[this.count];
		}
	}]);

	return FBO;
}();

exports.default = FBO;