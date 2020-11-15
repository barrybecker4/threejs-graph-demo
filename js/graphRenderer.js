import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import navContext from './navContext.js';
import sceneGraph from './sceneGraph.js';
import uiControls from './ui/uiControls.js';
import FogGUIHelper from './ui/FogUIHelper.js';
import SceneParameters from './ui/SceneParameters.js';


export default function(maxParticleCount) {

    const sceneParams = new SceneParameters();

    const onParticleCountChange = value => group.setNumParticlesToShow(sceneParams.particleCount);
    const onShowDotsChange = value => group.showPointCloud(value);
    const onShowLinesChange = value => group.showLineMesh(value);

    const context = navContext('container');
    const fogHelper = new FogGUIHelper(context.getScene());

    const controls =
        uiControls(maxParticleCount, fogHelper, sceneParams,
                   onParticleCountChange, onShowDotsChange, onShowLinesChange);

    const group = sceneGraph(maxParticleCount, sceneParams);
    context.add(group);

    animate();

    function animate() {
        group.animate();
        requestAnimationFrame(animate);
        context.render();
    }
}
