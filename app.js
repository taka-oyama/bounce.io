var bounce = require('./lib/socket');
var config = require('./config/socket');

var bounce = bounce.init(config);

require('./app/express').init(bounce);