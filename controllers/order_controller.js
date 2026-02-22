const Order = require('../models/order_model');

exports.createOrder = async (req, res) => {
  console.log("CREATE ORDER HIT");
  console.log("REQ.USER:", req.user);
  console.log("REQ.BODY:", req.body);

  const userId = req.user._id; 
  const { products, totalPrice } = req.body;

  if (!products || products.length === 0) {
     console.log("No products provided");
    return res.status(400).json({ message: 'No products provided' });
  }

  const order = await Order.create({
    user: userId,
    products,
    totalPrice,
  });

  console.log("Order created:", order);
  res.status(201).json({ message: 'Order created', order });
};