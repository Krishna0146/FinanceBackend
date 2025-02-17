import Stock from "../models/Stock.js";
import MutualFund from "../models/MutualFund.js";
import yahooFinance from "yahoo-finance2"; // Import Yahoo Finance API

export const getAllStocks = async (req, res) => {
  try {
    // Fetch all stocks from the database
    const stocks = await Stock.find();
    const tickers = stocks.map(stock => `${stock.ticker}`);
    // Fetch live stock prices from Yahoo Finance
    const liveStockData = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const data = await yahooFinance.quote(ticker); 
          // Debugging: Log full response for problematic tickers
          if (!data || typeof data !== 'object') {
            console.error(`Invalid response for ${ticker}:`, data);
            return { ticker, price: 100, price_change_percentage_24h: 0 };
          }
          return {
            ticker,
            price: data?.regularMarketPrice || 100, // Default to 100 if unavailable
            price_change_percentage_24h: data?.regularMarketChangePercent || 0, // Default to 0%
          };
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error);
          return { ticker, price: 100, price_change_percentage_24h: 0 }; // Default values in case of error
        }
      })
    );
    // Merge live data with database stocks
    const updatedStocks = stocks.map((stock, index) => {
      return {
        ...stock.toObject(), // Convert Mongoose document to plain object
        price: liveStockData[index]?.price || 100,
        price_change_percentage_24h: liveStockData[index]?.price_change_percentage_24h || 0,
      };
    });
    // Send the updated stock data
    res.status(200).json(updatedStocks);
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ message: "Error fetching stocks", error: err });
  }
};

// Get a single stock by stock_id
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findOne({ stock_id: req.params.stock_id }); // Find stock by stock_id
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(stock); // Send the found stock
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stock', error: err });
  }
};

export const getAllMutualFunds = async (req, res) => {
  console.log("API getAllMutualFunds called");
  try {
    // Fetch all mutual funds from the database
    const mutualFunds = await MutualFund.find();
    console.log("Mutual Funds from DB:", mutualFunds);
    // Extract tickers (identifiers)
    const tickers = mutualFunds.map(fund => fund.mf_identifier);
    console.log("Mutual Fund Identifiers:", tickers);
    // Fetch live mutual fund prices from Yahoo Finance
    const liveFundData = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const data = await yahooFinance.quoteSummary(ticker, { modules: ["price"] });
          // Debugging: Log full response if needed
          if (!data || typeof data !== 'object') {
            console.error(`Invalid response for ${ticker}:`, data);
            return { ticker, price: "N/A", change_percentage: "N/A" };
          }
          return {
            ticker,
            price: data.price?.regularMarketPrice || "N/A", // Default to "N/A" if unavailable
            change_percentage: data.price?.regularMarketChangePercent || "N/A",
          };
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error);
          return { ticker, price: "N/A", change_percentage: "N/A" }; // Default values on error
        }
      })
    );
    // Merge live data with database mutual funds
    const updatedFunds = mutualFunds.map((fund, index) => {
      return {
        ...fund.toObject(), // Convert Mongoose document to a plain object
        price: liveFundData[index]?.price || "N/A",
        change_percentage: liveFundData[index]?.change_percentage || "N/A",
      };
    });
    // Send updated mutual fund data
    res.status(200).json(updatedFunds);
  } catch (err) {
    console.error("Error fetching mutual funds:", err);
    res.status(500).json({ message: "Error fetching mutual funds", error: err });
  }
};