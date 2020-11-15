import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import materials from './materials.js';
import ParticlesData from './ParticlesData.js';


export default function(maxParticleCount, sceneParams) {

    const group = new THREE.Group();

    const r = 800;

    const particlesData = new ParticlesData(maxParticleCount, r);

    const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0x101010 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    group.add( helper );

    const maxSegments = maxParticleCount * maxParticleCount;

    const positions = new Float32Array( maxSegments * 3 );
    const colors = new Float32Array( maxSegments * 3 );

    const particles = new THREE.BufferGeometry();
    particles.setDrawRange( 0, sceneParams.particleCount );
    particles.setAttribute('position',
        new THREE.BufferAttribute(particlesData.positions, 3).setUsage(THREE.DynamicDrawUsage) );

    // create the particle system
    const pointCloud = new THREE.Points(particles, materials.POINT_MATERIAL);
    group.add( pointCloud );

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.computeBoundingSphere();
    geometry.setDrawRange( 0, 0 );


    const lineMesh = new THREE.LineSegments( geometry, materials.LINE_MATERIAL );
    group.add( lineMesh );

    group.showLineMesh = (value) => lineMesh.visible = value;
    group.showPointCloud = (value) => pointCloud.visible = value;
    group.setNumParticlesToShow = (value) => particles.setDrawRange(0, value);

    group.animate = function() {
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for ( let i = 0; i < sceneParams.particleCount; i ++ ) {
            particlesData.get(i).numConnections = 0;
        }

        const speedFactor = sceneParams.particleSpeed / 10;

        for ( let i = 0; i < sceneParams.particleCount; i ++ ) {

            // get the particle
            const particleData = particlesData.get(i);
            const ii = 3 * i;

            particlesData.updatePositionAndVelocity(i, speedFactor);

            if (sceneParams.limitConnections && particleData.numConnections >= sceneParams.maxConnections)
                continue;

            // Check collision
            for ( let j = i + 1; j < sceneParams.particleCount; j ++ ) {
                const jj = 3 * j;

                const particleDataB = particlesData.get(j);
                if ( sceneParams.limitConnections && particleDataB.numConnections >= sceneParams.maxConnections )
                    continue;

                const pti = particlesData.getPoint(ii);
                const ptj = particlesData.getPoint(jj);
                const dx = pti.x - ptj.x;
                const dy = pti.y - ptj.y;
                const dz = pti.z - ptj.z;
                const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                if ( dist < sceneParams.minDistance ) {

                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    const alpha = 1.0 - dist / sceneParams.minDistance;

                    positions[ vertexpos++ ] = pti.x;
                    positions[ vertexpos++ ] = pti.y;
                    positions[ vertexpos++ ] = pti.z;

                    positions[ vertexpos++ ] = ptj.x;
                    positions[ vertexpos++ ] = ptj.y;
                    positions[ vertexpos++ ] = ptj.z;

                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;

                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;
                    colors[ colorpos++ ] = alpha;

                    numConnected++;
                }
            }
        }

        lineMesh.geometry.setDrawRange( 0, numConnected * 2 );
        lineMesh.geometry.attributes.position.needsUpdate = true;
        lineMesh.geometry.attributes.color.needsUpdate = true;

        pointCloud.geometry.attributes.position.needsUpdate = true;

        // auto rotate if needed
        const rotateSpeed = sceneParams.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }
    }

    return group;
}