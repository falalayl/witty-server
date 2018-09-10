var Archives = require('./archives.model');
var handler = require('../../services/handler');

var controller = {
    getEntries: (req, res) => {
        var period = req.query.period
        var user = req.query.user
        return Archives.find(period, user ? { period: period, userId: user } : {})
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
    getOverview: (req, res) => {
        var userId = req.params.user
        return Archives.find({ userId: userId })
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((archives) => {
                var grandTotalBudget = 0;
                var grandTotalExpenses = 0;
                var grandTotalSavings = 0;
                var data = {

                    Archives: archives.map(archive => {
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
                    grandTotalBudget: grandTotalBudget,
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