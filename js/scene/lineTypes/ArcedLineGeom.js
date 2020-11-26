import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import LineGeom from './LineGeom.js';

const LINE_MATERIAL = new THREE.LineBasicMaterial( {
    color: 0xAB3BBB,
    linewidth: 3,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
});


export default class ArcedLineGeom extends LineGeom {

    createLineCloud(sceneParams, linesData) {
        if (!this.lineGeometry) {
            this.lineGeometry = createLineGeometry(linesData);
        }
        this.lineCloud = new THREE.LineSegments(lineGeometry, LINE_MATERIAL);
        return this.lineCloud;
    }

    renderLineCloud(numConnected) {
        const geom = this.lineCloud.geometry;
        geom.setDrawRange(0, numConnected * 2);
        geom.attributes.position.needsUpdate = true;
        geom.attributes.color.needsUpdate = true;
    }
}

function createLineGeometry(linesData) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',
        new THREE.BufferAttribute( linesData.positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    geometry.setAttribute('color',
        new THREE.BufferAttribute( linesData.colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );
    //geometry.computeBoundingSphere();
    geometry.setDrawRange( 0, 0 );
    return geometry;
}