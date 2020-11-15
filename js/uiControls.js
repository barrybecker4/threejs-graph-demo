import { GUI } from './libs/dat.gui.module.js';
import FogGUIHelper from './FogUIHelper.js';

export default function(maxParticleCount, fogHelper, sceneParams,
                        onParticleCountChange, onShowDotsChange, onShowLinesChange) {

   const gui = new GUI();

   createParticlesUI(gui);
   createConnectionsUI(gui);
   createSceneUI(gui);

   function createParticlesUI(gui) {
       const particleFolder = gui.addFolder("Particles");
       particleFolder.add(sceneParams, "particleCount", 0, maxParticleCount, 1).onChange(onParticleCountChange);
       particleFolder.add(sceneParams, "particleSpeed", 0, 40, 1);
       particleFolder.add(sceneParams, "showDots").onChange(onShowDotsChange);
       particleFolder.open();
   }

   function createConnectionsUI(gui) {
       const connectionsFolder = gui.addFolder("Connections");
       connectionsFolder.add(sceneParams, "minDistance", 10, 300);
       connectionsFolder.add(sceneParams, "limitConnections");
       connectionsFolder.add(sceneParams, "maxConnections", 0, 30, 1);
       connectionsFolder.add(sceneParams, "showLines").onChange(onShowLinesChange);
       connectionsFolder.open();
   }

   function createSceneUI(gui) {
       const sceneFolder = gui.addFolder("Scene");
       sceneFolder.add(sceneParams, "autoRotateSpeed", 0, 10, 0.1);

       //const fog = scene.fog;
       const fogNear = fogHelper.fogNear;
       const fogFar = fogHelper.fogFar;
       sceneFolder.add(fogHelper, 'fogNear', fogNear, fogFar).listen();
       sceneFolder.add(fogHelper, 'fogFar', fogNear, fogFar).listen();
       sceneFolder.addColor(fogHelper, 'color');

       sceneFolder.open();
   }
};



