import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticlesData from './ParticlesData.js';
import LinesData from './LinesData.js';
import StraightLineGeom from './lineTypes/StraightLineGeom.js';
import ArcedLineGeom from './lineTypes/ArcedLineGeom.js';
import PointGeom from './particleTypes/PointGeom.js';
import CubeGeom from './particleTypes/CubeGeom.js';
import SphereGeom from './particleTypes/SphereGeom.js';
import SpriteGeom from './particleTypes/SpriteGeom.js'

// edge length of the bounding cube
const R = 800;

const POINT_TYPE_TO_CONSTRUCTOR = {
    Point : PointGeom,
    Cube: CubeGeom,
    Sphere: SphereGeom,
    Sprite: SpriteGeom,
}

const LINE_TYPE_TO_CONSTRUCTOR = {
    Line : StraightLineGeom,
    Arc: ArcedLineGeom,
}

export default function(maxParticleCount, sceneParams) {

    const particlesData = new ParticlesData(maxParticleCount, R);
    const linesData = new LinesData(maxParticleCount);

    const group = new THREE.Group();
    group.add(createBoxHelper(R));
    
    
    // add globe
    let globe = createGlobe();
    group.add(globe);

    let particleGeom = createParticleGeometry(sceneParams);
    let pointCloud = particleGeom.createPointCloud(sceneParams, particlesData);

    group.add(pointCloud);

    let lineGeom = createLineGeometry(sceneParams);
    let lineCloud = lineGeom.createLineCloud(sceneParams, linesData);
    group.add(lineCloud);

    group.showLineMesh = value => lineGeom.lineCloud.visible = value;
    group.showPointCloud = value => pointCloud.visible = value;

    group.animate = function() {
        const numConnected = particlesData.connectPoints(linesData, sceneParams);

        const lineType = sceneParams.lineGeometry;
        if (lineType != sceneParams.oldLineGeometry) {
            group.remove(lineCloud);

            lineGeom = createLineGeometry(sceneParams);
            lineCloud = lineGeom.createLineCloud(sceneParams, linesData);

            group.add(lineCloud);
            sceneParams.oldLineGeometry = lineType;
        }

        lineGeom.renderLineCloud(sceneParams, linesData, numConnected);

        const particleType = sceneParams.particleGeometry;
        if (particleType != sceneParams.oldParticleGeometry) {
            group.remove(pointCloud);

            particleGeom = createParticleGeometry(sceneParams);
            pointCloud = particleGeom.createPointCloud(sceneParams, particlesData);

            group.add(pointCloud);
            sceneParams.oldParticleGeometry = particleType;
        }

        particleGeom.renderPointCloud(sceneParams, particlesData);

        globe.render(sceneParams);

        // auto rotate if needed
        const rotateSpeed = sceneParams.autoRotateSpeed;
        if (rotateSpeed > 0) {
            group.rotation.y += rotateSpeed / 100.0;
        }
    }

    return group;
}

function createParticleGeometry(sceneParams) {
    const constructor = POINT_TYPE_TO_CONSTRUCTOR[sceneParams.particleGeometry];
    if (!constructor) {
        throw new Error("Invalid particle type: " + sceneParams.particleGeometry);
    }
    return new constructor();
}

function createLineGeometry(sceneParams) {
    const constructor = LINE_TYPE_TO_CONSTRUCTOR[sceneParams.lineGeometry];
    if (!constructor) {
        throw new Error("Invalid line type: " + sceneParams.lineGeometry);
    }
    return new constructor();
}

function createBoxHelper(r) {
    const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxBufferGeometry( r, r, r ) ) );
    helper.material.color.setHex( 0x101010 );
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;
    return helper;
}

// See https://github.com/turban/webgl-earth
function createGlobe() {

    // Earth params
    const radius = 1;
    const segments = 32;
    const rotation = 6;

    const globeGroup = new THREE.Group();

    var sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation; 
    globeGroup.add(sphere)

    var clouds = createClouds(radius, segments);
    clouds.rotation.y = rotation;
    globeGroup.add(clouds)

    //var stars = createStars(90, 64);
    //globeGroup.add(stars);

    globeGroup.render = function(sceneParams) {
        const r = sceneParams.globeRadius;
        sphere.scale.set(r, r, r);
    }

    return globeGroup;


    function createSphere(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshPhongMaterial({
                map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
                bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
                bumpScale:   0.005,
                specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
                specular:    new THREE.Color('grey')                                
            })
        );
    }

    function createClouds(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius + 0.003, segments, segments),            
            new THREE.MeshPhongMaterial({
                map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
                transparent: true
            })
        );        
    }

    function createStars(radius, segments) {
        return new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments), 
            new THREE.MeshBasicMaterial({
                map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
                side: THREE.BackSide
            })
        );
    }
}
    
