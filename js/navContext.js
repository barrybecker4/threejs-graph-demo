import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'https://unpkg.com/three@0.123.0/examples/jsm/webxr/VRButton.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.js';
import PickHelper from './PickHelper.js';


const ENABLE_VR = true;

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


    // Show performance stats (like FPS). See https://github.com/mrdoob/stats.js/
    let stats = new Stats();
    stats.showPanel(0); // FPS
    document.body.appendChild( stats.dom );

    // Add VR Button if enabled
    if (ENABLE_VR) {
        document.body.appendChild( VRButton.createButton( renderer ) );
        renderer.xr.enabled = true;
    }

    window.addEventListener('resize', onWindowResize, false );

/*
    console.log("cookiesEnabled is " + navigator.cookieEnabled);
    console.log("navigator.appName is " + navigator.appName);

    const xrSession = window.navigator.xr.requestSession('immersive-vr', {
        // 3DoF
        requiredFeatures: ['local-floor'],
        // 6 DoF
        optionalFeatures: ['bounded-floor']
    });

    let inputSources = xrSession.getInputSources();
    for (let inputSource of inputSources) {
        let inputPose = xrFrame.getInputPose(inputSource, this._referenceSpace);
        console.log("inputSrc: " + JSON.stringify(inputSource) + "\npose: " + JSON.stringify(inputPos));
    }*/


    const my = {};

    my.render = function() {
        stats.update();
        pickHelper.pick(sceneRoot, camera, controls);

        if (ENABLE_VR) {
            renderer.setAnimationLoop(function () {
                renderer.render(scene, camera);
            });
        } else {
            renderer.render(scene, camera);
        }
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
    const intensity = 0.2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(10, -20, -40);
    light.target.position.set(0, 0, 0);
    camera.add(light);

    return camera;
}

function createScene() {
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
    scene.background = new THREE.Color(FOG_COLOR);

    scene.add(new THREE.AmbientLight(0xffffff, .1));
    scene.add(createDirectionalLight(-1000, 2000, 4000));

    return scene;
}

function createDirectionalLight(xpos, ypos, zpos) {
    const color = 0xFFFFFF;
    const intensity = 0.9;
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
