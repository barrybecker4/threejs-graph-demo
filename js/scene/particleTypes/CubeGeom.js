import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticleGeom from './ParticleGeom.js';

const CUBE_MATERIAL = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: 0x44cc99,
    specular: 0xaaffff,
    shininess: 1,
    vertexColors: false,
});


export default class CubeGeom extends ParticleGeom {

    constructor() {
        super();
    }

    createPointCloud(sceneParams, particles, particlesData) {

        const pointCloud = new THREE.Group();
        const geometry = new THREE.BoxBufferGeometry(3, 3, 3);

        for ( let i = 0; i < particlesData.data.length; i ++ ) {

            const object = new THREE.Mesh(geometry, CUBE_MATERIAL);

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

        this.pointCloud = pointCloud;
        return this.pointCloud;
    }

}