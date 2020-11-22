import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import ParticleGeom from './ParticleGeom.js';

const map = new THREE.TextureLoader().load( './images/appliance-icon.png' );
const SPRITE_MATERIAL = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );;


export default class CubeGeom extends ParticleGeom {

    constructor() {
        super();
    }

    createPointCloud(sceneParams, particlesData) {

        const pointCloud = new THREE.Group();

        for (let i = 0; i < particlesData.data.length; i ++) {

            const object = new THREE.Sprite(SPRITE_MATERIAL);
            object.scale.set(2, 2, 1);

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