

export default class ParticleGeom {

    createPointCloud(sceneParams, particlesData) {
    }

    renderPointCloud(sceneParams, particlesData) {
        const scale = sceneParams.particleSize;
        const thickness = sceneParams.atmosphereThickness;
        const rad = sceneParams.globeRadius;

        const childObjects = this.pointCloud.children;

        for ( let i = 0; i < childObjects.length; i ++ ) {
            const object = childObjects[i];

            object.visible = i < sceneParams.particleCount;
            if (object.visible) {
                const pt = particlesData.getPoint(i);

                // adjust by globeRadius and atmosphereThickness

                // first find unit vector and magnitude
                // point will be unitVec * globeRadius + unitVec * magnitude * atmosphereThickness

                const magnitude = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z);
                const unitVec = { x: pt.x / magnitude, y: pt.y / magnitude, z: pt.z / magnitude };
                const r = rad + magnitude * thickness;

                object.position.x = unitVec.x * r;
                object.position.y = unitVec.y * r;
                object.position.z = unitVec.z * r;

                object.scale.x = scale;
                object.scale.y = scale;
                object.scale.z = scale;
            }
        }
    }
}