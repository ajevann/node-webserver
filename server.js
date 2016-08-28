const http = require('http');
const fs = require('fs');
const path = require('path');

var webserver = {
  hostname: '127.0.0.1',
  port: 3000,
  indexFiles: [],

  init: function() {
    webserver.grabIndexes('.', function() {
      console.log('printing... ', webserver.indexFiles.length);
      for (var indexFile in webserver.indexFiles) {
        webserver.port++;
        console.log(webserver.port, webserver.indexFiles[indexFile]);
        webserver.startServer(webserver.port, indexFile);
      }
    });
  },

  grabIndexes: function(dir, done) {
    fs.readdir(dir, function(error, list) {
      if (error) {
        return done(error);
      }

      var i = 0;

      (function next() {
        var file = list[i++];

        if (!file) {
          return done(null);
        }

        var fileName = file;
        var filePath = dir + '/' + file;
        file = dir + '/' + file;

        fs.stat(filePath, function(error, stat) {

          if (stat && stat.isDirectory()) {
            webserver.grabIndexes(filePath, function(error) {
              next();
            });
          } else {
            // do stuff to file here
            if (fileName === 'index.html') {
              webserver.indexFiles.push(filePath);

              console.log(filePath);
            }
            next();
          }
        });
      })();
    });
  },

  startServer: function(port, path) {
    console.log('>>>', port, path);
    http.createServer(function(req, res) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      var index = fs.readFile(path);
      res.end(index);
    }).listen(port, function() {
      console.log('Server running at http://' + webserver.hostname + ':' + port + '/');
    });
  }
}

webserver.init();
