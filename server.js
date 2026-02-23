const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); 
require('colors');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth_route');
const adminRoutes = require('./routes/admin_route');
const orderRoutes = require('./routes/order_route');
const productRoutes = require('./routes/product_route');

const startServer = async () => {
    try {
        // CONNECT DATABASE
        await connectDB();

        const app = express();

        // BODY PARSER
        app.use(express.json());

        // This allows return files from backend/public
        app.use('/public', express.static(path.join(__dirname, 'public')));

        // ROUTE MOUNT
        app.use('/api/v1', authRoutes);
        app.use('/api/v1/admin', adminRoutes);
        app.use('/api/v1/orders', orderRoutes);
        app.use('/api/v1/products', productRoutes);

        // TEST ROUTE
        app.get('/', (req, res) => {
            res.send('API running');
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`.green.bold);
      });

    } catch (err) {
        console.error(`Server start failed: ${err.message}`.red.bold);
        process.exit(1);
    }
};

startServer();
