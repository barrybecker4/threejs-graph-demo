import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import materials from './materials.js';


export default function(maxParticleCount, sceneParams) {

    const group = new THREE.Group();

    const particlesData = [];
    const r = 800;
    const rHalf = r / 2;

    const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0x101010 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    group.add( helper );

    const segments = maxParticleCount * maxParticleCount;

    const positions = new Float32Array( segments * 3 );
    const colors = new Float32Array( segments * 3 );


    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array( maxParticleCount * 3 );

    for ( let i = 0; i < maxParticleCount; i ++ ) {

        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;

        particlePositions[ i * 3 ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;

        // add it to the geometry
        const randomSpeed = () => - 1 + Math.random() * 2;
        particlesData.push({
            velocity: new THREE.Vector3( randomSpeed(), randomSpeed(), randomSpeed()),
            numConnections: 0,
        });
    }

    particles.setDrawRange( 0, sceneParams.particleCount );
    particles.setAttribute( 'position',
        new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );


    // create the particle system
    const pointCloud = new THREE.Points( particles, materials.POINT_MATERIAL );
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

        for ( let i = 0; i < sceneParams.particleCount; i ++ )
            particlesData[ i ].numConnections = 0;

        for ( let i = 0; i < sceneParams.particleCount; i ++ ) {

            // get the particle
            const particleData = particlesData[ i ];
            const speedFactor = sceneParams.particleSpeed / 10;

            particlePositions[ i * 3 ] += particleData.velocity.x * speedFactor;
            particlePositions[ i * 3 + 1 ] += particleData.velocity.y * speedFactor;
            particlePositions[ i * 3 + 2 ] += particleData.velocity.z * speedFactor;

            if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
                particleData.velocity.y = - particleData.velocity.y;

            if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
                particleData.velocity.x = - particleData.velocity.x;

            if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
                particleData.velocity.z = - particleData.velocity.z;

            if (sceneParams.limitConnections && particleData.numConnections >= sceneParams.maxConnections)
                continue;

            // Check collision
            for ( let j = i + 1; j < sceneParams.particleCount; j ++ ) {

                const particleDataB = particlesData[ j ];
                if ( sceneParams.limitConnections && particleDataB.numConnections >= sceneParams.maxConnections )
                    continue;

                const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
                const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
                const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
                const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                if ( dist < sceneParams.minDistance ) {

                    particleData.numConnections ++;
                    particleDataB.numConnections ++;

                    const alpha = 1.0 - dist / sceneParams.minDistance;

                    positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
                    positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
                    positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];

                    positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
                    positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
                    positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];

                    colors[ colorpos ++ ] = alpha;
                    colors[ colorpos ++ ] = alpha;
                    colors[ colorpos ++ ] = alpha;

                    colors[ colorpos ++ ] = alpha;
                    colors[ colorpos ++ ] = alpha;
                    colors[ colorpos ++ ] = alpha;

                    numConnected ++;
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