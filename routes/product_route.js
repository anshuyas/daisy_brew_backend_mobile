const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controller');
const protectAdmin = require('../middleware/auth'); 

router.get('/', productController.getProducts); 
router.post('/', protectAdmin, ...productController.addProduct);
router.put('/:id', protectAdmin, ...productController.editProduct);
router.patch('/:id/toggle', protectAdmin, productController.toggleAvailability); 

module.exports = router;