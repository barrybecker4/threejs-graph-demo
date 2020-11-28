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
const FOG_NEAR = 500;
const FOG_FAR = 4000;

export default function(containerId) {

    const container = document.getElementById(containerId);
    const camera = createCamera();
    const scene = createScene();
    let sceneRoot = null;
    scene.add(camera); // needed if camera has light source
    const renderer = createRenderer(container);
    const pickHelper = new PickHelper(container);
    pickHelper.setPickLayer(1);
    const controls = createOrbitControls(camera, container);
    let oldMousePosition = null;

    // Show performance stats (like FPS). See https://github.com/mrdoob/stats.js/
    let stats = new Stats();
    stats.showPanel(0); // FPS
    document.body.appendChild( stats.dom );

    window.addEventListener('resize', onWindowResize, false );

    // Need to use pointerup/down because OrbitControls call preventDefault on mouseup/down.
    window.addEventListener('pointerdown', evt => {
        console.log(JSON.stringify(oldMousePosition));
        oldMousePosition = { x: evt.clientX, y: evt.clientY };
    });
    window.addEventListener('pointerup', evt => {
        if (evt.clientX === oldMousePosition.x && evt.clientY === oldMousePosition.y) {
            pickHelper.pickedPosition(evt);
        }
    });

    const my = {};

    my.render = function() {
        stats.update();
        pickHelper.pick(sceneRoot, camera, controls);

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
    const intensity = 0.3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    light.target.position.set(0, 0, 0);
    camera.add(light);

    return camera;
}

function createScene() {
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
    scene.background = new THREE.Color(FOG_COLOR);

    scene.add(new THREE.AmbientLight(0xffffff, .2));
    scene.add(createDirectionalLight(-1000, 2000, 4000));

    return scene;
}

function createDirectionalLight(xpos, ypos, zpos) {
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(xpos, ypos, zpos);
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
