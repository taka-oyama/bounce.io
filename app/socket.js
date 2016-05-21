var app = exports = module.exports = {};

var colors = require('colors');
var adapter = require('socket.io-redis');
var redis = adapter(require('../config/redis.js'));

app.init = function() {
  var io = require('socket.io').listen(8080);
  io.adapter(redis);

  app.nsp = io.nsps['/'];
  console.log('Socket.io listening on port 8080');

  io.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log(handshakeData);
    next();
  });

  io.on('connection', function(socket) {
    console.log(socket.id.bold + " connected".green);
    socket.roomId = socket.id;

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
    app.nsp.in(socket.roomId).emit('left', { reason : 'disconnected' })
    console.log(socket.id.bold + " disconnected".red);
  });
}

function handleJoin(socket) {
  socket.on('join', function(data, callback) {
    socket.join(data.roomId);
    socket.roomId = data.roomId;
    socket.broadcast.in(socket.roomId).emit('joined', data);
    console.log(socket.id.bold + " joined room => " + data.roomId.cyan);
    if(callback) callback();
  });
}

function handleLeave(socket) {
  socket.on('leave', function(data) {
    socket.leave(socket.roomId);
    app.nsp.in(socket.roomId).emit('left', data);
    console.log(socket.id.bold + " left room => " + data.name.cyan);
  });
}

function handleEmit(socket) {
  socket.on('emit', function(data, callback) {
    app.nsp.in(socket.roomId).emit('emitted', data);
    if(callback) callback();
  });
}

function handleBroadcast(socket) {
  socket.on('broadcast', function(data, callback) {
    socket.broadcast.in(socket.roomId).emit(data);
    if(callback) callback();
  });
}

function handleUnicast(socket) {
  socket.on('unicast', function(data, callback) {
    socket.broadcast.in(data.target).emit('unicast', data);
    if(callback) callback();
  });
}
