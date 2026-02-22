const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Check required fields
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'user'
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = user.getSignedJwtToken();
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            data: {
                fullName: user.fullName,
                email: user.email,
                role: user.role, 
      }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// FORGOT PASSWORD
exports.forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate a unique token
    // Generate 6-digit numeric OTP
const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

// Save hashed OTP
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
user.resetPasswordToken = hashedToken;
user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // OTP valid 10 minutes
await user.save();

    const message = `
  <h3>Password Reset Request</h3>
  <p>Your OTP for password reset is:</p>
  <h1>${resetToken}</h1>
  <p>This OTP expires in 10 minutes.</p>
`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

     res.status(200).json({
      success: true,
      message: 'Reset link sent to email',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// RESET PASSWORD
exports.resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            filename: req.file.filename,
            url: `/public/profile_pictures/${req.file.filename}`
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { fullName, email, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing current or new password" });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    user.shippingAddress = req.body.shippingAddress;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Shipping address updated successfully',
      shippingAddress: user.shippingAddress,
    });

  } catch (error) {
    console.error("Update shipping address error:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};