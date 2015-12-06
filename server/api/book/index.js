'use strict';

var express = require('express');
var controller = require('./book.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/proposeTrade', auth.isAuthenticated(), controller.proposeTrade);
router.post('/removeTrade', auth.isAuthenticated(), controller.removeTrade);
router.post('/acceptTrade', auth.isAuthenticated(), controller.acceptTrade);

module.exports = router;
