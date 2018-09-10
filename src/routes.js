var expressAccessToken = require('express-access-token');
var config = require('./config');

var masterKey = function (req, res, next) {
  var accessTokens = config.masterKey;
  var authorized = accessTokens.includes(req.accessToken);
  if (!authorized) return res.status(403).send('Forbidden');
  next();
};

module.exports = function (app) {
  app.use('/', require('./api/main'));
  app.use('/api/users', require('./api/users'));
  app.use('/api/budget', require('./api/budget'));
  app.use('/api/wallets', require('./api/wallets'));
  app.use('/api/transactions', require('./api/transactions'));
  app.use('/api/archives', require('./api/archives'));
  // app.use('/api/users', expressAccessToken, masterKey, require('./api/users'));
  app.use('/api/categories', require('./api/categories'));
};