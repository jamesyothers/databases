// to read and write from and to files
var fs = require('fs');
// use for path.join and path.resolve
var path = require('path');
var _ = require('underscore');
// request module is necessary to piping read stream to write stream
var request = require('request');
var mongodb = require('mongodb');

var server = new mongodb.Server("127.0.0.1", 27017, {});
// 27017 is the default port for connecting to MongoDB
var client = new mongodb.Db('archive', server);

client.open();



/*
 *
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

// use this helper object for accessing directories
exports.paths  = paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback){
  // return array of urls in 'sites.txt'
  client.createCollection('submitted-urls', function(err, collection) {
    collection.find().toArray(function(err, results) {
      var urls = [];
      for (var i=0; i<results.length; i++) {
        urls.push(results[i].url);
      }
      callback(urls);
    });
  });
  // fs.readFile(paths.list,'utf8', function(err, data) {
  //   if (err) {
  //     console.log('error on reading sites.txt: ', err);
  //   }
  //   callback(data.split('\n'));
  // });
};

exports.isUrlInList = isUrlInList = function(url,callback){
  client.createCollection('submitted-urls', function(err, collection) {
    collection.find({url: url}).toArray(function(err, results) {
      var urls = [];
      for (var i=0; i<results.length; i++) {
        urls.push(results[i].url);
      }
      callback(urls);
    });
  });

};

// add a url to 'sites.txt'
exports.addUrlToList = addUrlToList = function(url,callback){
  // get is url in list information, boolean
  isUrlInList(url, function(urlExists) {
    if(!urlExists){
      fs.appendFile(paths.list, url + "\n", function(err){
        if(err) throw err;
        console.log('Error when adding to the list');
      });
      callback(true);
    }else{
      callback(false);
    }
  });
};

exports.isURLArchived = isURLArchived = function(url, callback){
  // read 'sites' directory to check for archived sites



  // fs.readdir(path.join(__dirname,'../archives/sites'), function(err,files) {
  //   if (err) {
  //     console.log('error in isURLArchived: ', err);
  //   }
  //   // if url is in the directory
  //   callback(files.indexOf(url) !== -1);
  // });

};

// callback hell
exports.downloadUrls = function(){

  // read the 'sites' directory and compare files with list of files in sites.txt
  fs.readdir(path.join(__dirname,'../archives/sites'), function(err,archivedFiles) {
    if (err) {
      console.log('error in downloadUrls: ', err);
    } else {
      // read list of urls in 'sites.txt'
      readListOfUrls(function(siteFiles){
        // the final element in the array is '', so it must be removed
        siteFiles.pop();
        // if the 'site.txt' urls are the same number as files for urls, do nothing
        if (siteFiles.length !== archivedFiles.length) {
          // will always have more or equal number of siteFiles compared to archived fles
          for (var i=0; i < siteFiles.length; i++) {
            // if the site file is not in the archived files
            if (archivedFiles.indexOf(siteFiles[i]) === -1) {
              var siteFile = fs.createWriteStream(path.join(__dirname, '../archives/sites/',siteFiles[i]));
              // write the downloaded html to the appropriate file on disk
              request('http://' + siteFiles[i]).pipe(siteFile);
            }
          }
        }
      });
    }
  });
};
