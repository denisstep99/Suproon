require('./socket');
const threeModule = require('./three');


const model = document.querySelector('.model');
const additionalModel = document.querySelector('.additional-model');

function getSwitchButtonHandler(cameraStream, mainVideo, additionalVideo) {
    return function switchButtonClickHandler(e) {
        if (e.target.checked) {
            [mainVideo, model, additionalVideo].map(e => e.classList.toggle('hidden'));
        }
    }
}

function cameraStreamRegister({detail}) {
    const mainVideo = document.querySelector('.main-video');
    const additionalVideo = document.querySelector('.additional-video');

    additionalVideo.srcObject = (mainVideo.srcObject = detail.stream);
    additionalVideo.play();
    mainVideo.play();

    document.querySelectorAll('.viewer__tab-radio')
        .forEach(e => e.addEventListener('change', getSwitchButtonHandler(detail.stream, mainVideo, additionalVideo)));
}


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    window.dispatchEvent(new CustomEvent('camera-stream--found', {detail: {stream}}));
}).catch(e => {
    throw e
});

window.addEventListener('camera-stream--found', cameraStreamRegister);

threeModule.init(model, additionalModel);
threeModule.animate();
