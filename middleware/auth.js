const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/user_model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (typeof next === "function") {
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = protect;
