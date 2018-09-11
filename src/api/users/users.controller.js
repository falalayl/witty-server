var passport = require('passport');
var Users = require('./users.model.js');
var handler = require('../../services/handler');



var controller = {
  register: function (req, res, next) {
    var { body: { user } } = req;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }  

    var finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }))
      // .catch((err) => res.status(400).send(err.message));
      .catch((err) => res.status(400).send(err));
  },
  login: function (req, res, next) {
    var { body: { user } } = req;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) {
        return next(info);
      }

      if (passportUser) {
        var user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return res.status(401).send(info);
    })(req, res, next);
  },
  logout: function (req, res) {
    req.logout();
    res.status(200).json({
      status: 'Successfully logged out'
    });
  },
  me: function (req, res, next) {
    var id = req.params.id
    // var { payload: { id } } = req;

    return Users.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.meJSON() });
      });
  },
  getAll: function (req, res) {
    return Users.find()
      .select('-salt -hash')
      .exec()
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findByIdAndRemove(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  },
  update: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  changePassword: function (req, res) {
    var id = req.params.id
    var oldPassword = req.body.oldPassword
    var newPassword = req.body.newPassword
    var confirmPassword = req.body.confirmPassword

    if (confirmPassword !== newPassword) {
      return res.status(400).send('New password did not match');
    }
    if (oldPassword === newPassword) {
      return res.status(400).send('New password cannot be the same as current password');
    }

    return Users.findOne({ _id: id })
      .then(function (user) {
        if (!user) {
          return res.status(400).send('User not found!');
        }

        if (!user.validatePassword(oldPassword)) {
          return res.status(400).send('Current Password did not match');
        }

        user.setPassword(newPassword);

        return user.save()
          .then(() => res.json(user.toAuthJSON()))
          .catch((err) => res.status(400).send(err.message));
      });
  }
};

module.exports = controller;