
// ======================================================
// DeepSINKY AI
// backend/server.js
// Version : 1.0.0
// ======================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// ======================================
// Environment
// ======================================

dotenv.config();

// ======================================
// Create Express App
// ======================================

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================
// Middlewares
// ======================================

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));

// ======================================
// Health Check
// ======================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        name: process.env.APP_NAME,

        version: process.env.APP_VERSION,

        status: "Running",

        message: "Welcome to DeepSINKY AI"

    });

});

// ======================================
// API Status
// ======================================

app.get("/api/status", (req, res) => {

    res.json({

        success: true,

        api: "Online",

        uptime: process.uptime(),

        environment: process.env.NODE_ENV

    });

});

// ======================================
// Placeholder Routes
// ======================================

app.post("/api/chat", (req, res) => {

    res.json({

        success: true,

        message: "Chat API Coming Soon"

    });

});

app.post("/api/image", (req, res) => {

    res.json({

        success: true,

        message: "Image API Coming Soon"

    });

});

app.post("/api/search", (req, res) => {

    res.json({

        success: true,

        message: "Search API Coming Soon"

    });

});

app.post("/api/auth", (req, res) => {

    res.json({

        success: true,

        message: "Authentication Coming Soon"

    });

});

// ======================================
// 404 Handler
// ======================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "Route Not Found"

    });

});

// ======================================
// Global Error Handler
// ======================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        error: "Internal Server Error"

    });

});

// ======================================
// Start Server
// ======================================

app.listen(PORT, () => {

    console.log("====================================");

    console.log("DeepSINKY AI Started");

    console.log(`Server : http://localhost:${PORT}`);

    console.log(`Mode   : ${process.env.NODE_ENV}`);

    console.log("====================================");

});
