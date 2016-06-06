var express = require('express');

module.exports = {
  init: function() {
    var srv = express();
    srv.use(express.static(process.cwd() + '/public'));

    srv.get('/', function (req, res) {
      res.sendFile(process.cwd() + '/index.html');
    });

    srv.get('/rooms', function (req, res) {
      res.json(Object.keys(socket.nsp.adapter.rooms).map(k => k));
    });

    return require('http').Server(srv)
  }
}
