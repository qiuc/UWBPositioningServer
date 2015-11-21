/**
 * Created by chenqiu on 15/11/17.
 */

var uwbpositioning = require('uwbpositioning');
var ioe = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });

var task = uwbpositioning.createTask({});

task.on('listening', function(address) {
    console.log("UDP server listening " + address.address + ":" + address.port);
});

task.on('packet', function(packet) {
    //console.log('Anchor ' + packet.header.anchorId + ' receive packet: ' + packet.payload.name);
});

task.on('tag_position', function(result) {
    var groupIds = Object.keys(result);
    groupIds.forEach(function (groupId) {
        ioe.of('/realtime').in('group:'+groupId).emit('position', result[groupId]);
    });
});

task.on('error', function(err) {
    //console.error(err);
});

task.errorTransformer = function (res, err) {
    if(err.code) {
        res.status(400).json({
            message  : "id check error",
            errors   : err.code
        });
    } else {
        res.status(500).json({
            message  : "redis database error",
            errors   : err
        });
    }
};

module.exports = task;