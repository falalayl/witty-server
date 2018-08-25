var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    desc: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(Date.now())
    },
    amount: {
        type: Number,
        required: true
    },
    wallet: {
        type: String,
        ref: 'Wallet'
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
