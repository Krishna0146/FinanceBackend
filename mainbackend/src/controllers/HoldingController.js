import {Portfolio} from "../models/Holding.js"; // Import Portfolio Model

// Function to add or update a user's portfolio
export const addPortfolio = async (req, res) => {
  try {
    const { username, asset, name, bought_price, qty, date_purchased } = req.body;

    // Check if the user already has a portfolio
    let portfolio = await Portfolio.findOne({ username });

    // Create a new investment object
    const newInvestment = {
      asset,
      name,
      bought_price,
      qty,
      date_purchased,
    };

    if (!portfolio) {
      // If new user, create a new portfolio
      portfolio = new Portfolio({
        username,
        holdings: [newInvestment],
      });
    } else {
      // If user exists, add new investment to existing holdings
      portfolio.holdings.push(newInvestment);
    }

    await portfolio.save();
    res.status(201).json({ message: "Portfolio updated successfully", portfolio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    console.log("Received request for:", req.params.username);
    const portfolio = await Portfolio.findOne({ username: req.params.username });
    if (!portfolio) {
      console.log("Portfolio not found");
      return res.status(404).json({ message: "Portfolio not found" });
    }
    //console.log("Sending response:", portfolio);
    res.json(portfolio);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPortfolioByName = async (req, res) => {
  try {
    const { username, name } = req.params;

    console.log(`Fetching portfolio for username: ${username}, holding: ${name}`);

    // Find user's portfolio
    const portfolio = await Portfolio.findOne({ username });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Find all holdings with the given name
    const holdings = portfolio.holdings.filter(h => h.name === name);

    if (holdings.length === 0) {
      return res.status(404).json({ message: "Holding not found" });
    }

    res.json({ holdings });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEachHold = async (req, res) => {
  try {
    const { username, id } = req.params; // Extract username & asset_id
    const { qty, bought_price, date_purchased } = req.body;

    // Validate input
    if (!id || qty === undefined || bought_price === undefined || !date_purchased) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (isNaN(qty) || isNaN(bought_price)) {
      return res.status(400).json({ error: "Invalid data type" });
    }

    // Find portfolio by username and update the specific holding
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { username, "holdings._id": id }, // Find by username & asset_id
      {
        $set: {
          "holdings.$.qty": qty,
          "holdings.$.bought_price": bought_price,
          "holdings.$.date_purchased": date_purchased,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ error: "Holding not found" });
    }

    return res.json({ message: "Holding updated successfully", updatedPortfolio });
  } catch (error) {
    console.error("Error updating holding:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const deleteHolding = async (req, res) => {
  try {
    const { username, id } = req.params;
    console.log(`Deleting holding for user: ${username}, ID: ${id}`);

    const portfolio = await Portfolio.findOne({ username });

    if (!portfolio) {
      console.log("Portfolio not found");
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const holdingExists = portfolio.holdings.some(h => h._id.toString() === id);

    if (!holdingExists) {
      console.log("Holding not found in portfolio");
      return res.status(404).json({ message: "Holding not found" });
    }

    portfolio.holdings = portfolio.holdings.filter(h => h._id.toString() !== id);
    await portfolio.save();

    console.log("Holding deleted successfully");
    res.json({ message: "Holding deleted successfully", portfolio });
  } catch (error) {
    console.error("Error deleting holding:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};