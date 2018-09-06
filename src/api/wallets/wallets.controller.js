var Wallet = require('./wallets.model');
var handler = require('../../services/handler');

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var n = new Date();
var m = month[n.getMonth()];
var y = n.getFullYear();
var period = m + " " + y;

var controller = {
    getEntries: function (req, res) {
        return Wallet.find()
            .populate('transactions')
            .exec()
            .then((wallets) => {
                res.status(200).send(wallets.map(wallet => {
                    return {
                        _id: wallet._id,
                        name: wallet.name,
                        transactions: wallet.transactions.length !== 0 ? wallet.transactions : 0,
                        period: wallet.period
                    };
                }));
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getTransactions: function (req, res) {
        return Wallet.findById(req.params.id)
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((wallet) => {
                res.status(200).send({
                    _id: wallet._id,
                    name: wallet.name,
                    transactions: wallet.transactions.length !== 0 ? wallet.transactions : 0
                });
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(err));
    },
    getMyWallets: function (req, res) {
        var user = req.params.user
        return Wallet.find({ userId: user })
            .populate('transactions')
            .populate('category', '-wallets')
            .where('period', period)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var user = req.params.user
        return Wallet.find({ userId: user })
            .populate('transactions')
            .populate('category')
            .where('period', period)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var budgetTotal = 0;
                var totalExpenses = 0;
                var data = {
                    userWallets: wallets.map(wallet => {
                        var walletExpenses = 0;
                        wallet.transactions.forEach(transaction => {
                            walletExpenses = walletExpenses + transaction.amount
                        });
                        budgetTotal = budgetTotal + wallet.amount;
                        totalExpenses = totalExpenses + walletExpenses;
                        return {
                            walletId: wallet._id,
                            walletName: wallet.name,
                            walletAmount: wallet.amount,
                            walletExpenses: walletExpenses,
                            walletCategory: wallet.categoryId,
                            walletCategory: wallet.category
                        };
                    }),
                    totalBudget: budgetTotal,
                    totalExpenses: totalExpenses,
                    average: totalBudget / userWallets.length
                }
                res.send(data);

                // var totalAmount = 0;
                // var feed = wallet.foreach(amount => {
                //   totalAmount = totalAmount + amount.amount
                // });

                // console.log(totalAmount);
                // res.send(wallet);
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