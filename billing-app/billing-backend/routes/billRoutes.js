const express = require("express");
const Bill = require("../models/Bill");

const router = express.Router();

// Route to save a bill
router.post("/", async (req, res) => {
  const { date, seller, items, totalAmount, sum, netAmount } = req.body;

  try {
    const newBill = new Bill({
      date,
      seller,
      items,
      totalAmount,
      sum,
      netAmount
    });

    await newBill.save();
    res.status(201).json({ message: "Bill saved successfully!", bill: newBill });
  } catch (err) {
    console.error("Error saving bill:", err);
    res.status(500).json({ message: "Error saving bill", error: err });
  }
});

module.exports = router;
