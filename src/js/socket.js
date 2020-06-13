const {actions} = require('./three')

const socket = io('http://localhost:5000');
socket.on('connect', function () {
    window.dispatchEvent(new CustomEvent('camera-stream--found'));
    console.log("connected")
});
let lastData = {x: null, y: null, class: null}
socket.on('message', function (data) {

    data = data.data;

    // if (data.class === 'five') {
    //     actions.rotateTop();
    // }
    if (data.class === 'fist') {
        actions.fistMove(data, lastData);
    }
    // if (data.class === 'two') {
    //     actions.scalePlus();
    // }
    if (data.class === 'one') {
        actions.fingerRotate(data, lastData);
    }
    const base64 = String.fromCharCode.apply(null, new Uint8Array(data.img));
    document.querySelector('.additional-video').src = 'data:image/jpg;base64, ' + base64;
    document.querySelector('.main-video').src = 'data:image/jpg;base64, ' + base64;
    lastData = data
});
socket.on('disconnect', function () {
    console.log("disconnected")
});