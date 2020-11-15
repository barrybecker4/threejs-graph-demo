import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

const POINT_MATERIAL = new THREE.PointsMaterial({
    color: 0xBF6FFF,
    size: 8,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: true, // points in distance are smaller
});

const SOLID_MATERIAL = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: 0x44cc99,
    specular: 0xaaffff,
    shininess: 1,
    vertexColors: false,
});


const LINE_MATERIAL = new THREE.LineBasicMaterial( {
    color: 0xAB3BBB,
    linewidth: 3,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
});

export default {
    POINT_MATERIAL,
    LINE_MATERIAL,
    SOLID_MATERIAL,
}