import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Utility to create JWT
 */
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      passwordHash,
      dailyCount: 0,
      lastResetDate: new Date(),
    });
    await user.save();

    const token = createToken(user._id);
    res.status(201).json({
      token,
      user: {
        email: user.email,
        dailyCount: user.dailyCount,
        lastResetDate: user.lastResetDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({
      token,
      user: {
        email: user.email,
        dailyCount: user.dailyCount,
        lastResetDate: user.lastResetDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get current logged-in user's profile
 */
export const me = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      email: user.email,
      dailyCount: user.dailyCount,
      lastResetDate: user.lastResetDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
