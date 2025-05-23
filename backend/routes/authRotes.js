const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile} = require("../controllers/authController")

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); 
router.post("/register", loginUser); 
router.get("/profile", protect, getUserProfile); 
router.put("/profile", protect, updateUserProfile);

module.exports = router;