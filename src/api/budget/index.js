var express = require('express');
var router = express.Router();

var controller = require('./budget.controller');
var auth = require('../../services/auth/jwt');

// ROUTES
// GET: api/categories/
// GET: api/categories/:id
// POST: api/categories/
// PUT: api/categories/:id
// DELETE: api/categories/:id

router.get('/', auth.optional, controller.getEntries);
router.get('/:id', auth.optional, controller.getEntry);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.optional, controller.destroy);
router.get('/:userId', auth.optional, controller.getOne);

module.exports = router;