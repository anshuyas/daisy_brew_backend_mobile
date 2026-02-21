const express = require('express');
const router = express.Router();

const { registerUser, loginUser, uploadProfilePicture, updateProfile, changePassword, updateShippingAddress } = require('../controllers/auth_controller');
const protect = require('../middleware/auth.js');
const { uploadImage } = require('../middleware/uploads'); 

// Register and login
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

// Profile picture upload 
router.post(
    '/profile/upload',
    protect,                               
    uploadImage.single('profilePicture'),  
    uploadProfilePicture                   
);
router.put('/users/update-profile', protect, updateProfile);
router.put('/users/change-password', protect, changePassword);
router.put('/users/shipping-address', protect, updateShippingAddress);

module.exports = router;
