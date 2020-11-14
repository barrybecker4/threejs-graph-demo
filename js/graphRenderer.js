import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import uiControls from './uiControls.js';
import navContext from './navContext.js';
import sceneGraph from './sceneGraph.js';


export default function(maxParticleCount) {
    let group;
    let context;

    const onParticleCountChange = value => group.setNumParticlesToShow(uiControls.getParticleCount());

    group = sceneGraph(maxParticleCount, uiControls);
    uiControls.initGUI(maxParticleCount, onParticleCountChange, group.showPointCloud, group.showLineMesh);

    context = navContext('container');

    context.add( group );
    animate();

    function animate() {
        group.animate();
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const rotateSpeed = uiControls.effectController.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }

        context.render();
    }
}
