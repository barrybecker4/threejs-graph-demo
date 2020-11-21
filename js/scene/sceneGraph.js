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

    let pointCloud = createPointCloudGeometry(sceneParams, particles, particlesData);
    group.add(pointCloud);

    const lineGeometry = createLineGeometry(linesData);
    const lineMesh = new THREE.LineSegments( lineGeometry, materials.LINE_MATERIAL);
    group.add( lineMesh );

    group.showLineMesh = (value) => lineMesh.visible = value;
    group.showPointCloud = (value) => pointCloud.visible = value;
    group.setNumParticlesToShow = (value) => {
        particles.setDrawRange(0, value);
    }

    group.animate = function() {
        const numConnected = particlesData.connectPoints(linesData, sceneParams);

        lineMesh.geometry.setDrawRange( 0, numConnected * 2 );
        lineMesh.geometry.attributes.position.needsUpdate = true;
        lineMesh.geometry.attributes.color.needsUpdate = true;

        const geomType = sceneParams.particleGeometry;
        if (geomType != sceneParams.oldParticleGeometry) {
            console.log("changing from  = " + sceneParams.oldParticleGeometry + " to " + geomType);
            group.remove(pointCloud);
            pointCloud = createPointCloudGeometry(sceneParams, particles, particlesData);
            group.add(pointCloud);
            sceneParams.oldParticleGeometry = geomType;
        }

        switch(geomType) {
            case 'Point' :
                materials.POINT_MATERIAL.size = 3 * sceneParams.particleSize;
                pointCloud.geometry.attributes.position.needsUpdate = true;
                break;
            case 'Cube' :
            case 'Sphere' :
            case 'Sprite' :
                const scale = sceneParams.particleSize;
                for ( let i = 0; i < pointCloud.children.length; i ++ ) {
                    const object = pointCloud.children[i];

                    object.visible = i < sceneParams.particleCount;
                    if (object.visible) {
                        const pt = particlesData.getPoint(i);

                        object.position.x = pt.x;
                        object.position.y = pt.y;
                        object.position.z = pt.z;

                        object.scale.x = scale;
                        object.scale.y = scale;
                        object.scale.z = scale;
                    }
                }
                break;
            default : throw new Error('Unexpected particleGeometry: ' + geomType);
        }

        // auto rotate if needed
        const rotateSpeed = sceneParams.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }
    }

    return group;
}

function createPointCloudGeometry(sceneParams, particles, particlesData) {

    let pointCloud;
    let geometry;
    const geomType = sceneParams.particleGeometry;
    sceneParams.oldParticleGeometry = geomType;


    switch(geomType) {
        case 'Point' :
            materials.POINT_MATERIAL.size = 3 * sceneParams.particleSize;
            pointCloud = new THREE.Points(particles, materials.POINT_MATERIAL);
            break;
        case 'Cube' :
            pointCloud = new THREE.Group();
            geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );

            for ( let i = 0; i < particlesData.data.length; i ++ ) {

                const object = new THREE.Mesh( geometry, materials.SOLID_MATERIAL);

                const pt = particlesData.getPoint(i);
                object.position.x = pt.x;
                object.position.y = pt.y;
                object.position.z = pt.z;
                object.visible = i < sceneParams.particleCount;

                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;

                object.scale.x = 1;
                object.scale.y = 1;
                object.scale.z = 1;

                pointCloud.add( object );
            }
            break;
        case 'Sphere' :
            pointCloud = new THREE.Group();
            geometry = new THREE.SphereBufferGeometry( 2, 10, 10 );

            for ( let i = 0; i < particlesData.data.length; i ++ ) {

                const object = new THREE.Mesh( geometry, materials.SOLID_MATERIAL);

                const pt = particlesData.getPoint(i);
                object.position.x = pt.x;
                object.position.y = pt.y;
                object.position.z = pt.z;
                object.visible = i < sceneParams.particleCount;

                object.scale.x = 1;
                object.scale.y = 1;
                object.scale.z = 1;

                pointCloud.add( object );
            }
            break;
        case 'Sprite' :
            pointCloud = new THREE.Group();
            const map = new THREE.TextureLoader().load( './images/appliance-icon.png' );
            const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );

            for ( let i = 0; i < particlesData.data.length; i ++ ) {

                //const object = new THREE.Mesh( geometry, materials.SOLID_MATERIAL);
                const object = new THREE.Sprite( material );
                object.scale.set(2, 2, 1); // for sprite

                const pt = particlesData.getPoint(i);
                object.position.x = pt.x;
                object.position.y = pt.y;
                object.position.z = pt.z;
                object.visible = i < sceneParams.particleCount;

                object.scale.x = 1;
                object.scale.y = 1;
                object.scale.z = 1;

                pointCloud.add( object );
            }
            break;
        default: throw new Error('Unexpected type: ' + geomType);
    }

    return pointCloud;
}

function createParticles(particlesData) {
    const particles = new THREE.BufferGeometry();
    particles.setDrawRange( 0, particlesData.data.length);
    const bufferedAttr = new THREE.BufferAttribute(particlesData.positions, 3).setUsage(THREE.DynamicDrawUsage);
    particles.setAttribute('position', bufferedAttr);
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
