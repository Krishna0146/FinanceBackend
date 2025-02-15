import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for stocks
const stockSchema = new Schema({
  stock_id: {
    type: String,
    required: true,
    unique: true, // Ensures each stock_id is unique
  },
  stock_name: {
    type: String,
    required: true,
  },
  ticker: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
});

// Create a model from the schema
const Stock = mongoose.model("Stock", stockSchema);

export default Stock; // Use ES6 export