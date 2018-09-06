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
    walletId: {
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
        },
        options: {
            sort: {
                date: -1
            }
        }

    });

module.exports = mongoose.model('Transaction', TransactionSchema);
