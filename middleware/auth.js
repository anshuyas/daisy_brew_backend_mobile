const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

// Protect middleware
const protect = async (req, res, next) => {
  console.log("PROTECT MIDDLEWARE HIT");
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("TOKEN:", token);

  if (!token) {
    console.log("No token sent");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT DECODED:", decoded);

    req.user = await User.findById(decoded.id);
    console.log("USER FOUND:", req.user ? req.user.email : "null");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.log("PROTECT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const admin = async (req, res, next) => {
  try {
    console.log("ADMIN MIDDLEWARE HIT, role =", req.user?.role);

    if (!req.user) {
      console.log("ADMIN FAILED: no user attached");
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      console.log("ADMIN FAILED: user is not admin");
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    console.log("ADMIN OK");
    next();
  } catch (err) {
    console.log("ADMIN ERROR:", err.message);
    return res.status(500).json({ message: "Server error in admin middleware" });
  }
};

module.exports = { protect, admin };