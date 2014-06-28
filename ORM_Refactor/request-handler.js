var fs = require('fs'),
    path = require('path'),
    url = require('url');

var Sequelize = require("sequelize");
var sequelize = new Sequelize("chatterbox", "root", "");

var User = sequelize.define('User', {
  username: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  text: Sequelize.STRING
});

var Room = sequelize.define('Room', {
  roomName: Sequelize.STRING
});

Room.hasMany(Message);
User.hasMany(Message);

sequelize.sync();

// use mimeTypes for serving up of different types of files
var mimeTypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript'
};

// take a roomname and return the roomId if it exists, otherwise will return false
var roomNameToId = function (roomName, callback) {
  Room.find({ where: {roomName: roomName}}).success(function (room) {
    if (room === null) {
      // User posts in a room for the first time --> users-row does not exists!
      callback(false);
    } else {
      // if user has posted a message in this room
      // then get the room id
      callback(room.id);
    }
  });
};

// make room if it does not exist, otherwise return the room id
var makeRoom = function(roomName, callback) {
  roomNameToId(roomName, function (roomId) {
    if (!roomId) {
      // create a room
      Room.create({roomName: roomName}).success(function(room) {
        // access room id through query callback variable
        callback(room.id);
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
  User.find({ where: {username: name}}).success(function (user) {
    if (user === null) {
      // User posts for the first time --> users-row does not exists!
      callback(false);
    } else {
      // if user has posted a message
      // then get his id
      callback(user.id);
    }
  });
};

var makeUser = function(name, callback) {
  usernameToId(name, function (id) {
    if (!id) {
      // create a new user
      User.create({username: name}).success(function(user) {
        // access room id through query callback variable
        callback(user.id);
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
          Message.create({text: message.text, UserId: userid, RoomId: roomId}).success(function (message) {
            message = message.dataValues;
            message.objectId = message.id;
            console.log(message);
            headers['Content-Type'] = 'application/json';
            res.writeHead(statusCode, headers);
            // return object with objectId and createdAt properties to the user
            res.end(JSON.stringify(message));
          });
        });
      });
    });
  } else if (req.method === 'GET') {
    var query = 'SELECT messages.id AS objectId, messages.text, messages.createdAt, users.username FROM messages JOIN users ON users.id = messages.UserId WHERE messages.RoomId = (SELECT id FROM rooms WHERE roomName = "' + room + '") ORDER BY messages.createdAt DESC'

    // set raw: true and 'null' as second argument bc we don't have a model definition in our query
    // we have changed the column names to match the client's expectations
    sequelize.query(query, null, {raw: true}).success(function (messages) {
      headers['Content-Type'] = 'application/json';
      res.writeHead(200, headers);
      res.end(JSON.stringify({results: messages}));
    }).error(function (err) {
      console.log(err);
    });

  } else {
    res.writeHead(404, headers);
    res.end();
  }
};



module.exports.handler = function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.url === '/') {
    var newHeaders = Object.create(headers);
    newHeaders['Location'] = 'http://localhost:3000/index.html';
    res.writeHead(301, newHeaders);
    res.end('redirecting...');
  } else {
    var asset = path.join(__dirname, 'client', url.parse(req.url).pathname);
    fs.exists(asset, function (exists) {
      if (exists) {
        headers['Content-Type'] = mimeTypes[asset.split('.').reverse()[0]];
        console.log(asset, ': ', headers['Content-Type']);
        res.writeHead(200, headers);
        var readStream = fs.createReadStream(asset);
        readStream.pipe(res);
      } else {
        module.exports.api(req, res);
      }
    });
  }

};

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
