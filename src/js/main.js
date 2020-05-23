const model = document.querySelector('.model');
const additionalModel = document.querySelector('.additional-model');

function getSwitchButtonHandler(cameraStream, mainVideo, additionalVideo) {
    return function switchButtonClickHandler(e) {
        if (e.target.checked) {
            [mainVideo, model, additionalVideo].map(e => e.classList.toggle('hidden'));
        }
    }
}

((mainVideo, additionalVideo) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(stream => {
        additionalVideo.srcObject = ( mainVideo.srcObject = stream);
        additionalVideo.play();
        mainVideo.play();

        document.querySelectorAll('.tab__radio')
            .forEach(e => e.addEventListener('change', getSwitchButtonHandler(stream, mainVideo, additionalVideo)));
    }).catch(e => {
        throw e
    });
})(document.querySelector('.main-video'), document.querySelector('.additional-video'));