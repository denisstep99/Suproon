function getSwitchButtonHandler(cameraStream, mainVideo, additionalVideo) {
    return function switchButtonClickHandler(e) {
        if (e.target.checked && e.target.value === 'main-view') {
            additionalVideo.srcObject = cameraStream;
            mainVideo.srcObject = undefined;
        } else {
            mainVideo.srcObject = cameraStream;
            additionalVideo.srcObject = undefined;
        }

        mainVideo.play();
        additionalVideo.play();
    }
}

((mainVideo, additionalVideo) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(stream => {
        additionalVideo.srcObject = stream;
        additionalVideo.play();

        document.querySelectorAll('.tab__radio')
            .forEach(e => e.addEventListener('change', getSwitchButtonHandler(stream, mainVideo, additionalVideo)));
    }).catch(e => {
        throw e
    });
})(document.querySelector('.main-video'), document.querySelector('.additional-video'));
