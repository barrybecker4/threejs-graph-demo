import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticleGeom from './ParticleGeom.js';

const SPHERE_MATERIAL = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: 0x22bb99,
    specular: 0xaa55ff,
    shininess: 5,
    vertexColors: false,
});


export default class CubeGeom extends ParticleGeom {

    createPointCloud(sceneParams, particlesData) {

        const pointCloud = new THREE.Group();
        const geometry = new THREE.SphereBufferGeometry( 2, 16, 16 );

        for ( let i = 0; i < particlesData.data.length; i ++ ) {

            const object = new THREE.Mesh(geometry, SPHERE_MATERIAL);

            const pt = particlesData.getPoint(i);
            object.position.x = pt.x;
            object.position.y = pt.y;
            object.position.z = pt.z;
            object.visible = i < sceneParams.particleCount;

            object.scale.x = 1;
            object.scale.y = 1;
            object.scale.z = 1;

            pointCloud.add( object );
        }
        this.pointCloud = pointCloud;
        return this.pointCloud;
    }

}