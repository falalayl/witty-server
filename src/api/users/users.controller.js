var passport = require('passport');

var Users = require('./users.model.js');

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
      .catch((err) => res.status(400).send({ errors: err.errors }));
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
    var { payload: { id } } = req;

    return Users.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.meJSON() });
      });
    },
    getAll: function (req, res) {
      Users.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
      // var apiKey = req.query.apiKey;
      // var name = req.query.name;
      // var q = {
      //   active: true
      // };
      // if (name) {
      //   q = {
      //     active: true,
      //     name: name
      //   };
      // }
      // if (apiKey === 'this_is_my_token') {
      //   // Categories.find(q).exec()
      //   // .then(respondWithResult(res))
      //   // .catch(handleError(res));
      //   Categories.find(q).exec(function (err, data) {
      //     if (err) res.sendStatus(403);
      //     res.send(data.map(x => {
      //       return {
      //         CategoryName: x.name,
      //         Budget: x.budget,
      //       };
      //     }));
      //   });
      // } else {
      //   res.status(403).send('Unauthorized Access');
      // }
    }
};

module.exports = controller;