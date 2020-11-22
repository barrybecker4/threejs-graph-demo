import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

export default class PickHelper {

    constructor(container) {
        this.container = container;
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = null;
        this.pickPosition = null;
    }

    pick(sceneRoot, camera) {
        if (!this.pickPosition) return;

        // restore the color if there is a picked object
        if (this.pickedObject) {
            this.pickedObject.material.color.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }

        // cast a ray through the frustum
        this.raycaster.setFromCamera(this.pickPosition, camera);
        // get the list of objects the ray intersected
        const intersectedObjects = this.raycaster.intersectObjects(sceneRoot.children, true);

        if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            this.pickedObject = intersectedObjects[0].object;
            // save its color
            const material = this.pickedObject.material;
            this.pickedObjectSavedColor = material.color.getHex();
            console.log("color = " + JSON.stringify(material.color));
            material.color.setHex(0xFFFF77);
        }
        this.pickPosition = undefined;
    }

    static getCanvasRelativePosition(event, container) {
        const rect = container.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * container.width  / rect.width,
            y: (event.clientY - rect.top ) * container.height / rect.height,
        };
    }

    calcPickedPosition(event) {
        const pos = PickHelper.getCanvasRelativePosition(event, this.container);
        this.pickPosition = {
            x: (pos.x / this.container.width ) *  2 - 1,
            y: (pos.y / this.container.height) * -2 + 1,  // flipped y
        }
    }

}


