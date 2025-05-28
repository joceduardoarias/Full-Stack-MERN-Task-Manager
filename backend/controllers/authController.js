const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToke = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// @desc  Register a new user
// @route POST /api/auth/register
// @acces Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Determine user role: Admin if correct token is provided, otherwise Member
        let role = "member"
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);        
        
        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });
        
        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToke(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc  Login user
// @route POST /api/auth/login
// @acces Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password"});
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" }); 
        }

         // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToke(user._id)
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc  Get user profile
// @route GET /api/auth/profile
// @acces Public
const getUserProfile = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// @desc  Update user profile
// @route PUT /api/auth/profile
// @acces Public
const updateUserProfile = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };