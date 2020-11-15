import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import materials from './materials.js';

let group;
const particlesData = [];
let positions, colors;
let particles;
let pointCloud;
let particlePositions;
let lineMesh;

const r = 800;
const rHalf = r / 2;

export default function(maxParticleCount, controls) {

    group = new THREE.Group();

    const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0x101010 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    group.add( helper );

    const segments = maxParticleCount * maxParticleCount;

    positions = new Float32Array( segments * 3 );
    colors = new Float32Array( segments * 3 );

    particles = new THREE.BufferGeometry();
    particlePositions = new Float32Array( maxParticleCount * 3 );

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

    particles.setDrawRange( 0, controls.getParticleCount() );
    particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

    // create the particle system
    pointCloud = new THREE.Points( particles, materials.POINT_MATERIAL );
    group.add( pointCloud );

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

    geometry.computeBoundingSphere();

    geometry.setDrawRange( 0, 0 );

    lineMesh = new THREE.LineSegments( geometry, materials.LINE_MATERIAL );
    group.add( lineMesh );

    group.showLineMesh = (value) => lineMesh.visible = value;
    group.showPointCloud = (value) => pointCloud.visible = value;
    group.setNumParticlesToShow = (value) => particles.setDrawRange(0, value);

    group.animate = function() {
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for ( let i = 0; i < controls.getParticleCount(); i ++ )
            particlesData[ i ].numConnections = 0;

        for ( let i = 0; i < controls.getParticleCount(); i ++ ) {

            // get the particle
            const particleData = particlesData[ i ];
            const effectController = controls.effectController;
            const speedFactor = effectController.particleSpeed / 10;

            particlePositions[ i * 3 ] += particleData.velocity.x * speedFactor;
            particlePositions[ i * 3 + 1 ] += particleData.velocity.y * speedFactor;
            particlePositions[ i * 3 + 2 ] += particleData.velocity.z * speedFactor;

            if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
                particleData.velocity.y = - particleData.velocity.y;

            if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
                particleData.velocity.x = - particleData.velocity.x;

            if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
                particleData.velocity.z = - particleData.velocity.z;

            if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
                continue;

            // Check collision
            for ( let j = i + 1; j < controls.getParticleCount(); j ++ ) {

                const particleDataB = particlesData[ j ];
                if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
                    continue;

                const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
                const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
                const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
                const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                if ( dist < effectController.minDistance ) {

                    particleData.numConnections ++;
                    particleDataB.numConnections ++;

                    const alpha = 1.0 - dist / effectController.minDistance;

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
        const rotateSpeed = controls.effectController.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }
    }

    return group;
}