import Bond from "../models/Bond.js";
import BondData from "../models/Bonddata.js";

export const getBonds = async (req, res) => {
    try {
        const bonds = await Bond.find(); // Fetch all bonds from DB
        res.json(bonds);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bonds" });
    }
};

// POST method to store bond data in BondData schema
export const addBondToPortfolio = async (req, res) => {
    const { username, bondId, bondName, bondType, couponRate, maturity, faceValue } = req.body;

    try {
        // Check if the user already has a record in BondData
        let user = await BondData.findOne({ username });

        // If the user does not exist, create a new user record
        if (!user) {
            const newUser = new BondData({
                username,
                bonds: [{
                    bond_id: bondId,
                    bond_name: bondName,
                    bond_type: bondType,
                    coupon_rate: couponRate,
                    maturity,
                    face_value: faceValue
                }]
            });

            await newUser.save();
            return res.status(201).json({ message: "Bond added to new user portfolio", bond: newUser });
        }

        // If the user exists, push the new bond to their portfolio
        user.bonds.push({
            bond_id: bondId,
            bond_name: bondName,
            bond_type: bondType,
            coupon_rate: couponRate,
            maturity,
            face_value: faceValue
        });

        await user.save();
        res.status(200).json({ message: "Bond added to user portfolio", bond: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding bond to portfolio" });
    }
};

export const getbonddata = async (req, res) => {
    const { username } = req.params; // Extract the username from the URL parameters
  
    try {
      // Find the user by username and retrieve the bond data
      const user = await BondData.findOne({ username });
  
      // If user doesn't exist, return a 404 error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send the user's bond data in the response
      res.status(200).json(user.bonds); // Return the bonds array directly
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching bond data' });
    }
  };  