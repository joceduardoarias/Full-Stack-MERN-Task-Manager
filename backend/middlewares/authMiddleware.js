const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middelware to protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; //Extrac token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (err) {
        res.status(401).json({ message: "Token failed", error: err.message });
    }
}

// Middleware for Admin-only acces

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json = ({ message: " Access denied, admin only" });
    }
}

module.exports = { protect, adminOnly };