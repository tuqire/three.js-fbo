'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createDataTexture = createDataTexture;

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDataTexture(_ref) {
	var data = _ref.data,
	    tWidth = _ref.tWidth,
	    tHeight = _ref.tHeight,
	    format = _ref.format,
	    filterType = _ref.filterType;

	var dataTexture = new _three2.default.DataTexture(data, tWidth, tHeight, format, _three2.default.FloatType);

	dataTexture.minFilter = dataTexture.magFilter = filterType;
	dataTexture.needsUpdate = true;
	dataTexture.flipY = false;

	return dataTexture;
}