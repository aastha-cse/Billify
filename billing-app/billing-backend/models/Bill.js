const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  seller: { type: String, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      itemNumber: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  sum: { type: Number, required: true },
  netAmount: { type: Number, required: true }
});

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
