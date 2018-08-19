var mongoose = require('mongoose');
// var Users = require('../models/users');
var Wallets = require('../wallets/wallets.model');
var Schema = mongoose.Schema;

var date = new Date();
var n = date.getMonth();
var y = date.getFullYear();
var period = n + y;


var BudgetSchema = new Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }); 

BudgetSchema
    .virtual('budget.wallets', {
        ref: 'Wallet',
        localField: 'user',
        foreignField: 'user',
        justOne: false
    });

module.exports = mongoose.model('Budget', BudgetSchema);
