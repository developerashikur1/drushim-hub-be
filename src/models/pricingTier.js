import mongoose from 'mongoose';

const pricingTierSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: '₪'
  },
  credits: {
    type: Number,
    required: true
  },
  features: {
    type: [String],
    required: true
  },
  ctaText: {
    type: String,
    default: 'הירשמו עכשיו'
  },
  highlighted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const PricingTier = mongoose.model('PricingTier', pricingTierSchema);

export default PricingTier;
