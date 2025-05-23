const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToke = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {expiresIn: "7d"});    
}

// @desc  Register a new user
// @route POST /api/auth/register
// @acces Public
const registerUser = async (req, res) => {
    
}

// @desc  Login user
// @route POST /api/auth/login
// @acces Public
const loginUser = async (req, res) => {
    
}

// @desc  Get user profile
// @route GET /api/auth/profile
// @acces Public
const getUserProfile = async (req, res) => {
    
}

// @desc  Update user profile
// @route PUT /api/auth/profile
// @acces Public
const updateUserProfile = async (req, res) => {
    
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };