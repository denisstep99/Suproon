const THREE = require('three');
const GEOMETRY = {
    'BOX': new THREE.BoxGeometry(0.2, 0.3, 0.2),
    'CONE': new THREE.ConeGeometry(0.2, 0.2, 3),
    'CYLINDER': new THREE.CylinderGeometry(0.15, 0.15, 0.2, 32)
};

let camera, scene, renderer, additionalRenderer;
let geometry, material, mesh;

const buttons = {
    isRightButtonPressed: false,
    isLeftButtonPressed: false,
    isScalePlusButtonPressed: false,
    isScaleMinusButtonPressed: false,
    isTopButtonPressed: false,
    isBottomButtonPressed: false,
}

function init(model, additionalModel) {
    camera = new THREE.PerspectiveCamera(70, model.clientWidth / model.clientHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(model.clientWidth, model.clientHeight);

    additionalRenderer = new THREE.WebGLRenderer({antialias: true});
    additionalRenderer.setSize(additionalModel.clientWidth, additionalModel.clientHeight);
    console.log(additionalModel.clientWidth)

    model.appendChild(renderer.domElement);
    additionalModel.appendChild(additionalRenderer.domElement);


    window.addEventListener('resize', onWindowResize.bind(null, model), false);
    document.querySelectorAll('.btn-bar_side_left .btn-bar__tab-radio')
        .forEach(e => e.addEventListener('change', changeGeometry));
    checkControlButtons();

    window.addEventListener('switch-button--clicked', function ({detail}) {
        console.log(1)
        if (detail.value === "main-view") {
            console.log(model.clientWidth)
            camera.aspect = model.clientWidth / model.clientHeight;
            camera.updateProjectionMatrix();
        } else {
            camera.aspect = additionalModel.clientWidth / additionalModel.clientHeight;
            camera.updateProjectionMatrix();
        }
    })
}

function changeGeometry({target} = {target: "box"}, name) {
    scene.remove(...scene.children);

    if (!name) {
        geometry = GEOMETRY[target.value.toUpperCase()];
    } else {
        console.log(1)
        geometry = GEOMETRY[name.toUpperCase()];
    }
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function animate() {
    requestAnimationFrame(animate);
    if (buttons.isRightButtonPressed) {
        rotateRight();
    }
    if (buttons.isLeftButtonPressed) {
        rotateLeft();
    }
    if (buttons.isScaleMinusButtonPressed) {
        scaleMinus();
    }
    if (buttons.isScalePlusButtonPressed) {
        scalePlus();
    }
    if (buttons.isTopButtonPressed) {
        rotateTop();
    }
    if (buttons.isBottomButtonPressed) {
        rotateBottom();
    }

    renderer.render(scene, camera);
    additionalRenderer.render(scene, camera);
}

function fingerRotate(data, lastData) {
    if (data.x - lastData.x >= 2) {
        rotateLeft()
        console.log("rotateLeft")
    } else if (data.x - lastData.x <= -5) {
        rotateRight()
        console.log("rotateRight")
    }
    if (data.y - lastData.y >= 5) {
        rotateBottom()
        console.log("rotateBottom")
    } else if (data.y - lastData.y <= -5) {
        rotateTop()
        console.log("rotateTop")
    }
    console.log(data.x - lastData.x)
}

function fistMove(data, lastData) {
    if (data.x - lastData.x >= 5) {
        moveLeft()
        console.log("moveLeft")
    } else if (data.x - lastData.x <= -5) {
        moveRight()
        console.log("moveRight")
    }
    if (data.y - lastData.y >= 5) {
        moveForward()
        console.log("moveForward")
    } else if (data.y - lastData.y <= -5) {
        moveBackward()
        console.log("moveBackward")
    }
    console.log(data.x - lastData.x)
}

function twoScale(data, lastData) {
    if (data.y - lastData.y >= 5) {
        scalePlus()
        console.log("scalePlus")
    } else if (data.y - lastData.y <= -5) {
        scaleMinus()
        console.log("scaleMinus")
    }
}

function moveForward() {
    mesh.position.y += 0.03
}

function moveBackward() {
    mesh.position.y -= 0.03
}

function moveLeft() {
    mesh.position.x -= 0.03
}

function moveRight() {
    mesh.position.x += 0.03
}

function updatePosition() {
    mesh.position.x = mesh.position.y = 0;
    mesh.rotation.x = mesh.rotation.y = 0;
}

function rotateBottom() {
    mesh.rotation.x += 0.06;
}

function rotateTop() {
    mesh.rotation.x -= 0.06;
}

function rotateRight() {
    mesh.rotation.y += 0.06;
}

function rotateLeft() {
    mesh.rotation.y -= 0.06;
}

function scalePlus() {
    camera.fov -= 2;
    camera.updateProjectionMatrix();
}

function scaleMinus() {
    camera.fov += 2;
    camera.updateProjectionMatrix();
}

function checkControlButtons() {
    document.querySelectorAll(".btn-bar_side_right .btn-bar__button").forEach(element => {
        element.addEventListener('mousedown', (event) => {
            buttons[`is${element.dataset.type}Pressed`] = true;
            console.log(element.dataset.type);
            event.stopPropagation();
        });
    });
    document.addEventListener('mouseup', () => {
        Object.keys(buttons).forEach(key => buttons[key] = false);
    });
}

// Небольшой баг, если изменить размер с камерой на главном, а потом переключить, модель обрежется.
function onWindowResize(model) {
    if (model.clientWidth) {
        renderer.setSize(model.clientWidth, model.clientHeight);
        camera.aspect = model.clientWidth / model.clientHeight;
        camera.updateProjectionMatrix();
    }
}

module.exports = {
    init,
    animate,
    actions: {
        rotateBottom,
        rotateLeft,
        rotateRight,
        rotateTop,
        scaleMinus,
        scalePlus,
        fingerRotate,
        fistMove,
        updatePosition,
        changeGeometry,
        twoScale
    }
}
