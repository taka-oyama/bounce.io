var socket = require('./lib/socket');
var config = require('./lib/config');
var server = require('./app/express').init();
var bounce = socket.init(server, config);

