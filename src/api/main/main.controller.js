var config = require('../../config');

var controller = {
  home: function (req, res) {
    res.status(200).send({
      name: 'Wittyxx',
    });
  },
};

module.exports = controller;
