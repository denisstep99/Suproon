const {actions} = require('./three')

const socket = io('http://localhost:5000');
socket.on('connect', function(){console.log("connected")});
socket.on('message', function(data){

    console.log(data.data)
    data = JSON.parse(data.data);

    if (data.class === 'five') {
        actions.rotateTop();
    }
    if (data.class === 'fist') {
        actions.rotateBottom();
    }
    if (data.class === 'two') {
        actions.scalePlus();
    }
    if (data.class === 'one') {
        actions.scaleMinus();
    }
});
socket.on('disconnect', function(){console.log("disconnected")});