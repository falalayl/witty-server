var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true,
        ref: 'Budget'
    },
    type: {
        type: String,
        required: true,
        lowercase: true
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

WalletSchema
    .path('type')
    .validate(function (value) {
        return this.constructor.findOne({ type: value, name: this.name }).exec()
            .then(wallet => {
                if (wallet) {
                    if (this.id === wallet.id) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .catch(function (err) {
                throw err;
            });
    }, 'Wallet name already exists in that type, enter a new name!');


module.exports = mongoose.model('Wallet', WalletSchema);
