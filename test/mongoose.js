
// create a connection
var mongoose = require('mongoose');
module.exports = function(cb) {

    mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;
    db.on('open', function() {
        // pull in models
        require('./models')(cb);
    });

}