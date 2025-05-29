require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRotes.js")
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");

const mongoose = require('./config/db.js');


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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("api/report", reportRoutes);
app.use("/api/task", taskRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));