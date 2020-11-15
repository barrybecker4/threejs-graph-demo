import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import uiControls from './uiControls.js';
import navContext from './navContext.js';
import sceneGraph from './sceneGraph.js';


export default function(maxParticleCount) {

    const onParticleCountChange = value => group.setNumParticlesToShow(controls.getParticleCount());
    const onShowDotsChange = value => group.showPointCloud(value);
    const onShowLinesChange = value => group.showLineMesh(value);

    const controls = uiControls(maxParticleCount, onParticleCountChange, onShowDotsChange, onShowLinesChange);
    const group = sceneGraph(maxParticleCount, controls);

    const context = navContext('container');
    context.add(group);

    animate();

    function animate() {
        group.animate();
        requestAnimationFrame(animate);
        context.render();
    }
}
