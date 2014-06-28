var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    db = require('./db');

// define functions outside of the exports.module function so that these functions will not be created every time this module is required

// use mimeTypes for serving up of different types of files
var mimeTypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript'
};

// take a roomname and return the roomId if it exists, otherwise will return false
var roomNameToId = function (roomName, callback) {
  db.query('SELECT id, roomName FROM rooms WHERE roomName = ' + db.escape(roomName), function(err, rows) {
    if (rows.length === 0) {
      // User posts in a room for the first time --> users-row does not exists!
      callback(false);
    } else {
      // if user has posted a message in this room
      // then get the room id
      callback(rows[0].id);
    }
  });
};

// make room if it does not exist, otherwise return the room id
var makeRoom = function(roomName, callback) {
  roomNameToId(roomName, function (roomId) {
    if (!roomId) {
      // create a room
      var query = 'INSERT INTO rooms (roomName) VALUES (' + db.escape(roomName) + ')';
      // query to insert roommname
      db.query(query, function(err, result) {
        // access room id through query callback variable
        callback(result.insertId);
      });
      // a room is posted in for the first time--> room-row does not exists!
    } else {
      // if the room exists
      // then get the room id
      callback(roomId);
    }
  });
};


var usernameToId = function (name, callback) {
  db.query('SELECT id, name FROM users WHERE name = ' + db.escape(name), function(err, rows) {
    if (rows.length === 0) {
      // User posts for the first time --> users-row does not exists!
      callback(false);
    } else {
      // if user has posted a message
      // then get his id
      callback(rows[0].id);
    }
  });
};

var makeUser = function(name, callback) {
  usernameToId(name, function (id) {
    if (!id) {
      // create a new user
      db.query('INSERT INTO users (name) VALUES (' + db.escape(name) + ')', function(err, result) {
        callback(result.insertId);
      });
      // User posts for the first time --> users-row does not exists!
    } else {
      // if user has posted a message
      // then get his id
      callback(id);
    }
  });
};

module.exports.api = function (req, res) {
  var isRoom = req.url.split('/')[1] === 'classes';
  var room = req.url.split('/')[2];

  // post request from user input field
  if (isRoom && req.method === 'POST') {
    // 201 resource has been created
    // messages created in the url (resource)
    var statusCode = 201;
    var message = '';

    // receive the message in a stream
    req.on('data', function (chunk) {
      message += chunk;
    });

    // stream complete
    req.on('end', function () {
      message = JSON.parse(message);

      // create user if does not exist
      // always return the userId
      makeUser(message.username, function (userid) {
        // create room if does not exist
        // always return roomId
        makeRoom(room, function (roomId) {
          // Insert message
          // use .escape() to protect against SQL injection
          db.query('INSERT INTO messages (createdAt, text, author, messageRoom) VALUES (NOW(), ' + db.escape(message.text) + ',' + userid + ',' + roomId + ')', function (err, result) {
            message.objectId = result.insertId;
            // create property with current time
            message.createdAt = Date.now();
            headers['Content-Type'] = 'application/json';
            res.writeHead(statusCode, headers);
            // return object with objectId and createdAt properties to the user
            res.end(JSON.stringify(message));
          });
        });
      });
    });
  } else if (req.method === 'GET') {
    db.query('SELECT messages.id AS objectId, messages.text, messages.createdAt, users.name AS username FROM messages, users WHERE messages.author = users.id AND messages.messageRoom = (SELECT id FROM rooms WHERE roomName = ' + db.escape(room) + ')', function (err, rows) {
        console.log(err);
        headers['Content-Type'] = 'application/json';
        res.writeHead(200, headers);
        res.end(JSON.stringify({results: rows}));
    });

  } else {
    res.writeHead(404, headers);
    res.end();
  }
};



module.exports.handler = function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  var asset = path.join(__dirname, 'client', url.parse(req.url).pathname);
  fs.exists(asset, function (exists) {
    console.log('Exists?');
    if (exists) {
      console.log('Exists!!!');
      headers['Content-Type'] = mimeTypes[asset.split('.').reverse()[0]];
      console.log(asset, ': ', headers['Content-Type']);
      res.writeHead(200, headers);
      var readStream = fs.createReadStream(asset);
      readStream.pipe(res);
    } else {
      console.log('API!');
      // API
      module.exports.api(req, res);
    }
  });
};

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
