var mlregression = require('ml-regression-multivariate-linear');

var regressionModel = new Function();

module.exports = {
    learn: function (input, output) {
        regressionModel = new mlregression(input,output);
        return 'Regression data loaded.';
    },
    predict: function(input) {
        return regressionModel.predict(input);
    }
}