var mongoose = require('mongoose');

module.exports = function(cb) {

    mongoose.model('people', (new mongoose.Schema({
        first_name: String,
        last_name: String,
    })), 'people');

    // duplicate of `people` model to test single-item load
    mongoose.model('person', (new mongoose.Schema({
        first_name: String,
        last_name: String,
    })), 'person');

    mongoose.model('site', (new mongoose.Schema({
        url: String,
        last_visit: {
            type: Date,
            default: Date.now
        }
    })));

    cb();
}
