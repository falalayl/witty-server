var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    desc: {
        type: String,
        required: true,
    },
    date: Date,
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
