import mongoose from "mongoose";

// Counter schema for auto-incrementing portfolio_id & asset_id
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", CounterSchema);

// Function to generate auto-incremented portfolio_id
async function getNextPortfolioId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "portfolio_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Function to generate auto-incremented asset_id
async function getNextAssetId() {
  const counter = await Counter.findOneAndUpdate(
    { name: "asset_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Holdings Schema
const HoldingSchema = new mongoose.Schema({
  asset_id: { type: Number, unique: true },
  asset: { type: String, enum: ["Stock", "MutualFund", "Bond"], required: true },
  name: { type: String, required: true },
  bought_price: { type: Number, required: true },
  qty: { type: Number, required: true },
  date_purchased: { type: Date, required: true }
});

// Middleware to auto-generate asset_id before saving
HoldingSchema.pre("save", async function (next) {
  if (!this.asset_id) {
    this.asset_id = await getNextAssetId();
  }
  next();
});

// Portfolio Schema
const PortfolioSchema = new mongoose.Schema({
  portfolio_id: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  holdings: [HoldingSchema] // Holds multiple assets
});

// Middleware to auto-generate portfolio_id for new users
PortfolioSchema.pre("save", async function (next) {
  if (!this.portfolio_id) {
    this.portfolio_id = await getNextPortfolioId();
  }
  next();
});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export { Portfolio, Counter };