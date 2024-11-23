const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});

// Bill Schema
const billSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  seller: { type: String, required: true },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  sum: { type: Number, required: true },
});

const Bill = mongoose.model("Bill", billSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route to fetch all bills
app.get("/bills", async (req, res) => {
  try {
    const bills = await Bill.find({});
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving bills" });
  }
});

// Route to save a bill
app.post("/bills", async (req, res) => {
  try {
    const billData = req.body;
    const bill = new Bill(billData);
    await bill.save();
    res.status(201).json({ message: "Bill saved successfully!", savedBill: bill });
  } catch (error) {
    res.status(500).json({ error: "Error saving bill" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
