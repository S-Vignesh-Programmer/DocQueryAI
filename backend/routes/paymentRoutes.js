import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Authenticated: user initiates checkout
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

// Stripe webhook: use express.raw()
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// Get current user plan
router.get("/my-plan", authMiddleware, async (req, res) => {
  try {
    res.json({
      email: req.user.email,
      plan: req.user.plan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch plan info" });
  }
});

// Downgrade
router.post("/downgrade", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    user.plan = "free";
    await user.save();

    res.json({ message: "Your account has been downgraded to Free plan." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to downgrade plan" });
  }
});

export default router;
