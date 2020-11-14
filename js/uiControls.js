import { GUI } from './libs/dat.gui.module.js';

const effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500
};

export default {
    initGUI,
    getParticleCount,
    effectController,
}

function initGUI(maxParticleCount, onParticleCountChange) {

    const gui = new GUI();

    gui.add(effectController, "showDots").onChange( function ( value ) {
        pointCloud.visible = value;
    });

    gui.add(effectController, "showLines").onChange( function ( value ) {
        linesMesh.visible = value;
    });

    gui.add(effectController, "minDistance", 10, 300);
    gui.add(effectController, "limitConnections");
    gui.add(effectController, "maxConnections", 0, 30, 1);
    gui.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(onParticleCountChange);
}

function getParticleCount() {
    return effectController.particleCount;
}