import { GUI } from '../libs/dat.gui.module.js';
import FogGUIHelper from './FogUIHelper.js';

export default function(maxParticleCount, fogHelper, sceneParams,
                        onShowPointsChange, onShowLinesChange, onShowGlobeChange) {

   const gui = new GUI();

   createParticlesUI(gui);
   createConnectionsUI(gui);
   createGlobeUI(gui);
   createSceneUI(gui);

   function createParticlesUI(gui) {
       const particleFolder = gui.addFolder('Particles');
       particleFolder.add(sceneParams, 'particleCount', 0, maxParticleCount, 1)
       particleFolder.add(sceneParams, 'particleSpeed', 0, 40, 1);
       particleFolder.add(sceneParams, 'particleSize', 0.5, 40, 0.1);
       particleFolder.add(sceneParams, 'showPoints').onChange(onShowPointsChange);
       particleFolder.add(sceneParams, 'particleGeometry', [ 'Point', 'Cube', 'Sphere', 'Sprite' ]);
       particleFolder.open();
   }

   function createConnectionsUI(gui) {
       const connectionsFolder = gui.addFolder('Connections');
       connectionsFolder.add(sceneParams, 'minDistance', 10, 300);
       connectionsFolder.add(sceneParams, 'limitConnections');
       connectionsFolder.add(sceneParams, 'maxConnections', 0, 30, 1);
       connectionsFolder.add(sceneParams, 'lineOpacity', 0.2, 1.0, 0.1);
       connectionsFolder.add(sceneParams, 'lineGeometry', [ 'Line', 'Arc' ]);
       connectionsFolder.add(sceneParams, 'showLines').onChange(onShowLinesChange);
       connectionsFolder.open();
   }

   function createGlobeUI(gui) {
      const globeFolder = gui.addFolder('Globe');
      globeFolder.add(sceneParams, 'globeRadius', 0, 800, 10);
      globeFolder.add(sceneParams, 'atmosphereThickness', 0, 1, 0.01);
      globeFolder.add(sceneParams, 'arcScale', 0.02, 2, 0.01);
      globeFolder.add(sceneParams, 'showGlobe').onChange(onShowGlobeChange);
      globeFolder.open();
   }

   function createSceneUI(gui) {
       const sceneFolder = gui.addFolder('Scene');
       sceneFolder.add(sceneParams, 'autoRotateSpeed', 0, 20, 0.1);

       //const fog = scene.fog;
       const fogNear = fogHelper.fogNear;
       const fogFar = fogHelper.fogFar;
       sceneFolder.add(fogHelper, 'fogNear', fogNear, fogFar).listen();
       sceneFolder.add(fogHelper, 'fogFar', fogNear, fogFar).listen();
       sceneFolder.addColor(fogHelper, 'color');

       sceneFolder.open();
   }
};



