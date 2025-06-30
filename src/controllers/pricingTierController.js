import PricingTier from "../models/pricingTier.js";


// GET all pricing tiers
export const getPricingTiers = async (req, res) => {
  try {
    const tiers = await PricingTier.find();
    res.json(tiers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new pricing tier
export const createPricingTier = async (req, res) => {
  try {
    const newTier = new PricingTier(req.body);
    const saved = await newTier.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a pricing tier by ID
export const deletePricingTier = async (req, res) => {
  try {
    const deleted = await PricingTier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tier not found' });
    res.json({ message: 'Tier deleted', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
