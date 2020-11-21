/*
 * Parameters used to control the appearance of the scene.
 */
export default class SceneParameters {

    constructor() {
        this.showPoints = true;
        this.showLines = true;
        this.minDistance = 150;
        this.limitConnections = false;
        this.maxConnections = 20;
        this.particleCount = 500;
        this.autoRotateSpeed = 0.2;
        this.particleSpeed = 2;
        this.particleGeometry = 'Point';
        this.oldParticleGeometry = null;
    }
}