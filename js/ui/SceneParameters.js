/*
 * Parameters used to control the appearance of the scene.
 */
export default class SceneParameters {

    constructor() {
        this.showPoints = true;
        this.showLines = true;
        this.showGlobe = false;
        this.minDistance = 150;
        this.limitConnections = false;
        this.maxConnections = 20;
        this.particleCount = 500;
        this.autoRotateSpeed = 0.0;
        this.particleSpeed = 2;
        this.particleGeometry = 'Cube';
        this.oldParticleGeometry = null;
        this.particleSize = 3;
        this.globeRadius = 0;
        this.atmosphereThickness = 1.0;
    }
}

