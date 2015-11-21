/**
 * Created by chenqiu on 15/11/18.
 */
var real = io.connect('http://localhost:3000/realtime');
var info = {
    "token": "XXXXXX",
    "group": "default"
};
real.on('connect', function () {
    real.emit('on_load', info);
});

real.on('position', function(position) {
    console.log(position);
});