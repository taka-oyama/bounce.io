var socket = require('./lib/socket');
var config = require('./lib/config');
var server = require('./lib/server').init();
var bounce = socket.init(server, config);
