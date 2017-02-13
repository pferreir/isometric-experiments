import {OrthographicCamera, Scene, WebGLRenderer, Vector2, Raycaster} from 'three';
import Stats from 'stats.js';


export class ViewportManager {
    constructor(elem, wndw, config) {
        this.window = wndw;
        this.width = config.width;
        this.height = config.height;

        this.renderer = new WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xf0f0f0, 1);
        this.renderer.setPixelRatio(wndw.devicePixelRatio);
        this.renderer.setSize(config.width, config.height);
        this.renderCallbacks = [];
        this.mouseCallbacks = [];
        this.clickCallbacks = [];
        this.renderer.shadowMap.enabled = true;

        this.scene = new Scene();
        this.camera = new OrthographicCamera(-config.width / 20, config.width / 20,
                                             config.height / 20, -config.height / 20, 0.1, 1000);
        this.stats = new Stats();
        elem.appendChild(this.stats.dom);
        elem.appendChild(this.renderer.domElement);

        const raycaster = new Raycaster();

        wndw.addEventListener('mousemove', ((event) => {
            const mousePos = this.positionFromEvent(event);

            if (!mousePos) {
                return;
            }

            raycaster.setFromCamera(mousePos, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);

            if (intersects.length) {
                for (const callback of this.mouseCallbacks) {
                    callback(intersects[0].object, intersects[0].face, mousePos);
                }
            }
        }).bind(this));

        wndw.addEventListener('click', ((event) => {
            const mousePos = this.positionFromEvent(event);

            if (!mousePos) {
                return;
            }

            raycaster.setFromCamera(mousePos, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);

            if (intersects.length) {
                for (const callback of this.clickCallbacks) {
                    callback(intersects[0].object, intersects[0].face, mousePos);
                }
            }
        }).bind(this));

        this.render();
    }

    positionFromEvent(event) {
        const mousePos = new Vector2();
        mousePos.x = (event.clientX / this.width) * 2 - 1;
        mousePos.y = -(event.clientY / this.height) * 2 + 1;

        if (Math.abs(mousePos.x) > 1 || Math.abs(mousePos.y) > 1) {
            return null;
        }
        return mousePos;
    }

    setCameraPosition(position) {
        Object.assign(this.camera.position, position);
        this.camera.lookAt(this.scene.position);
    }

    registerRenderCallback(callback) {
        this.renderCallbacks.push(callback);
    }

    registerMouseCallback(callback) {
        this.mouseCallbacks.push(callback);
    }

    registerClickCallback(callback) {
        this.clickCallbacks.push(callback);
    }

    render() {
        this.window.requestAnimationFrame(this.render.bind(this));

        this.stats.begin();
        for (const callback of this.renderCallbacks) {
            callback(this);
        }
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    addToScene(object) {
        this.scene.add(object);
    }
}
