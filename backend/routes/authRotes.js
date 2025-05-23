const express = require("express");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); 
router.post("/register", loginUser); 
router.post("/profile", protect, getUserProfile); 
router.put("/profile", protect, updateuserProfile);

module.exports = router;