var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var ForecastSchema = new Schema({
  
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

Forecast  

// ForecastSchema
//   .virtual('wallets', {
//     ref: 'Wallet',
//     localField: '_id',
//     foreignField: 'category',
//     justOne: false
//   });

module.exports = mongoose.model('Forecast', ForecastSchema);
