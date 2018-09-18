var express = require('express');
var router = express.Router();

var controller = require('./users.controller');
var authentication = require('./users.authentication');
var auth = require('../../services/auth/jwt');

router.get('/', controller.getAll);
router.delete('/:id', auth.optional, controller.destroy);
router.put('/:id', auth.required, controller.update);
router.get('/profile/:id', auth.required, controller.profile);

router.post('/register', auth.optional, authentication.register);
router.post('/login', auth.optional, authentication.login);
router.get('/:id', auth.required, authentication.me);
router.get('/logout', authentication.logout);
router.put('/changePassword/:id', auth.required, authentication.changePassword);


module.exports = router;