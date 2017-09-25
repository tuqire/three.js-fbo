'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createDataTexture = createDataTexture;

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createDataTexture(_ref) {
	var data = _ref.data,
	    tWidth = _ref.tWidth,
	    tHeight = _ref.tHeight,
	    format = _ref.format,
	    filterType = _ref.filterType;

	var dataTexture = new THREE.DataTexture(data, tWidth, tHeight, format, THREE.FloatType);

	dataTexture.minFilter = dataTexture.magFilter = filterType;
	dataTexture.needsUpdate = true;
	dataTexture.flipY = false;

	return dataTexture;
}