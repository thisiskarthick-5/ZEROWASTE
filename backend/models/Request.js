const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  foodPost: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPost', required: true },
  trust: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
