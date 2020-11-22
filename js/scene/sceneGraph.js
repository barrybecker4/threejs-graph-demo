import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticlesData from './ParticlesData.js';
import LinesData from './LinesData.js';
import PointGeom from './particleTypes/PointGeom.js';
import CubeGeom from './particleTypes/CubeGeom.js';
import SphereGeom from './particleTypes/SphereGeom.js';
import SpriteGeom from './particleTypes/SpriteGeom.js'

// edge length of the bounding cube
const R = 800;

const LINE_MATERIAL = new THREE.LineBasicMaterial( {
    color: 0xAB3BBB,
    linewidth: 3,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
});

const GEOM_TYPE_TO_CONSTRUCTOR = {
    Point : PointGeom,
    Cube: CubeGeom,
    Sphere: SphereGeom,
    Sprite: SpriteGeom,
}

export default function(maxParticleCount, sceneParams) {

    const particlesData = new ParticlesData(maxParticleCount, R);
    const linesData = new LinesData(maxParticleCount);

    const group = new THREE.Group();
    group.add(createBoxHelper(R));

    let particleGeom = createParticleGeometry(sceneParams);
    let pointCloud = particleGeom.createPointCloud(sceneParams, particlesData);
    group.add(pointCloud);

    const lineGeometry = createLineGeometry(linesData);
    const lineMesh = new THREE.LineSegments( lineGeometry, LINE_MATERIAL);
    group.add( lineMesh );

    group.showLineMesh = value => lineMesh.visible = value;
    group.showPointCloud = value => pointCloud.visible = value;

    group.animate = function() {
        const numConnected = particlesData.connectPoints(linesData, sceneParams);

        lineMesh.geometry.setDrawRange( 0, numConnected * 2 );
        lineMesh.geometry.attributes.position.needsUpdate = true;
        lineMesh.geometry.attributes.color.needsUpdate = true;

        const geomType = sceneParams.particleGeometry;
        if (geomType != sceneParams.oldParticleGeometry) {
            console.log("changing from  = " + sceneParams.oldParticleGeometry + " to " + geomType);
            group.remove(pointCloud);

            particleGeom = createParticleGeometry(sceneParams);
            pointCloud = particleGeom.createPointCloud(sceneParams, particlesData);

            group.add(pointCloud);
            sceneParams.oldParticleGeometry = geomType;
        }

        particleGeom.renderPointCloud(sceneParams, particlesData);

        // auto rotate if needed
        const rotateSpeed = sceneParams.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }
    }

    return group;
}

function createParticleGeometry(sceneParams) {
    const constructor = GEOM_TYPE_TO_CONSTRUCTOR[sceneParams.particleGeometry];
    if (!constructor) {
        throw new Error("Invalid particle type: " + sceneParams.particleGeometry);
    }
    return new constructor();
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
