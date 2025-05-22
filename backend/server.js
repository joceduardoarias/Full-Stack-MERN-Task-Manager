require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const mongoose = require('./config/db.js');
const { connect } = require("http2");

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"]
    })
);

// Middleware
app.use(express.json());

// Connect DataBase
mongoose();

// Routes
// app.use("api/auth", authRoutes);
// app.use("api/report", reportRoutes);
// app.use("api/task", taskhRoutes);
// app.use("api/user", userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));