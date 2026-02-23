const Order = require('../models/order_model');
const User = require('../models/user_model');
const Product = require('../models/product_model');

// Admin Dashboard
const getAdminDashboard = async (req, res) => {
  try {
    // Total Orders
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const totalOrdersToday = await Order.countDocuments({ createdAt: { $gte: todayStart } });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    const totalOrdersWeek = await Order.countDocuments({ createdAt: { $gte: weekStart } });

    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);
    monthStart.setHours(0, 0, 0, 0);
    const totalOrdersMonth = await Order.countDocuments({ createdAt: { $gte: monthStart } });

    // Total Revenue
    const revenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Users & Products
    const activeUsers = await User.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

    // Weekly Revenue (Mon → Sun)
    const weeklyRevenue = Array(7).fill(0);
    const today = new Date();
    const dayOfWeek = today.getDay();

    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      day.setDate(today.getDate() + mondayOffset + i);

      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      weeklyRevenue[i] = await Order.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });
    }

    res.status(200).json({
      totalOrdersToday,
      totalOrdersWeek,
      totalOrdersMonth,
      totalRevenue,
      activeUsers,
      lowStockCount,
      weeklyRevenue,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Users
const getUsers = async (req, res) => {
  try {
 console.log("GET USERS HIT");
     const users = await User.find().select('-password');
         console.log("USERS FOUND:", users.length);
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    if (!req.body || !req.body.role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAdminDashboard,
  getUsers,
  updateUserRole,
  deleteUser,
};