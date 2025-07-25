import fetch from "node-fetch";

// Updated daily limits
const DAILY_LIMITS = {
  free: 10,
  premium: 50,
  premiumPlus: Infinity,
};

export const askQuestion = async (req, res) => {
  try {
    const user = req.user;
    const { pdfText, question } = req.body;

    if (!pdfText || !question) {
      return res
        .status(400)
        .json({ message: "PDF text and question are required" });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastReset = user.lastResetDate
      ? user.lastResetDate.toISOString().split("T")[0]
      : null;

    // Reset daily count if day has changed
    if (lastReset !== today) {
      user.dailyCount = 0;
      user.lastResetDate = new Date();
    }

    const plan = user.plan || "free";
    const dailyLimit = DAILY_LIMITS[plan] ?? DAILY_LIMITS["free"];

    // Check daily limit if not unlimited
    if (dailyLimit !== Infinity && user.dailyCount >= dailyLimit) {
      return res.status(403).json({
        message: "Daily limit reached. Please upgrade your plan.",
        remaining: 0,
        dailyLimit,
        plan,
      });
    }

    const prompt = `
You are an assistant answering questions about a PDF document. 
Here is the document content:
""" 
${pdfText.slice(0, 10000)} 
""" 
Question: ${question}
Answer:
    `.trim();

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return res.status(502).json({
        message: "Error contacting Gemini AI service",
        details: errorText,
      });
    }

    const data = await geminiResponse.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No response from AI";

    if (dailyLimit !== Infinity) {
      user.dailyCount += 1;
      await user.save();
    }

    res.json({
      answer,
      usage: {
        usedToday: user.dailyCount,
        remaining:
          dailyLimit === Infinity
            ? "Unlimited"
            : Math.max(0, dailyLimit - user.dailyCount),
        dailyLimit: dailyLimit === Infinity ? "Unlimited" : dailyLimit,
        resetAt: user.lastResetDate,
        plan,
      },
    });
  } catch (err) {
    console.error("askQuestion error:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};
