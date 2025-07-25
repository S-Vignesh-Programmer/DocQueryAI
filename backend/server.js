import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Connect to DB
connectDB();

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Stripe webhook needs raw body BEFORE express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes // note: you export just the webhook handler in `paymentRoutes` for this
);

// Parse JSON for everything else
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (_, res) => {
  res.send("DocQueryAI Backend Running");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
