import { GUI } from './libs/dat.gui.module.js';
import FogGUIHelper from './FogUIHelper.js';

const effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    autoRotateSpeed: 0.2,
    particleSpeed: 4,
};

export default function(maxParticleCount, fogHelper,
                        onParticleCountChange, onShowDotsChange, onShowLinesChange) {

   const gui = new GUI();

   createParticlesUI(gui);
   createConnectionsUI(gui);
   createSceneUI(gui);

   function createParticlesUI(gui) {
       const particleFolder = gui.addFolder("Particles");
       particleFolder.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(onParticleCountChange);
       particleFolder.add(effectController, "particleSpeed", 0, 40, 1);
       particleFolder.add(effectController, "showDots").onChange(onShowDotsChange);
       particleFolder.open();
   }

   function createConnectionsUI(gui) {
       const connectionsFolder = gui.addFolder("Connections");
       connectionsFolder.add(effectController, "minDistance", 10, 300);
       connectionsFolder.add(effectController, "limitConnections");
       connectionsFolder.add(effectController, "maxConnections", 0, 30, 1);
       connectionsFolder.add(effectController, "showLines").onChange(onShowLinesChange);
       connectionsFolder.open();
   }

   function createSceneUI(gui) {
       const sceneFolder = gui.addFolder("Scene");
       sceneFolder.add(effectController, "autoRotateSpeed", 0, 10, 0.1);

       //const fog = scene.fog;
       const fogNear = fogHelper.fogNear;
       const fogFar = fogHelper.fogFar;
       sceneFolder.add(fogHelper, 'fogNear', fogNear, fogFar).listen();
       sceneFolder.add(fogHelper, 'fogFar', fogNear, fogFar).listen();
       sceneFolder.addColor(fogHelper, 'color');

       sceneFolder.open();
   }

   return {
       effectController,
       getParticleCount: () => effectController.particleCount,
    };
};



