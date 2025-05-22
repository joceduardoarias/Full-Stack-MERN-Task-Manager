require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Console } = require("console");

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

// Routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => Console.log(`Servidor corriendo en http://localhost:${PORT}`));