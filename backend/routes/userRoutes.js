const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register or Update User (Unified)
router.post('/profile', async (req, res) => {
  try {
    const { firebaseId, name, email, role, address, latitude, longitude, phone } = req.body;
    let user = await User.findOne({ firebaseId });

    if (user) {
      user.name = name || user.name;
      user.role = role || user.role;
      user.address = address || user.address;
      user.phone = phone || user.phone;
      if (latitude && longitude) {
        user.location = { type: 'Point', coordinates: [longitude, latitude] };
      }
      await user.save();
    } else {
      user = new User({
        firebaseId,
        name,
        email,
        role,
        address,
        phone,
        location: { type: 'Point', coordinates: [longitude || 78.9629, latitude || 20.5937] }
      });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Partial Update Profile
router.patch('/profile', async (req, res) => {
  try {
    const { firebaseId, name, phone, address, location } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseId },
      { 
        $set: { 
          ...(name && { name }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(location && { location })
        }
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get All Volunteers
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('name firebaseId address');
    res.json(volunteers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get User Profile
router.get('/:firebaseId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.firebaseId });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
