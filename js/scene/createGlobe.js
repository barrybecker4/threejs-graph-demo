import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

// See https://github.com/turban/webgl-earth
export default function() {

    // Earth params
    const radius = 1;
    const segments = 32;
    const rotation = 6;

    const globeGroup = new THREE.Group();

    const sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    globeGroup.add(sphere)

    const clouds = createClouds(radius, segments);
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
};



