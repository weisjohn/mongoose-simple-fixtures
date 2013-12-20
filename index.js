
var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , mp = require('mongoose-prime')
  ;

module.exports = function(mongoose, directory, cb) {
    var results = [];

    fs.readdir(directory, function(err, files) {
        if (err) return cb(err);
        if (files.length == 0) return cb(null, results);
        async.each(files, function(file, cb) {

            var data = require(path.join(directory, file))
              , name = file.split('.')[0]
              , model = mongoose.model(name)
              ;

            mp(model, data, function(err, result) {
                if (err) return cb(err);
                result.name = name;
                results.push(result);
                cb();
            });

        }, function(err) {
            cb(null, results);
        });
    });
}