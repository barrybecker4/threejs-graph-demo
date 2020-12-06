/*
 * Parameters used to control the appearance of the scene.
 */
export default class SceneParameters {

    constructor(maxParticleCount) {

        this.maxParticleCount = maxParticleCount;

        this.showPoints = true;
        this.showLines = true;
        this.minDistance = 1.5;
        this.limitConnections = false;
        this.maxConnections = 20;
        this.lineOpacity = 0.4;
        this.particleCount = Math.min(500, maxParticleCount);
        this.autoRotateSpeed = 0.0;
        this.particleSpeed = 0.02;
        this.particleGeometry = 'Sprite';
        this.lineGeometry = 'Line';
        this.oldParticleGeometry = null;
        this.oldLineGeometry = null;
        this.particleSize = 0.05;
        this.globeRadius = 4;
        this.atmosphereThickness = 0.04;
        this.arcScale = 0.2;
    }
}

