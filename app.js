var express = require("express"),
    app = express.createServer(),
    io = require('socket.io').listen(app);

app.listen(8080);
app.use("/static", express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var board_sockets = {};

io.sockets.on('connection', function (socket) {
    var board_id = socket.handshake.query.board_id;
    if(!board_sockets[board_id]) board_sockets[board_id] = [];
    board_sockets[board_id].push(socket);
    // TODO: Do something if the board_id is undefined
    socket.on('draw', function (data) {
        for(idx in board_sockets[board_id]) {
            var s = board_sockets[board_id][idx];
            if(s != socket) {
                s.emit('draw', data);
            }
        }
    });
});