import { GUI } from './libs/dat.gui.module.js';

const effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    autoRotateSpeed: 0.2,
};

export default {
    initGUI,
    getParticleCount,
    effectController,
}

function initGUI(maxParticleCount, onParticleCountChange, onShowDotsChange, onShowLinesChange) {

    const gui = new GUI();

    gui.add(effectController, "showDots").onChange(onShowDotsChange);
    gui.add(effectController, "showLines").onChange(onShowLinesChange);

    gui.add(effectController, "minDistance", 10, 300);
    gui.add(effectController, "limitConnections");
    gui.add(effectController, "maxConnections", 0, 30, 1);
    gui.add(effectController, "autoRotateSpeed", 0, 10, 0.1);
    gui.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(onParticleCountChange);
}

function getParticleCount() {
    return effectController.particleCount;
}