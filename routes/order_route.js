const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders
} = require('../controllers/order_controller');

const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

// CREATE ORDER
router.post('/', protect, asyncHandler(createOrder));

// GET ALL ORDERS (ADMIN)
router.get('/', protect, asyncHandler(getAllOrders));

router.get('/my-orders', protect, asyncHandler(getMyOrders));

// GET SINGLE ORDER
router.get('/:id', protect, asyncHandler(getOrderById));

// UPDATE ORDER STATUS
router.put('/:id/status', protect, asyncHandler(updateOrderStatus));


module.exports = router;