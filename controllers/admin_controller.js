const Order = require('../models/order_model');
const User = require('../models/user_model');
const Product = require('../models/product_model');

exports.getAdminDashboard = async (req, res) => {
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

    //  Total Revenue 
    const revenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    //  Users & Products 
    const activeUsers = await User.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

   // Sales Trend (last 7 days, Mon → Sun)
const weeklyRevenue = Array(7).fill(0); // index 0 = Monday

// Today
const today = new Date();
const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

// Loop Monday → Sunday
for (let i = 0; i < 7; i++) {
  // Calculate the date for Monday + i
  const day = new Date(today);
  
  // Offset: find Monday of this week
  const mondayOffset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek); // if Sunday, go back 6 days
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