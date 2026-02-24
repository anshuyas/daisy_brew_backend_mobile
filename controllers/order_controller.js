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

   const formattedProducts = products.map((item) => ({
    productId: item.productId,   
    name: item.name,             
    quantity: item.quantity,
    price: item.price,
  }));

  const order = await Order.create({
    user: userId,
    products: formattedProducts,
    totalPrice,
    status: "pending",
  });

  console.log("Order created:", order);
  res.status(201).json({ message: 'Order created', order });
};
// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user');

  res.status(200).json(orders);
};

// GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user');

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
};

// UPDATE STATUS
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.status(200).json(order);
};

// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(orders);
};