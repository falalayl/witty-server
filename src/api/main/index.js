var express = require('express');
var router = express.Router();

var controller = require('./main.controller');

// ROUTES
// GET: api/main/

router.get('/', controller.home);

module.exports = router;