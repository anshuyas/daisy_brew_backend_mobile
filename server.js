const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); 
require('colors');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');

const startServer = async () => {
    try {
        // CONNECT DATABASE
        await connectDB();

        const app = express();

        // BODY PARSER
        app.use(express.json());

        // This allows return files from backend/public
        app.use('/public', express.static(path.join(__dirname, 'public')));

        // ROUTE IMPORT
        const authRoutes = require('./routes/auth_route');

        // ROUTE MOUNT
        app.use('/api/v1', authRoutes);

        // TEST ROUTE
        app.get('/', (req, res) => {
            res.send('API running');
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`.green.bold);
        });
    } catch (err) {
        console.error(`Server start failed: ${err.message}`.red.bold);
        process.exit(1);
    }
};

startServer();
