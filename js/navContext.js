import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.js';

// Field of View. Camera frustum vertical field, from bottom to top of view, in degrees.
// The larger this is the more extreme is perspective distortion.
const FOV = 45;

// Camera frustum aspect ratio. Usually the canvas width / canvas height.
const ASPECT_RATIO = window.innerWidth / window.innerHeight;

// Camera frustum near clipping plane.
const NEAR_CLIP = 1;

// Camera frustum far clipping plane.
const FAR_CLIP = 4000;

export default function(containerId) {

    const container = document.getElementById(containerId);
    const camera = createCamera()
    const scene = createScene();
    const renderer = createRenderer();
    const controls = createOrbitControls(camera, container);
    container.appendChild(renderer.domElement);

    let stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );

    const my = {};

    my.render = function() {
        stats.update();
        renderer.render(scene, camera);
    }

    my.add = function(group) {
        scene.add(group);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return my;
};

function createCamera() {
    const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR_CLIP, FAR_CLIP);
    camera.position.z = 1750;
    return camera;
}

function createScene() {
    const scene = new THREE.Scene();
    {
      const near = 500;
      const far = 3000;
      const color = '#112233'; // 'lightblue';
      //const density = 0.0004;
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    }
    return scene;
}

function createOrbitControls(camera, container) {
    const controls = new OrbitControls(camera, container);
    controls.minDistance = 500;
    controls.maxDistance = FAR_CLIP - 500;
    return controls;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
}
