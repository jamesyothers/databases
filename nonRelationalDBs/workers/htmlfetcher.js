// this is the crontab script that will run this file once a minute
// */1 * * * * exec /Users/student/.nvm/v0.10.26/bin/node /Users/student/Code/jamesyothers/2014-06-web-historian/workers/htmlfetcher.js

var mongodb = require('mongodb');
var request = require('request');
var server = new mongodb.Server("127.0.0.1", 27017);
// 27017 is the default port for connecting to MongoDB
var client = new mongodb.Db('archive', server, {w: 1});

client.open(function (err) {
  console.log('Connected to MongoDB!');
  // cursor.toArray(callback) - defines all entries in a collection
  client.createCollection('websites', function(err, collection) {
    collection.find({html: {$exists: false}}).toArray(function(err, websites) {
      for (var i = 0; i < websites.length; i++) {
        var _id = websites[i]._id;
        console.log(_id);
        request('http://' + websites[i].url, function (err, resp, body) {
          collection.update({'_id': _id}, {
            $set: {html: body}
          }, function (err) {
            console.log(err);
          });
        });
      }
    });
  });
});


