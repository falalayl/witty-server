var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var BudgetSchema = new Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    budget: [{
        period: String,
        wallets: [{
            _id: String,
            ref: 'Wallet'
        }]
    }]
    // budget: [{
    //     m1: {
    //         type: String,
    //         ref: 'Ref1'
    //     },
    //     m2: [{
    //         type: String,
    //         ref: 'Ref1'
    //     }],
    //     m3: {
    //         type: String,
    //         ref: 'Ref1'
    //     }
    // }]
});

module.exports = mongoose.model('Budget', BudgetSchema);
