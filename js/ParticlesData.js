import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';


export default class ParticleData {

    constructor(maxParticleCount, r) {
        const data = [];
        const positions = new Float32Array( maxParticleCount * 3 );
        const randomSpeed = () => - 1 + Math.random() * 2;

        for ( let i = 0; i < maxParticleCount; i ++ ) {

            const x = Math.random() * r - r / 2;
            const y = Math.random() * r - r / 2;
            const z = Math.random() * r - r / 2;

            const ii = 3 * i;
            positions[ ii ] = x;
            positions[ ii + 1 ] = y;
            positions[ ii + 2 ] = z;

            // add it to the geometry
            data.push({
                velocity: new THREE.Vector3( randomSpeed(), randomSpeed(), randomSpeed()),
                numConnections: 0,
            });
        }

        this.r = r;
        this.rHalf = r / 2.0;
        this.data = data;
        this.positions = positions;
    }

    get(i) {
       return this.data[i];
    }

    getPoint(i) {
        const positions = this.positions;
        return { x: positions[i], y: positions[i + 1], z: positions[i + 2]};
    }

    updatePositionAndVelocity(i, speedFactor) {
        const positions = this.positions;
        const velocity = this.data[i].velocity;
        const ii = 3 * i;
        const rHalf = this.rHalf;

        positions[ ii ] += velocity.x * speedFactor;
        positions[ ii + 1 ] += velocity.y * speedFactor;
        positions[ ii + 2 ] += velocity.z * speedFactor;

        if ( positions[ ii + 1 ] < -rHalf || positions[ ii + 1 ] > rHalf )
            velocity.y = -velocity.y;

        if ( positions[ ii ] < -rHalf || positions[ ii ] > rHalf )
            velocity.x = -velocity.x;

        if ( positions[ ii + 2 ] < -rHalf || positions[ ii + 2 ] > rHalf )
            velocity.z = -velocity.z;
    }

}