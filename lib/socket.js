var app = exports = module.exports = {};

var colors = require('colors');

app.init = function() {
  var io = require('socket.io').listen(8080);
  app.nsp = io.nsps['/'];
  console.log('Socket.io listening on port 8080');

  io.on('connection', function(socket) {
    console.log(socket.id.bold + " connected".green);
    socket.room = socket.id;

    handleDisconnect(socket);
    handleJoin(socket);
    handleLeave(socket);
    handleEmit(socket);
    handleBroadcast(socket);
    handleUnicast(socket);
  });
  return this;
};

function handleDisconnect(socket) {
  socket.on('disconnect', function() {
    app.nsp.in(socket.room).emit('left', { reason : 'disconnected' })
    console.log(socket.id.bold + " disconnected".red);
  });
}

function handleJoin(socket) {
  socket.on('join', function(data, callback) {
    socket.join(data.name);
    socket.room = data.name;
    app.nsp.in(socket.room).emit('joined', data);
    console.log(socket.id.bold + " joined room => " + data.name.cyan);
    if(callback) callback();
  });
}

function handleLeave(socket) {
  socket.on('leave', function(data) {
    socket.leave(socket.room);
    app.nsp.in(socket.room).emit('left', data);
    console.log(socket.id.bold + " left room => " + data.name.cyan);
  });
}

function handleEmit(socket) {
  socket.on('emit', function(data, callback) {
    app.nsp.in(socket.room).emit('emit', data);
    if(callback) callback();
  });
}

function handleBroadcast(socket) {
  socket.on('broadcast', function(data, callback) {
    socket.broadcast.in(socket.room).emit(data);
    if(callback) callback();
  });
}

function handleUnicast(socket) {
  socket.on('unicast', function(data, callback) {
    if(data.target in app.nsp.in(socket.room).sockets) {
      app.nsp.in(socket.room).sockets[data.target].emit('unicast', data, function(res) {
        if(callback) callback();
      });
    }
  });
}
