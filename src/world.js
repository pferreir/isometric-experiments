import {AmbientLight, BufferGeometry, BufferAttribute, DirectionalLight, FlatShading,
        MeshPhongMaterial, VertexColors, Mesh, MeshBasicMaterial, PlaneGeometry} from 'three';

export class World {
    constructor(vpm) {
        this.viewpointMgr = vpm;
        this.build();
    }

    drawTerrain() {
        const startX = -10;
        const endX = 10;
        const startZ = -10;
        const endZ = 10;
        const numTiles = Math.abs(endX - startX) * Math.abs(endZ - startZ);

        const geometry = new BufferGeometry();
        const vertices = new Float32Array(numTiles * 4 * 3);
        const indices = new Uint16Array(numTiles * 2 * 3);
        const colors = new Float32Array(numTiles * 4 * 3);
        const normals = new Float32Array(numTiles * 4 * 3);
        const uvs = new Float32Array(numTiles * 4 * 2);

        let i = 0;
        let j = 0;
        for (let x = startX; x < endX; x++) {
            for (let z = startZ; z < endZ; z++) {
                vertices[i * 3] = x * 4 - 2;
                vertices[i * 3 + 1] = 0;
                vertices[i * 3 + 2] = z * 4 - 2;

                vertices[(i + 1) * 3] = (x + 1) * 4 - 2;
                vertices[(i + 1) * 3 + 1] = 0;
                vertices[(i + 1) * 3 + 2] = z * 4 - 2;

                vertices[(i + 2) * 3] = x * 4 - 2;
                vertices[(i + 2) * 3 + 1] = 0;
                vertices[(i + 2) * 3 + 2] = (z + 1) * 4 - 2;

                vertices[(i + 3) * 3] = (x + 1) * 4 - 2;
                vertices[(i + 3) * 3 + 1] = 0;
                vertices[(i + 3) * 3 + 2] = (z + 1) * 4 - 2;

                for (let c = 0; c < 4; ++c) {
                    normals[(i + c) * 3] = 0;
                    normals[((i + c) * 3) + 1] = 1;
                    normals[((i + c) * 3) + 2] = 0;
                }

                indices[j++] = i + 0;
                indices[j++] = i + 2;
                indices[j++] = i + 1;

                indices[j++] = i + 1;
                indices[j++] = i + 2;
                indices[j++] = i + 3;

                for (let c = 0; c < 4; ++c) {
                    colors[(i + c) * 3] = 0.4;
                    colors[(i + c) * 3 + 1] = 0.4;
                    colors[(i + c) * 3 + 2] = 0.4;
                }

                i += 4;
            }
        }

        geometry.dynamic = true;
        geometry.addAttribute('position', new BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new BufferAttribute(colors, 3));
        geometry.addAttribute('normal', new BufferAttribute(normals, 4));
        geometry.addAttribute('uv', new BufferAttribute(uvs, 4));
        geometry.setIndex(new BufferAttribute(indices, 1));

        //geometry.computeVertexNormals();

        const material = new MeshPhongMaterial({
            emissive: 0x072534,
            shading: FlatShading,
            vertexColors: VertexColors,
            wireframe: false
        });

        const terrain = new Mesh(geometry, material);
        terrain.receiveShadow = true;
        return terrain;
    }

    build() {
        var ambientLight = new AmbientLight(0xffffff, 1);
        this.addToScene(ambientLight);

        let light = new DirectionalLight(0xffffff, 0.5);
        light.position.set(-20, 10, -20);
        light.castShadow = true;
        this.addToScene(light);

        const terrain = this.drawTerrain();
        this.addToScene(terrain);

        const overlayMaterial = new MeshBasicMaterial({
            color: 0xdddddd,
            shading: FlatShading,
            wireframe: false,
            opacity: 0.3,
            transparent: true
        });

        const overlayGeometry = new PlaneGeometry(4, 4);

        this.overlay = new Mesh(overlayGeometry, overlayMaterial);
        this.overlay.visible = false;
        this.overlay.rotateX(-Math.PI / 2);
        this.addToScene(this.overlay);

        this.viewpointMgr.registerMouseCallback(((obj, face) => {
            if (obj == terrain) {
                const attr = terrain.geometry.getAttribute('position');
                const x = Math.round((attr.getX(face.a) + attr.getX(face.b) + attr.getX(face.c)) / 12);
                const z = Math.round((attr.getZ(face.a) + attr.getZ(face.b) + attr.getZ(face.c)) / 12);
                this.highlightCells(x, z, 2, 2);
            }
        }).bind(this));

        this.viewpointMgr.registerClickCallback(((obj, face) => {
        }).bind(this));

    }

    highlightCells(x, z, dx, dz) {
        this.overlay.visible = true;
        this.overlay.position.x = (x + (dx - 1) / 2) * 4;
        this.overlay.position.y = 0.001 ;
        this.overlay.position.z = (z - (dz - 1) / 2) * 4;
        this.overlay.scale.set(dx, dz, 1);
    }

    addToScene(obj) {
        return this.viewpointMgr.addToScene(obj);
    }
}
