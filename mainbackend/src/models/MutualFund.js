import mongoose from "mongoose";

const mutualFundSchema = new mongoose.Schema({
  mf_id: {
    type: String,
    required: true,
    unique: true
  },
  mf_name: {
    type: String,
    required: true
  },
  mf_identifier: {
    type: String,
    required: true,
    unique: true
  },
  fund_category: {
    type: String,
    required: true,
    enum: ["Equity", "Debt", "Hybrid", "ELSS"] // Restrict to valid categories
  }
});

const MutualFund = mongoose.model("MutualFund", mutualFundSchema);

export default MutualFund;