import express from 'express';
import {
  getPricingTiers,
  createPricingTier,
  deletePricingTier
} from '../controllers/pricingTierController.js';

const router = express.Router();

router.get('/', getPricingTiers);
router.post('/', createPricingTier);
router.delete('/:id', deletePricingTier);

export default router;
