var app = module.exports = {};

var _ = require('lodash');
var colors = require('colors');

app.init = function(config) {
  var io = require('socket.io')(config).listen(config.port);
  io.adapter(setupRedis(config.redis));
  io.on('connection', function(socket) {
    console.log(socket.id.bold + " connected".green);
    socket.roomId = socket.id;

    handleDisconnect(socket);
    handleJoin(socket);
    handleLeave(socket);
    handleEmit(socket);
    handleBroadcast(socket);
  });

  app.nsp = io.nsps['/'];
  console.log('Socket.io listening on port ' + config.port);

  return this;
};

function setupRedis(redisConfig) {
  var redis = require('redis').createClient;
  var adapter = require('socket.io-redis');
  var pub = redis(redisConfig);
  var sub = redis(_.assign(redisConfig, { return_buffers: true }));
  pub.select(redisConfig.db);
  sub.select(redisConfig.db);
  return adapter({ pubClient: pub, subClient: sub });
}

function handleDisconnect(socket) {
  socket.on('disconnect', function() {
    app.nsp.in(socket.roomId).emit('left', { sid: socket.id, reason: 'disconnected' })
    console.log(socket.id.bold + " disconnected".red);
  });
}

function handleJoin(socket) {
  socket.on('join', function(data, callback) {
    socket.join(data.roomId);
    socket.roomId = data.roomId;
    socket.broadcast.in(socket.roomId).emit('joined', _.assign(data, { sid: socket.id }));
    console.log(socket.id.bold + " joined room => " + data.roomId.cyan);
    if(callback) callback();
  });
}

function handleLeave(socket) {
  socket.on('leave', function(data) {
    socket.leave(socket.roomId);
    app.nsp.in(socket.roomId).emit('left', _.assign(data, { sid: socket.id }));
    console.log(socket.id.bold + " left room => " + data.name.cyan);
  });
}

function handleEmit(socket) {
  socket.on('emit', function(data, callback) {
    app.nsp.in(socket.roomId).emit('emitted', _.assign(data, { sid: socket.id }));
    if(callback) callback();
  });
}

function handleBroadcast(socket) {
  socket.on('broadcast', function(data, callback) {
    socket.broadcast.in(socket.roomId).emit("broadcasted", _.assign(data, { sid: socket.id }));
    if(callback) callback();
  });
}
