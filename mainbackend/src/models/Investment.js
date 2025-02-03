import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        assetType: { type: String, required: true },
        amount: { type: Number, required: true },
        riskLevel: { type: String, required: true },
        status: { type: String, enum: ["active", "closed"], default: "active" },
    },
    { timestamps: true }
);

export default mongoose.model("Investment", InvestmentSchema);
