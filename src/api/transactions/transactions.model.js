var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;
var Wallets = require('../wallets/wallets.model');

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
  },
  user: {
    type: String
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

TransactionSchema
  .pre('save', function (next) {
    Wallets.findById(this.wallet, function(err, data) {
      if (err) throw err;
      this.user = data.user;
      next();
    });
  });


module.exports = mongoose.model('Transaction', TransactionSchema);
