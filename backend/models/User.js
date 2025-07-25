import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    dailyCount: {
      type: Number,
      default: 0,
    },
    lastResetDate: {
      type: Date,
      default: () => new Date(),
    },
    plan: {
      type: String,
      enum: ["free", "premium", "premiumPlus"],
      default: "free",
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.model("User", userSchema);
