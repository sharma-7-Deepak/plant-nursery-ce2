/**
 * routes/payment.js
 * Mock Payment API route for checkout functionality
 * This simulates a payment endpoint (you can replace it later with Stripe, Razorpay, etc.)
 */

const express = require("express");
const router = express.Router();

// ✅ POST /api/payment/checkout
router.post("/checkout", async (req, res) => {
  try {
    const { name, email, amount, method } = req.body;

    // Basic validation
    if (!name || !email || !amount || !method) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment details.",
      });
    }

    console.log("💳 Payment request received:", { name, email, amount, method });

    // Simulate payment success
    const transactionId = "TXN" + Math.floor(Math.random() * 1_000_000_000);

    // You could log this transaction in PostgreSQL later
    res.status(200).json({
      success: true,
      message: "Payment processed successfully (mock)",
      transactionId,
      details: { name, email, amount, method },
    });
  } catch (err) {
    console.error("❌ Payment error:", err.message);
    res.status(500).json({ success: false, error: "Internal payment error" });
  }
});

module.exports = router;
