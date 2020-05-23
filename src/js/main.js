function getSwitchButtonHandler(cameraStream, mainVideo, additionalVideo) {
    return function switchButtonClickHandler(e) {
        if (e.target.checked && e.target.value === 'main-view') {
            additionalVideo.srcObject = cameraStream;
            mainVideo.srcObject = undefined;
            mainVideo.classList.add('hidden')
            additionalVideo.classList.remove('hidden')
        } else {
            mainVideo.srcObject = cameraStream;
            additionalVideo.srcObject = undefined;
            mainVideo.classList.remove('hidden')
            additionalVideo.classList.add('hidden')
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