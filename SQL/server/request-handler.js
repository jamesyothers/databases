/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

// var fs = require('fs');

// if (fs.existsSync('db.json')) {
//   module.exports.db = require('./db.json');
// } else {
//   module.exports.db = {};
// }

// setInterval(function () {
//   fs.writeFileSync('db.json', JSON.stringify(module.exports.db));
// } , 3000);

var mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css'
  // TODO JS
};

// this is the callback to our server creation
// we will be serving up all the files for the client to operate
module.exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // take existence of room and room information from the url
  var isRoom = request.url.split('/')[1] === 'classes';
  var room = request.url.split('/')[2];

  // determine the path to the file to read
  var asset = path.join(__dirname, '../client', req.url);
  // determine if the file exists at the given path
  fs.exists(asset, function (exists) {
    console.log('Exists?')
    if (exists) {
      console.log('Exists!!!');
      // set the content type to the extnsion of the given file
      // augment headers with the content type
      headers['Content-Type'] = mimeTypes[asset.split('.').reverse()[0]];
      // repare the response
      res.writeHead(200, headers);
      // setup the readStream from the individual files at 'asset' path
      var readStream = fs.createReadStream(asset);
      // pass all the files to the browser via pipe
      // 'pipe' automatically ends the response
      readStream.pipe(res);
    } else {
      ///
    }
  });


  // if (isRoom && request.method === 'GET') {
  //   var statusCode = 200;

  //   /* Without this line, this server wouldn't work. See the note
  //    * below about CORS. */
  //   var headers = defaultCorsHeaders;

  //   headers['Content-Type'] = 'application/json';

  //   /* .writeHead() tells our server what HTTP status code to send back */
  //   response.writeHead(statusCode, headers);

  //   /* Make sure to always call response.end() - Node will not send
  //    * anything back to the client until you do. The string you pass to
  //    * response.end() will be the body of the response - i.e. what shows
  //    * up in the browser.*/
  //   module.exports.db[room] = module.exports.db[room] || [];
  //   response.end(JSON.stringify({results: module.exports.db[room]}));

  // } else if (isRoom && request.method === 'POST') {
  //   var statusCode = 201;
  //   var message = '';

  //   request.on('data', function (chunk) {
  //     message += chunk;
  //   });

  //   request.on('end', function () {
  //     message = JSON.parse(message);
  //     module.exports.db[room] = module.exports.db[room] || [];
  //     message.objectId = module.exports.db[room].length;
  //     message.createdAt = new Date();
  //     module.exports.db[room].unshift(message);

  //     /* Without this line, this server wouldn't work. See the note
  //      * below about CORS. */
  //     var headers = defaultCorsHeaders;

  //     headers['Content-Type'] = 'application/json';

  //     /* .writeHead() tells our server what HTTP status code to send back */
  //     response.writeHead(statusCode, headers);

  //      Make sure to always call response.end() - Node will not send
  //      * anything back to the client until you do. The string you pass to
  //      * response.end() will be the body of the response - i.e. what shows
  //      * up in the browser.
  //     response.end(JSON.stringify(message));
  //   });
  // } else if (request.method === 'OPTIONS') {
  //   var statusCode = 200;
  //   /* Without this line, this server wouldn't work. See the note
  //    * below about CORS. */
  //   var headers = defaultCorsHeaders;

  //   headers['Content-Type'] = 'application/json';

  //   /* .writeHead() tells our server what HTTP status code to send back */
  //   response.writeHead(statusCode, headers);

  //   /* Make sure to always call response.end() - Node will not send
  //    * anything back to the client until you do. The string you pass to
  //    * response.end() will be the body of the response - i.e. what shows
  //    * up in the browser.*/
  //   response.end(JSON.stringify({status: 'ok', message: 'CORS allowed'}));
  // } else {
  //   var statusCode = 404;
  //   /* Without this line, this server wouldn't work. See the note
  //    * below about CORS. */
  //   var headers = defaultCorsHeaders;

  //   headers['Content-Type'] = 'application/json';

  //   /* .writeHead() tells our server what HTTP status code to send back */
  //   response.writeHead(statusCode, headers);

  //   /* Make sure to always call response.end() - Node will not send
  //    * anything back to the client until you do. The string you pass to
  //    * response.end() will be the body of the response - i.e. what shows
  //    * up in the browser.*/
  //   response.end(JSON.stringify({status: 'error', message: 'File not found'}));
  // }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
