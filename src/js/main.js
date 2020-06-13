require('./socket');
const threeModule = require('./three');


const model = document.querySelector('.model');
const additionalModel = document.querySelector('.additional-model');

function getSwitchButtonHandler(mainVideo, additionalVideo) {
    return function switchButtonClickHandler(e) {
        if (e.target.checked) {
            [mainVideo, model, additionalVideo].map(e => e.classList.toggle('hidden'));
            window.dispatchEvent(new CustomEvent('switch-button--clicked', {detail: {value: e.target.value}}));
        }
    }
}

function cameraStreamRegister() {
    const mainVideo = document.querySelector('.main-video');
    const additionalVideo = document.querySelector('.additional-video');

    document.querySelectorAll('.viewer__tab-radio')
        .forEach(e => e.addEventListener('change', getSwitchButtonHandler(mainVideo, additionalVideo)));
}

window.addEventListener('camera-stream--found', cameraStreamRegister);

threeModule.init(model, additionalModel);
threeModule.animate();
