var Forecasts = require('./forecasts.model');
var handler = require('../../services/handler');

var controller = {
  getEntries: function (req, res) {
    return Forecasts.find()
      .select('-__v')
      .populate('wallets', '-__v')
      .exec()
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  getEntry: function (req, res) {
    return Forecasts.findById(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  create: function (req, res) {
    return Forecasts.create(req.body)
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  update: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Forecasts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Forecasts.findByIdAndRemove(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  }
};

module.exports = controller;