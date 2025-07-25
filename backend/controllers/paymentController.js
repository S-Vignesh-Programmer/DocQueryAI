import dotenv from "dotenv";
dotenv.config({ quiet: true });

import Stripe from "stripe";
import User from "../models/User.js";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const user = req.user;
    const { plan } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: no user info" });
    }

    if (!user.email || !user._id) {
      return res.status(400).json({ message: "User info incomplete" });
    }

    if (!["premium", "premiumPlus"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const lineItem = {
      price_data: {
        currency: "inr",
        product_data: {
          name:
            plan === "premium"
              ? "DocQueryAI Premium Plan"
              : "DocQueryAI Premium Plus Plan",
        },
        unit_amount: plan === "premium" ? 99900 : 199900, 
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      mode: "payment",
      customer_email: user.email,
      line_items: [lineItem],
      metadata: {
        userId: user._id.toString(),
        plan,
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    res.status(500).json({
      message: "Failed to create Stripe session",
      details: err.message,
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET missing in .env");
    return res.status(500).send("Server misconfiguration");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    const user = await User.findById(userId);
    if (user) {
      user.plan = plan === "premiumPlus" ? "premiumPlus" : "premium";
      await user.save();
    } else {
      console.error("User not found for ID:", userId);
    }
  }

  res.json({ received: true });
};
