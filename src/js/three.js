const THREE = require('three');
const GEOMETRY = {
    'BOX': new THREE.BoxGeometry(0.2, 0.3, 0.2),
    'CONE': new THREE.ConeGeometry( 0.2, 0.2, 3 ),
    'CYLINDER': new THREE.CylinderGeometry( 0.15, 0.15, 0.2, 32 )};

let camera, scene, renderer, additionalRenderer;
let geometry, material, mesh;

const buttons = {
    isRightButtonPressed: false,
    isLeftButtonPressed: false,
    isScalePlusButtonPressed: false,
    isScaleMinusButtonPressed: false
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

    model.appendChild(renderer.domElement);
    additionalModel.appendChild(additionalRenderer.domElement);


    window.addEventListener('resize', onWindowResize.bind(null, model), false);
    document.querySelectorAll('.btn-bar_side_left .btn-bar__tab-radio')
        .forEach(e => e.addEventListener('change', changeGeometry));
    checkControlButtons();
}

function changeGeometry({target}) {
    scene.remove(...scene.children);

    geometry = GEOMETRY[target.value.toUpperCase()];
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

    renderer.render(scene, camera);
    additionalRenderer.render(scene, camera);
}

function scalePlus() {
    camera.fov--;
    camera.updateProjectionMatrix();
}

function scaleMinus() {
    camera.fov++;
    camera.updateProjectionMatrix();
}

function rotateRight() {
    mesh.rotation.y += 0.01;
}

function rotateLeft() {
    mesh.rotation.y -= 0.01;
}

function checkControlButtons() {
    document.querySelector(".btn-bar__label_type_rotation-right").addEventListener('mousedown', () => {
        buttons.isRightButtonPressed = true;
    });
    document.querySelector(".btn-bar__label_type_rotation-right").addEventListener('mouseup', () => {
        buttons.isRightButtonPressed = false;
    });
    document.querySelector(".btn-bar__label_type_rotation-left").addEventListener('mousedown', () => {
        buttons.isLeftButtonPressed = true;
    });
    document.querySelector(".btn-bar__label_type_rotation-left").addEventListener('mouseup', () => {
        buttons.isLeftButtonPressed = false;
    });
    document.querySelector(".btn-bar__label_type_scale-plus").addEventListener('mousedown', () => {
        buttons.isScalePlusButtonPressed = true;
    });
    document.querySelector(".btn-bar__label_type_scale-plus").addEventListener('mouseup', () => {
        buttons.isScalePlusButtonPressed = false;
    });
    document.querySelector(".btn-bar__label_type_scale-minus").addEventListener('mousedown', () => {
        buttons.isScaleMinusButtonPressed = true;
    });
    document.querySelector(".btn-bar__label_type_scale-minus").addEventListener('mouseup', () => {
        buttons.isScaleMinusButtonPressed = false;
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
    animate
}
