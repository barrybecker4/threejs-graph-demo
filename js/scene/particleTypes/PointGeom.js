import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticleGeom from './ParticleGeom.js';

const POINT_MATERIAL = new THREE.PointsMaterial({
    color: 0xBF6FFF,
    size: 8,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: true, // points in distance are smaller
});


export default class PointGeom extends ParticleGeom {

    constructor() {
        super();
    }

    createPointCloud(sceneParams, particles, particlesData) {
        POINT_MATERIAL.size = 3 * sceneParams.particleSize;
        this.pointCloud = new THREE.Points(particles, POINT_MATERIAL);
        return this.pointCloud;
    }

    renderPointCloud(sceneParams, particles, particlesData) {
        POINT_MATERIAL.size = 3 * sceneParams.particleSize;
        this.pointCloud.geometry.attributes.position.needsUpdate = true;
    }

}