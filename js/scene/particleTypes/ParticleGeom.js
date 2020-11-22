

export default class ParticleGeom {

    constructor() {
    }

    createPointCloud(sceneParams, particlesData) {
    }

    renderPointCloud(sceneParams, particlesData) {
        const scale = sceneParams.particleSize;
        const childObjects = this.pointCloud.children;

        for ( let i = 0; i < childObjects.length; i ++ ) {
            const object = childObjects[i];

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
    }
}