var socket = require('./lib/socket').init();
var express = require('./lib/express').init(socket);
