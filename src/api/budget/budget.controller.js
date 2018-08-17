var Budget = require('./budget.model');
var handler = require('../../services/handler');

var controller = {
    getEntries: function (req, res) {
        return Budget.find()
            .populate('_user')
            .exec()
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getEntry: function (req, res) {
        return Budget.findById(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getOne: function (req, res) {
        var userId = req.query.userID;
        return Budget.find(userId).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Budget.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Budget.findByIdAndUpdate(req.params.id, req.body, {
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
        return Budget.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    }
};

module.exports = controller;