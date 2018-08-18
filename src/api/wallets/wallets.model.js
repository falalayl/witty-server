var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    user: {
        type: String,
        ref: 'User'
    },
    type: String, 
    amount: Number,
    transactions: [{
        _id: String, //transaction._id
        // ref: 'Transaction'
    }]

    // _user: { type: Schema.Types.ObjectId, ref: Users },
    // budget: [
    //     {
    //         period: Date,
    //         name: { type: String, required: true, lowercase: true },
    //         budget: { type: Number, required: true },
    //         expense: [
    //             {
    //                 desc: { type: String, lowercase: true },
    //                 amount: Number,
    //                 date: Date
    //             }
    //         ],
    //         active: { type: Boolean, default: true }
    //     }]
});



module.exports = mongoose.model('Wallet', WalletSchema);
