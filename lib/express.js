var app = exports = module.exports = {};
var express = require('express');

app.init = function(socket) {
  var server = express();
  server.listen(3000);
  server.use(express.static(process.cwd() + '/public'));
  console.log('Express listening on port 3000');

  server.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  server.get('/rooms', function (req, res) {
    console.log(socket.nsp.adapter.rooms);
    res.json(Object.keys(socket.nsp.adapter.rooms).map(k => k));
  });
};
