const multer = require('multer');
const path = require('path');
const Product = require('../models/product_model');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/product_images'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
// Get all products (with optional category filter)
exports.getProducts = async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available === 'true') filter.isAvailable = true; 
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Add a new product
exports.addProduct = [
  upload.single('image'), // expects field name 'image'
  async (req, res) => {
    try {
      const { name, category, price } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
      }

      const product = await Product.create({
        name,
        category,
        price,
        image: req.file.filename, // store only the filename
        isAvailable: true,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Failed to add product', error: err.message });
    }
  }
];

// Edit product
exports.editProduct = [
  upload.single('image'), // optional new image
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // If new image uploaded, save its filename
      if (req.file) {
        updates.image = req.file.filename;
      }

      const product = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
  }
];

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle availability', error: err.message });
  }
};