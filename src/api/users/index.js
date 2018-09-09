var express = require('express');
var router = express.Router();

var controller = require('./users.controller');
var auth = require('../../services/auth/jwt');

router.get('/', controller.getAll);
router.post('/register', auth.optional, controller.register);
router.post('/login', auth.optional, controller.login);
router.get('/me', auth.required, controller.me);
router.get('/logout', controller.logout);
router.put('/:id', auth.required, controller.update);
router.put('/changePassword/:id', auth.optional, controller.changePassword);
router.delete('/:id', auth.optional, controller.destroy);

module.exports = router;