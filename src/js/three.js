const THREE = require('three');
const GEOMETRY = {
    'BOX': new THREE.BoxGeometry(0.2, 0.2, 0.2),
    'CONE': new THREE.ConeGeometry( 0.2, 0.2, 3 ),
    'CYLINDER': new THREE.CylinderGeometry( 0.15, 0.15, 0.2, 32 )};

let camera, scene, renderer, additionalRenderer;
let geometry, material, mesh;

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
    document.querySelectorAll('.btn-bar__tab-radio')
        .forEach(e => e.addEventListener('change', changeGeometry));
}

function changeGeometry({target}) {
    scene.remove(...scene.children);

    geometry = GEOMETRY[target.value.toUpperCase()];
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
    additionalRenderer.render(scene, camera);
}

function onWindowResize(model) {
    camera.updateProjectionMatrix();

    renderer.setSize(model.clientWidth, model.clientHeight);
    additionalRenderer.setSize(additionalModel.clientWidth, additionalModel.clientHeight);
}

module.exports = {
    init,
    animate
}