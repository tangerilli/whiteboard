var express = require("express"),
    app = express.createServer(),
    io = require('socket.io').listen(app);

var redis = require("redis"),
    rclient = redis.createClient();

app.listen(8080);
app.use("/static", express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var board_sockets = {};

io.sockets.on('connection', function (socket) {
    var board_id = socket.handshake.query.board_id;
    if(!board_sockets[board_id]) board_sockets[board_id] = [];
    // TODO: Do something if the board_id is undefined
    board_sockets[board_id].push(socket);
    var redis_key = "board_" + board_id;
    rclient.lrange(redis_key, 0, -1, function(err, res) {
        socket.emit('board_state', res);
    });
    
    socket.on('update', function (data) {
        for(idx in board_sockets[board_id]) {
            var s = board_sockets[board_id][idx];
            if(s != socket) {
                s.emit('update', data);
                data.timestamp = Math.round(new Date().getTime() / 1000);
                rclient.lpush(redis_key, JSON.stringify(data));
            }
        }
    });
});