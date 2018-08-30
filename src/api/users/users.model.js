var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Budget = require('../budget/budget.model');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    default: 'Witty User'
  },
  hash: String,
  salt: String,
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

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    return email.length;
  }, 'Email cannot be blank');

// // Validate empty password
// UserSchema
//   .path('password')
//   .validate(function(password) {
//     return password.length;
//   }, 'Password cannot be blank');

// Validate email is not taken


UserSchema
  .path('email')
  .validate(function (value) {
    return this.constructor.findOne({ email: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      })
      .catch(function (err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema
  .post('save', (doc) => {
    Budget.create({
      user: doc._id,
      budget: []
    })
      .then(() => {
        console.log('Astig');
      })
      .catch(() => {
        console.log('Yun lang');
      });
  });

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 30);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    token: this.generateJWT(),
  };
};

UserSchema.methods.meJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name
  };
};

UserSchema
  .virtual('budgets', {
    ref: 'Budget',
    localField: '_id',
    foreignField: 'user',
    justOne: false
  });

module.exports = mongoose.model('User', UserSchema);