var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        ref: 'User',
        required: true,
        ref: 'Budget'
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    });

WalletSchema
    .virtual('transactions', {
        ref: 'Transaction',
        localField: '_id',
        foreignField: 'wallet',
        justOne: false
    });



module.exports = mongoose.model('Wallet', WalletSchema);
