const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phoneNumber, username } = req.body;

    if (!email || !password || !fullName || !username) {
        return res.status(400).json({
            success: false,
            message: 'Required fields missing'
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        username
    });

    res.status(201).json({
        success: true,
        data: user
    });
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    user.password = undefined;

    res.status(200).json({
        success: true,
        token,
        data: user
    });
};
