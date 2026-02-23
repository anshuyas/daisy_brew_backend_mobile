const express = require('express');
const router = express.Router();

const {
  getProducts,
  addProduct,
  editProduct,
  toggleAvailability
} = require('../controllers/product_controller');

const { protect, admin } = require('../middleware/auth');

// Public
router.get('/', getProducts);

// Admin only
router.post('/', protect, admin, addProduct);
router.put('/:id', protect, admin, editProduct);
router.patch('/:id/toggle', protect, admin, toggleAvailability);

module.exports = router;