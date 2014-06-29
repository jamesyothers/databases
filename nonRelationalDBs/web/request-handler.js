// this is the file that will handle all requests from the user
// it is used as a parameter in instantiating our server in basic-server.js
var path = require('path');
// to read and write from and to files
var fs = require('fs');
var httpHelp = require('./http-helpers');

// handle all 'GET' and 'POST' requests
exports.handleRequest = function (req, res) {

  if(req.method === 'GET'){
    // a 'GET' requeset to '/' occurs when the user types in localhost: 8080
    if (req.url === '/') {
      // serve up the homepage index.html file
      httpHelp.serveAssets(res,'./public/index.html', 'text/html');
    } else if(req.url === '/styles.css'){
      // serve up the homepage styles.css file
      httpHelp.serveAssets(res,'./public/styles.css', 'text/css');
    } else if(req.url === '/loading.html'){
      // serve up the loading page when a user enters a website that is not cached
      httpHelp.serveAssets(res,'./public/loading.html', 'text/html');
    }
    // a 'POST' request is made when the user enters a url in the input box and hits enter
  } else if (req.method === 'POST') {
    // the data received will be a string
    var data = '';
    // data comes across in chunks not all at once, build it up
    req.on('data', function(chunk){
      data += chunk;
    });
    // upon completion of receiving data enter logic for handling this request
    req.on('end', function(){
      httpHelp.addUrl(res,data);
    });
  }
};
