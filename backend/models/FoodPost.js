const mongoose = require('mongoose');

const FoodPostSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: { type: String, required: true },
  type: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
  expiryTime: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

FoodPostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodPost', FoodPostSchema);
