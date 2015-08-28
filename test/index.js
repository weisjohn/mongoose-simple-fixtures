
// find fixture files
var fs = require('fs');
var jsonload = require('jsonload');
var dir = __dirname + '/fixtures/';
var files = fs.readdirSync(dir);
var async = require('async');
var mongoose = require('mongoose');
var assert = require('assert');
var msf = require('../');

// loop through all the files
function looper(func) {
    return function(cb) {
        async.each(files, function(file, cb) {
            var name = file.split('.')[0];
            if (!name) return cb();
            var model = mongoose.model(name);
            var records = jsonload.sync(dir + file);
            func(name, model, records, cb);
        }, cb);
    }
}

// process the records
function processor(func) {
    return function(name, model, records, cb) {
        async.each(records, function(record, cb) {
            var id = record._id.$oid;
            model.findOne({ _id : id }, function(err, doc) {
                func(err, doc, name, id, cb);
            });
        }, cb);
    }
}


// reflective test harness
function test(cb) {
    return function() {

        async.series([

            // models should exist, wipe out records
            looper(function(name, model, records, cb) {
                assert.equal(model.modelName, name, name + ' should be a model');
                model.remove({}, cb);
            }),

            // records should be gone
            looper(processor(function(err, doc, name, id, cb) {
                assert.ifError(err, name + ': finding should not fail: ' + id);
                assert(!doc, name + ': doc should not exist: ' + id);
                cb();
            })),

            // load the fixtures
            function(cb) { msf(dir, cb); },

            // records should be loaded
            looper(processor(function(err, doc, name, id, cb) {
                assert.ifError(err, name + ': finding should not fail: ' + id);
                assert(doc, name + ': doc should exist: ' + id);
                assert.equal(doc._id.toString(), id, name + ': doc id should be' + id);
                cb();
            })),

        ], cb);

    }

}

// connect and run
require('./mongoose')(test(function() {
    // don't bolt if inside node-dev
    if (!/node-dev$/.test(process.env._))
        process.exit(0)
}));