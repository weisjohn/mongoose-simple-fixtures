
// find fixture files
var fs = require('fs');
var jsonload = require('jsonload');
var dir = __dirname + '/fixtures/';
var files = fs.readdirSync(dir);
var async = require('async');
var mongoose = require('mongoose');
var assert = require('assert');

// reflective test harness
function test(cb) {
    return function() {

        async.each(files, function(file) {

            var name = file.split('.')[0];
            var model = mongoose.model(name);
            var records = jsonload.sync(dir + file);

            assert.equal(model.modelName, name, name + ' should be a model');

            async.each(records, function(record, cb) {
                var id = record._id.$oid;
                model.findOne({ _id : id }, function(err, doc) {
                    assert.ifError(err, name + ': finding should not fail ' + id);
                    assert(doc, name + ': doc should exist');
                    assert.equal(doc._id.toString(), id, name + ': doc id should be' + id);
                    cb();
                });
            }, cb);

        }, cb);

    }

}

// connect and run
require('./mongoose')(test(function() {
    // don't bolt if inside node-dev
    if (!/node-dev$/.test(process.env._))
        process.exit(0)
}));