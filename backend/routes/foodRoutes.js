const express = require('express');
const router = express.Router();
const FoodPost = require('../models/FoodPost');
const User = require('../models/User');

// Post Food
router.post('/', async (req, res) => {
  try {
    const { donorId, foodName, quantity, type, expiryTime, latitude, longitude } = req.body;
    const donor = await User.findOne({ firebaseId: donorId });
    if (!donor) return res.status(404).json({ msg: 'Donor not found' });

    const newFood = new FoodPost({
      donor: donor._id,
      foodName,
      quantity,
      type,
      expiryTime,
      location: { type: 'Point', coordinates: [longitude, latitude] }
    });

    await newFood.save();
    
    // Emit socket event
    const io = req.app.get('socketio');
    io.emit('newDonation', newFood);

    res.json(newFood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Nearby Food (for Trusts)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters
    
    if (!lat || !lng) {
      return res.status(400).json({ msg: 'Latitude and Longitude are required' });
    }

    const foodPosts = await FoodPost.find({
      status: 'pending',
      location: {
        $near: {
          $geometry: { 
            type: 'Point', 
            coordinates: [parseFloat(lng), parseFloat(lat)] 
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('donor', 'name address');

    res.json(foodPosts);
  } catch (err) {
    console.error('Error fetching nearby food:', err.message);
    res.status(500).json({ msg: 'Server Error: Unable to fetch nearby food', error: err.message });
  }
});

// Get My Donations (for Donor)
router.get('/my/:firebaseId', async (req, res) => {
  try {
    const donor = await User.findOne({ firebaseId: req.params.firebaseId });
    if (!donor) return res.status(404).json({ msg: 'Donor not found' });

    const donations = await FoodPost.find({ donor: donor._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
