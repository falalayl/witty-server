var Wallet = require('./wallets.model');
var handler = require('../../services/handler');
var mla = require('../../services/mlregression');

var controller = {
  getEntries: function (req, res) {
    return Wallet.find()
      // .populate('first model', 'fields or minus fields')
      // .populate({ path: 'user', select: 'name' })
      // .populate({
      //     path: 'second model',
      //     select: 'field from second model',
      //     populate: { //nest from second model
      //         path: '',
      //         select: ''
      //     }
      // })
      // .select('-__v')
      .exec()
      // .then((datas) => {
      //     res.status(200).send(data.map(data => {
      //         return {
      //             id: data.id,
      //             name: data.name,
      //             emp: data.emp.length !==0 ? data.emp: 'No Emp'
      //         };
      //     }));
      // })
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  getTransactions: function (req, res) {
    return Wallet.findById(req.params.id)
      .populate('transactions', '-__v')
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((wallet) => {
        res.status(200).send({
          _id: wallet._id,
          name: wallet.name,
          transactions: wallet.transactions
        });
      })
      // .then(handler.respondWithResult(res))
      .catch(handler.handleError(err));
  },
  getMyWallets: function (req, res) {
    var user = req.params.user
    return Wallet.find({ user: user })
      .populate('transactions')
      .populate('category')
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((wallets) => {

        var transaction = (wallet) => {
          var total = 0;
          return wallet.transactions.map(transaction => {
            return total + transaction.amount;
          })
        }
        
        var forecast = datas.map(wallet => {   
          return {
            total: wallet.ammount,
            transactions: transaction(wallet)
          };
        })

        res.status(200).send({
          id: datas._id,
          // name: datas.name,
          forecast: forecast
        })
      })
      // .then(handler.respondWithResult(res))
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