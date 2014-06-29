// acquire the http moduel to create server
var http = require("http");
var handler = require("./request-handler");
// acquire the file with mySQL

// set defaul port and ip
var port = 8080;
var ip = "127.0.0.1";
// create a node server
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
// start the server
server.listen(port, ip);



