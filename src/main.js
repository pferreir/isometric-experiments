import {ViewportManager} from './viewport';
import {World} from './world';
import {BoxGeometry, MeshPhongMaterial, Mesh, DoubleSide, FlatShading} from 'three';


let vpm = new ViewportManager(document.body, window, {
    width: 600,
    height: 600
});

let world = new World(vpm);

vpm.setCameraPosition({x: -100, y: 100, z: 100});

let material = new MeshPhongMaterial({
    color: 0x891522,
    emissive: 0x072534,
    side: DoubleSide,
    shading: FlatShading
});

let cube = new Mesh(new BoxGeometry(4, 4, 4), material);
cube.position.set(0, 2, 0);
cube.castShadow = true;
world.addToScene(cube);

vpm.registerRenderCallback(() => {
});
