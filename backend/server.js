import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = process.env.FRONTEND_URL;


// Handle CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Not allowed"));
      }
    },
    credentials: true,
  })
);

// Handle preflight OPTIONS requests
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Not allowed (OPTIONS)"));
      }
    },
    credentials: true,
  })
);

// Stripe webhook (must use raw body)
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes
);

// Body parser for normal routes
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/payment", paymentRoutes);

// Root endpoint
app.get("/", (_, res) => {
  res.send("DocQueryAI Backend is Running");
});

// Start server
const PORT = process.env.PORT || 5015;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
