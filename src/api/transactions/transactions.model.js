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
    wallet_id: {
        type: String,
        ref: 'Wallet'
    }
},
    {
        id: false,
        versionKey: false,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }

    });

module.exports = mongoose.model('Transaction', TransactionSchema);
