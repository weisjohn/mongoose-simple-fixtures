
var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , mp = require('mongoose-prime')
  , EJSON = require('mongodb-extended-json')
  ;

module.exports = function(mongoose, directory, validate, cb) {

    // mongoose is optional
    if (typeof mongoose == "string") {
        cb = validate;
        validate = directory;
        directory = mongoose;
        try {
            mongoose = require('mongoose');
        } catch(e) {
            var prequire = require('parent-require');
            mongoose = prequire('mongoose');
        }
    }

    // validate is optional
    if (typeof validate == "function") {
        cb = validate;
        validate = null;
    }

    // cb optional
    if (typeof cb !== "function") {
        cb = function() {};
    }

    fs.readdir(directory, function(err, files) {
        if (err) return cb(err);
        async.map(files, processFile, cb);
    });

    function processFile(file, cb) {

        var filepath = path.join(directory, file);

        // backwards compatible support for old style require
        var data;
        try { data = require(filepath) } catch (e) { }
        if (data && Array.isArray(data)) return loadData(file, data, cb);

        // read a mongoexport file line by line
        fs.readFile(filepath, function(err, contents) {
            var data = [];
            // process each line of the file
            contents.toString().split('\n').forEach(function(line) {
                try { data.push(EJSON.parse(line)); } catch (e) {}
            });

            loadData(file, data, cb);
        });
    }

    function loadData(file, data, cb) {
        var name = file.split('.')[0]
          , model = mongoose.model(name)
          ;

        mp(model, data, validate, function(err, result) {
            if (err) return cb(err);
            result.name = name;
            cb(null, result);
        });
    }

}