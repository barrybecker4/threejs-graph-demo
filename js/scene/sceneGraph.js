import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import materials from './materials.js';
import ParticlesData from './ParticlesData.js';
import LinesData from './LinesData.js';

// edge length of the bounding cube
const R = 800;

export default function(maxParticleCount, sceneParams) {

    const particlesData = new ParticlesData(maxParticleCount, R);
    const particles = createParticles(particlesData);
    const linesData = new LinesData(maxParticleCount);

    const group = new THREE.Group();
    group.add( createBoxHelper(R) );

    const pointCloud = new THREE.Points(particles, materials.POINT_MATERIAL); // materials.SOLID_MATERIAL); //
    group.add(pointCloud);

    const lineGeometry = createLineGeometry(linesData);
    const lineMesh = new THREE.LineSegments( lineGeometry, materials.LINE_MATERIAL );
    group.add( lineMesh );

    group.showLineMesh = (value) => lineMesh.visible = value;
    group.showPointCloud = (value) => pointCloud.visible = value;
    group.setNumParticlesToShow = (value) => particles.setDrawRange(0, value);

    group.animate = function() {
        const numConnected = particlesData.connectPoints(linesData, sceneParams);

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

function createParticles(particlesData) {
    //const particles = new THREE.SphereBufferGeometry(20, 10, 10);
    const particles = new THREE.BufferGeometry();
    particles.setDrawRange( 0, particlesData.data.length); // sceneParams.particleCount );
    particles.setAttribute('position',
        new THREE.BufferAttribute(particlesData.positions, 3).setUsage(THREE.DynamicDrawUsage) );
    return particles;
}

function createLineGeometry(linesData) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute( linesData.positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.setAttribute('color', new THREE.BufferAttribute( linesData.colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.computeBoundingSphere();
    geometry.setDrawRange( 0, 0 );
    return geometry;
}

function createBoxHelper(r) {
    const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0x101010 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    return helper;
}
