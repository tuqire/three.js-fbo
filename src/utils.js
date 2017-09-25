import * as THREE from 'three';

export function createDataTexture({
	data,
	tWidth,
	tHeight,
	format,
	filterType
}) {
	const dataTexture = new THREE.DataTexture(
		data,
		tWidth,
		tHeight,
		format,
		THREE.FloatType
	);

	dataTexture.minFilter = dataTexture.magFilter = filterType;
	dataTexture.needsUpdate = true;
	dataTexture.flipY = false;

	return dataTexture;
}
