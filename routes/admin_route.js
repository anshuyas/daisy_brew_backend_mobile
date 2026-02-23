const express = require('express');
const router = express.Router();
const {getAdminDashboard,
  getUsers,
  updateUserRole,
  deleteUser} = require('../controllers/admin_controller');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, getAdminDashboard);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);
module.exports = router;