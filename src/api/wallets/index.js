var express = require('express');
var router = express.Router();

var controller = require('./wallets.controller');
var auth = require('../../services/auth/jwt');

router.get('/', auth.optional, controller.getEntries);
router.get('/:id', auth.required, controller.getTransactions);
router.get('/user/:user', auth.required,controller.getMyWallets);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.destroy);


module.exports = router;