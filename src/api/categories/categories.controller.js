var Categories = require('./categories.model');
var handler = require('../../services/handler');

var controller = {
  getEntries: function (req, res) {
    return Categories.find()
      .populate('wallets', '_id')
      .then((categories) => {
        res.status(200).send(categories.map(category => {
          return {
            categoryId: category._id,
            categoryName: category.desc,
            categoryIcon: category.icon,
            categoryWallets: category.wallets
          };
        }))
      })
      .exec()
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  getEntry: function (req, res) {
    return Categories.findById(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  create: function (req, res) {
    return Categories.create(req.body)
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  update: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Categories.findByIdAndUpdate(req.params.id, req.body, {
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
    return Categories.findByIdAndRemove(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  }
};

module.exports = controller;