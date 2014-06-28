/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request"); // You might need to npm install the request module!
var expect = require('chai').expect;

describe("Persistent Node Chat Server", function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
    /* TODO: Fill this out with your mysql username */
      user: "root",
    /* and password. */
      password: "",
      database: "chat"
    });
    dbConnection.connect();

    var tablename = "messages"; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query("DELETE FROM " + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it("Should insert posted messages to the DB", function(done) {
    // Post a message to the node chat server:
    request({method: "POST",
             uri: "http://localhost:3000/classes/room1",
             json: {username: "Valjean",
                    text: "In mercy's name, three days is all I need."}
            },
            function(error, response, body) {
              /* Now if we look in the database, we should find the
               * posted message there. */
              console.log('err: ', error);
              var queryString = "SELECT * FROM messages";
              var queryArgs = [];
              /* TODO: Change the above queryString & queryArgs to match your schema design
               * The exact query string and query args to use
               * here depend on the schema you design, so I'll leave
               * them up to you. */
              dbConnection.query(queryString, queryArgs,
                function(err, results, fields) {
                  // Should have one result:
                  expect(results.length).to.equal(1);
                  expect(results[0].author).to.equal(1);
                  expect(results[0].text).to.equal("In mercy's name, three days is all I need.");
                  /* TODO: You will need to change these tests if the
                   * column names in your schema are different from
                   * mine! */

                  done();
                });
            });
  });

  it("Should output all messages from the DB", function(done) {
    // Let's insert a message into the db
    var queryString = "INSERT into messages (createdAt, text, author, messageRoom) VALUES (NOW(), " + dbConnection.escape("Javert 'Men like you can never change!'") + ", 1, 2)";
    var queryArgs = ["Javert", "Men like you can never change!"];
    /* TODO - The exact query string and query args to use
     * here depend on the schema you design, so I'll leave
     * them up to you. */

    dbConnection.query( queryString, queryArgs,
      function(err, results, fields) {
        console.log(err);
        /* Now query the Node chat server and see if it returns
         * the message we just inserted: */
        request("http://localhost:3000/classes/4chan",
          function(error, response, body) {
            var messageLog = JSON.parse(body).results;
            console.log(messageLog);
            expect(messageLog[0].username).to.equal('Valjean');
            expect(messageLog[0].text).to.equal("Javert 'Men like you can never change!'");
            done();
          });
      });
  });
});
