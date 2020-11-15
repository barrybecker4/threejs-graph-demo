

export default class LinesData {

    constructor(maxParticleCount) {
        const maxLines = maxParticleCount * maxParticleCount;

        this.positions = new Float32Array( maxLines * 3 );
        this.colors = new Float32Array( maxLines * 3 );
    }

    updatePositions(vertexpos, pti, ptj) {
        const positions = this.positions;
        positions[ vertexpos++ ] = pti.x;
        positions[ vertexpos++ ] = pti.y;
        positions[ vertexpos++ ] = pti.z;

        positions[ vertexpos++ ] = ptj.x;
        positions[ vertexpos++ ] = ptj.y;
        positions[ vertexpos++ ] = ptj.z;
        return vertexpos;
    }

    updateColors(colorpos, alpha) {
        for (let i = 0; i < 6; i++) {
            this.colors[ colorpos + i ] = alpha;
        }
        return colorpos + 6;
    }
}