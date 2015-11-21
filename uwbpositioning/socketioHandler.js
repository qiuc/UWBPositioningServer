/**
 * Created by chenqiu on 15/11/18.
 */

var realtime = function (socket) {
    socket.on('on_load', function (data) {
        socket.join('group:' + data.group);
        socket.group = data.group;
    });
    socket.on('disconnect', function () {
        socket.leave('group:' + socket.group);
    });
};

module.exports = {
    realtime: realtime
};