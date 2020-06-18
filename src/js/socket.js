const {actions} = require('./three')

const socket = io('http://localhost:5000');
socket.on('connect', function () {
    window.dispatchEvent(new CustomEvent('camera-stream--found'));
    console.log("connected")
});
let lastData = {x: null, y: null, class: null}
socket.on('message', function (data) {
    console.log(data);
    data = data.data;

    // if (data.class === 'five') {
    //     actions.rotateTop();
    // }
    if (data.classes.length === 1 && data.classes[0].class === 'fist') {
        actions.fistMove(data.classes[0], lastData);
    }

    if (data.classes.length === 2 && data.classes.findIndex(e => e.class === 'five') !== -1 && data.classes.findIndex(e => e.class === 'one') !== -1) {
        actions.changeGeometry(undefined, "box");
    }

    if (data.classes.length === 2 && data.classes.findIndex(e => e.class === 'five') !== -1 && data.classes.findIndex(e => e.class === 'two') !== -1) {
        actions.changeGeometry(undefined, "CYLINDER");
    }

    if (data.classes.length === 2 && data.classes.findIndex(e => e.class === 'five') !== -1 && data.classes.findIndex(e => e.class === 'fist') !== -1) {
        actions.changeGeometry(undefined, "cone");
    }
    // if (data.class === 'two') {
    //     actions.scalePlus();
    // }
    if (data.classes.length === 1 && data.classes[0].class === 'one') {
        actions.fingerRotate(data.classes[0], lastData);
    }

    if (data.classes.filter(e => e.class === 'five').length > 1) {
        actions.updatePosition();
    }
    const base64 = String.fromCharCode.apply(null, new Uint8Array(data.img));
    document.querySelector('.additional-video').src = 'data:image/jpg;base64, ' + base64;
    document.querySelector('.main-video').src = 'data:image/jpg;base64, ' + base64;
    lastData = data.classes[0] || {};
});
socket.on('disconnect', function () {
    console.log("disconnected")
});