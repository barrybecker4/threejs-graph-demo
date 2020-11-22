import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.js';
import PickHelper from './PickHelper.js';


// Field of View. Camera frustum vertical field, from bottom to top of view, in degrees.
// The larger this is the more extreme is perspective distortion.
const FOV = 30;

// Camera frustum aspect ratio. Usually the canvas width / canvas height.
const ASPECT_RATIO = window.innerWidth / window.innerHeight;

// Camera frustum near clipping plane.
const NEAR_CLIP = 1;

// Camera frustum far clipping plane.
const FAR_CLIP = 4000;

const FOG_COLOR = '#041421';

export default function(containerId) {

    const container = document.getElementById(containerId);
    const camera = createCamera()
    const scene = createScene();
    let sceneRoot = null;
    scene.add(camera); // needed if camera has light source
    const renderer = createRenderer(container);
    const pickHelper = new PickHelper(container);
    const controls = createOrbitControls(camera, container);

    // Show performance stats (like FPS). See https://github.com/mrdoob/stats.js/
    let stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener('resize', onWindowResize, false );
    window.addEventListener('click', evt => pickHelper.calcPickedPosition(evt));

    const my = {};

    my.render = function() {
        stats.update();
        pickHelper.pick(sceneRoot, camera);
        renderer.render(scene, camera);
    }

    my.setSceneRoot = function(newSceneRoot) {
        if (sceneRoot) {
            scene.remove(sceneRoot)
        }
        sceneRoot = newSceneRoot;
        scene.add(newSceneRoot);
    }

    my.getScene = function() {
        return scene;
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

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    light.target.position.set(0, 0, 0);
    camera.add(light);

    return camera;
}

function createScene() {
    const scene = new THREE.Scene();

    const near = 500;
    const far = 3000;
    scene.fog = new THREE.Fog(FOG_COLOR, near, far);
    scene.background = new THREE.Color(FOG_COLOR);

    const light = createDirectionalLight();
    scene.add(light);

    return scene;
}

function createDirectionalLight() {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    light.target.position.set(0, 0, 0);
    return light;
}

function createOrbitControls(camera, container) {
    const controls = new OrbitControls(camera, container);
    controls.minDistance = 500;
    controls.maxDistance = FAR_CLIP - 500;
    return controls;
}

function createRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    return renderer;
}
