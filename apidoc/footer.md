# WebSocket通信说明

## 基本示例

```javascript
  <script src="/socket.io/socket.io.js"></script>
  <script>
    var real = io.connect('http://localhost/realtime');
    var info = {
      "token": "XXXXXX";
      "group": "default";
    };
    real.on('connect', function () {
      real.emit('on_load', info);
      real.on('position', function(position) {
        console.log(position);
      });
    });
  </script>
```

## 获取实时定位信息

实时定位信息需要使用/realtime命名空间:

```javascript
  var real = io.connect('http://localhost/realtime');
```

在加入该空间后, 需要发送配置信息. 其中token为授权信息.

如果发送Anchor组id, 则服务器会推送本组中所有Tag的信息:

```javascript
  var info = {
    "token": "XXXXXX";
    "group": "default";
  };
  real.on('connect', function () {
    real.emit('on_load', info);
  });
```

如果发送Tag的设备号, 则服务器会根据Tag所在的Anchor组, 推送本组中所有的Tag信息:

```javascript
  var info = {
    "token": "XXXXXX";
    "tag":   5;
  };
  real.on('connect', function () {
    real.emit('on_load', info);
  });
```

配置完毕后, 只需持续监听position事件, 并将数据进行处理即可:

```javascript
  real.on('position', function(position) {
    console.log(position);
  });
```

## 录像回放

录像需要使用/replay命名空间:

```javascript
  var replay = io.connect('http://localhost/replay');
```

在加入该空间后, 需要发送配置信息. 其中token为授权信息.

如果发送Anchor组id, 则服务器会推送本组中所有Tag的信息:

```javascript
  var info = {
    "token": "XXXXXX";
    "group": "default";
  };
  replay.on('connect', function () {
    replay.emit('on_load', info);
  });
```

如果发送Tag的设备号, 则服务器会推送所有的tag的位置信息:

```javascript
  var info = {
    "token": "XXXXXX";
    "tag":   [5, 6, 7];
  };
  replay.on('connect', function () {
    replay.emit('on_load', info);
  });
```

配置完毕后, 通过向服务器发送以下事件, 控制服务器的推送内容:

```javascript
  var start = {
    "timestamp": 1445625675    // 开始时间戳
    "speed"    : 1             // 播放倍数
  }
  replay.emit('start', start); // 开始播放
  replay.emit('stop');         // 结束播放
```

## 告警信息

告警信息会返回所有Anchor分组下所有Tag的告警信息.

告警信息需要使用/alarm命名空间:

```javascript
  var alarm = io.connect('http://localhost/alarm');
```

在加入该空间后, 需要发送配置信息. 其中token为授权信息.

```javascript
  var info = {
    "token": "XXXXXX";
  };
  alarm.on('connect', function () {
    alarm.emit('on_load', info);
  });
```

配置完毕后, 持续监听alarm事件, 并将数据进行处理.

一旦Tag发生告警, 会间隔一段时间持续发送该告警信息, 直至发送ack事件, 并带上alarm信息才不再发送.

```javascript
  real.on('alarm', function(alarm) {
    console.log(alarm);
    alarm.emit('ack', alarm);
  });
```