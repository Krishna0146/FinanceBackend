import Investment from "../models/Investment.js";

export const addInvestment = async (req, res) => {
    try {
        const { assetType, amount, riskLevel } = req.body;
        const newInvestment = new Investment({
            userId: req.user.id,
            assetType,
            amount,
            riskLevel,
        });

        await newInvestment.save();
        res.status(201).json(newInvestment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ userId: req.user.id });
        res.json(investments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
