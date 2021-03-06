var Archives = require('./archives.model');
var handler = require('../../services/handler');

var controller = {
    getEntries: (req, res) => {
        return Archives.find()
            .exec()
            .then((archives) => {
                res.status(200).send(archives.map(archive => {
                    return {
                        _id: archive._id,
                        period: archive.period,
                        totalBudget: archive.totalBudget,
                        totalExpenses: archive.totalExpenses,
                        totalSavings: archive.totalSavings
                    }
                }))
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getEntry: function (req, res) {
        return Transaction.findById(req.params.id)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((archive) => {
                res.status(200).send({
                    _id: archive._id,
                    totalBudget: archive.totalBudget,
                    totalExpenses: archive.totalExpenses,
                    totalSavings: archive.totalSavings,
                    extraSavings: archive.totalBudget - (archive.totalExpenses + archive.totalSavings)
                });
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getOverview: (req, res) => {
        var period = req.query.period
        var userId = req.params.user
        return Archives.find(period ? { userId: userId, period: period } : { userId: userId })
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((archives) => {
                var grandTotalBudget = 0;
                var grandTotalExpenses = 0;
                var grandTotalSavings = 0;
                var data = {
                    x: archives.map(archive => {
                        grandTotalBudget = grandTotalBudget + archive.totalBudget
                        grandTotalExpenses = grandTotalExpenses + archive.totalExpenses
                        grandTotalSavings = grandTotalSavings + archive.totalSavings
                        return {
                            period: archive.period,
                            totalBudget: archive.totalBudget,
                            totalExpenses: archive.totalExpenses,
                            totalSavings: archive.totalSavings,
                            extraSavings: archive.totalBudget - (archive.totalExpenses + archive.totalSavings)
                        }
                    }),
                    grandTotalBudget: grandTotalBudget ? grandTotalBudget : 0,
                    grandTotalExpenses: grandTotalExpenses,
                    grandTotalSavings: grandTotalSavings,
                    averageMonthlyBudget: grandTotalBudget / archives.length,
                    averageMonthlyExpenses: grandTotalExpenses / archives.length,
                    averageMonthlySavings: grandTotalSavings / archives.length,
                    grandTotalExtraSavings: grandTotalBudget - (grandTotalExpenses + grandTotalSavings)
                }
                res.send(data);
            })
    },
    create: (req, res) => {
        return Archives.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    }

}

module.exports = controller;