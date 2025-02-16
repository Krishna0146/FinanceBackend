import mongoose from "mongoose";

const sellHistorySchema = new mongoose.Schema({
  asset: { type: String, required: true },
  name: { type: String, required: true },
  bought_price: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  sellingQuantity: { type: Number, required: true },
  sellingDate: { type: Date, required: true },
  profitOrLoss: { type: Number, required: true } // ✅ Fixed field name
});

const userSchema = new mongoose.Schema(
  {
    PNL: { type: String, unique: true }, // Unique PNL ID
    username: { type: String, required: true, unique: true },
    sellHistory: [sellHistorySchema]
  },
  { collection: "sellPortfolios" } // Explicitly set collection name
);

// **Pre-save hook to generate unique PNL ID**
userSchema.pre("save", async function (next) {
  if (!this.PNL) {
    try {
      const userCount = await SellPortfolio.estimatedDocumentCount(); // ✅ Optimized counting
      this.PNL = `PNL_${(userCount + 1).toString().padStart(2, "0")}`; // Format: PNL_01, PNL_02, etc.
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const SellPortfolio = mongoose.model("SellPortfolio", userSchema, "sellPortfolios");

export default SellPortfolio;