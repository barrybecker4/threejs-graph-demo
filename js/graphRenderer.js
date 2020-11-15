import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import uiControls from './uiControls.js';
import navContext from './navContext.js';
import sceneGraph from './sceneGraph.js';
import FogGUIHelper from './FogUIHelper.js';


export default function(maxParticleCount) {

    const onParticleCountChange = value => group.setNumParticlesToShow(controls.getParticleCount());
    const onShowDotsChange = value => group.showPointCloud(value);
    const onShowLinesChange = value => group.showLineMesh(value);

    const context = navContext('container');
    const fogHelper = new FogGUIHelper(context.getScene());
    const controls =
        uiControls(maxParticleCount, fogHelper,
                   onParticleCountChange, onShowDotsChange, onShowLinesChange);

    const group = sceneGraph(maxParticleCount, controls);
    context.add(group);

    animate();

    function animate() {
        group.animate();
        requestAnimationFrame(animate);
        context.render();
    }
}
