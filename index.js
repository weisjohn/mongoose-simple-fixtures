
var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , mp = require('mongoose-prime')
  , jsonload = require('jsonload')
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
        files = files.filter(function(file) {
            return /\w\.json$/.test(file);
        });
        async.map(files, function(file, cb) {
            var filepath = path.join(directory, file);
            jsonload(filepath, EJSON, function(err, lines) {
                if (err) return cb(err);
                loadData(file, lines, cb);
            });
        }, cb);
    });

    function loadData(file, data, cb) {
        var name = file.split('.')[0];
        var model = mongoose.model(name);

        mp(model, data, validate, function(err, result) {
            if (err) return cb(err);
            result.name = name;
            cb(null, result);
        });
    }

}