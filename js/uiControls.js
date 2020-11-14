import { GUI } from './libs/dat.gui.module.js';

export default {
    initGUI,
}

function initGUI(effectController, maxParticleCount, onParticleCountChange) {

    const gui = new GUI();

    gui.add(effectController, "showDots" ).onChange( function ( value ) {
        pointCloud.visible = value;
    });

    gui.add(effectController, "showLines" ).onChange( function ( value ) {
        linesMesh.visible = value;
    });

    gui.add(effectController, "minDistance", 10, 300 );
    gui.add(effectController, "limitConnections" );
    gui.add(effectController, "maxConnections", 0, 30, 1 );
    gui.add(effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( onParticleCountChange );
}