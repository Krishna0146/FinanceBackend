import {Portfolio} from "../models/Holding.js";
import SellPortfolio from "../models/Selling.js";

export const addSellPortfolio = async (req, res) => {
  try {
    const { username, asset, name, sellingPrice, sellingQuantity, sellingDate } = req.body;
    let userPortfolio = await Portfolio.findOne({ username });
    if (!userPortfolio) {
      return res.status(400).json({ error: "No portfolio found for this user" });
    }
    // Get all holdings with the same name and sort them by date (latest first)
    let holdings = userPortfolio.holdings
      .filter(h => h.name === name)
      .sort((a, b) => new Date(b.date_purchased) - new Date(a.date_purchased));

    let totalQty = holdings.reduce((sum, h) => sum + h.qty, 0);

    if (sellingQuantity > totalQty) {
      return res.status(400).json({ error: "Not enough stock available to sell" });
    }

    let remainingToSell = sellingQuantity;
    let stocksToRemove = [];
    let totalBoughtPrice = 0;

    for (let holding of holdings) {
      if (remainingToSell <= 0) break;

      if (holding.qty <= remainingToSell) {
        // Remove entire holding
        totalBoughtPrice += holding.qty * holding.bought_price;
        remainingToSell -= holding.qty;
        stocksToRemove.push(holding._id); // ✅ Mark for deletion
      } else {
        // Update remaining qty of last required holding
        totalBoughtPrice += remainingToSell * holding.bought_price;
        holding.qty -= remainingToSell;
        remainingToSell = 0;
      }
    }

    // ✅ Remove only the sold stocks
    userPortfolio.holdings = userPortfolio.holdings.filter(h => !stocksToRemove.includes(h._id));

    // ✅ Update the database (remove sold stocks, update remaining qty)
    await Portfolio.updateOne(
      { username },
      { $set: { holdings: userPortfolio.holdings } }
    );

    const totalSellingValue = sellingPrice * sellingQuantity;
    const profitOrLoss = totalSellingValue - totalBoughtPrice;

    // Update Sell Portfolio
    let userSellHistory = await SellPortfolio.findOne({ username });

    if (!userSellHistory) {
      userSellHistory = new SellPortfolio({
        username,
        sellHistory: [{ asset, name, bought_price: totalBoughtPrice, sellingPrice, sellingQuantity, sellingDate, profitOrLoss }]
      });
    } else {
      userSellHistory.sellHistory.push({ asset, name, bought_price: totalBoughtPrice, sellingPrice, sellingQuantity, sellingDate, profitOrLoss });
    }

    await userSellHistory.save();
    console.log("Removed Stocks:", stocksToRemove); // ✅ Now it will print correctly!

    res.status(201).json({
      message: "Sell processed successfully",
      updatedPortfolio: userPortfolio,
      removedStocks: stocksToRemove,
      sellHistory: userSellHistory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};