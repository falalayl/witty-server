var Wallet = require('./wallets.model');
var handler = require('../../services/handler');

var controller = {
    getEntries: function (req, res) {
        return Wallet.find()
            .populate('first model', 'fields or minus fields')
            .populate({ path: 'user', select: 'name' })
            .populate({
                path: 'second model',
                select: 'field from second model',
                populate: { //nest from second model
                    path: '',
                    select: ''
                }
            })
            .select('-__v')
            .exec()
            .then((datas) => {
                res.status(200).send(data.map(data => {
                    return {
                        id: data.id,
                        name: data.name,
                        emp: data.emp.length !==0 ? data.emp: 'No Emp'
                    };
                }));
            })
            //.then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getEntry: function (req, res) {
        return Wallet.findById(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then((datas)=>{
                res.status(200).send({
                    id: datas.id,
                    name: datas.name
                })
            })
            //.then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getOne: function (req, res) {
        var userId = req.query.userID;
        return Wallet.findOne({ user: userId })
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Wallet.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Wallet.findByIdAndUpdate(req.params.id, req.body, {
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
        return Wallet.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    }
};

module.exports = controller;