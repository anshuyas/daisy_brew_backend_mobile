const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order_controller');
const {protect} = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

router.post('/', protect, asyncHandler(createOrder));

module.exports = router;