const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const FoodPost = require('../models/FoodPost');
const User = require('../models/User');

// Accept Food (Trust)
router.post('/accept', async (req, res) => {
  try {
    const { foodId, trustFirebaseId } = req.body;
    const trust = await User.findOne({ firebaseId: trustFirebaseId });
    if (!trust) return res.status(404).json({ msg: 'Trust not found' });

    const food = await FoodPost.findById(foodId);
    if (!food || food.status !== 'pending') return res.status(400).json({ msg: 'Food not available' });

    food.status = 'accepted';
    await food.save();

    const request = new Request({
      foodPost: foodId,
      trust: trust._id,
      status: 'pending'
    });

    await request.save();
    
    // Emit socket events
    const io = req.app.get('socketio');
    // Notify the donor
    const donor = await User.findById(food.donor);
    if (donor) {
      io.to(donor.firebaseId).emit('donationAccepted', {
        foodName: food.foodName,
        trustName: trust.name
      });
    }
    // Refresh for all trusts (map update)
    io.emit('foodAccepted', foodId);

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Assign Volunteer (Trust)
router.patch('/assign', async (req, res) => {
  try {
    const { requestId, volunteerId } = req.body;
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.volunteer = volunteerId;
    request.status = 'assigned';
    await request.save();

    // Emit socket events
    const io = req.app.get('socketio');
    const volunteer = await User.findById(volunteerId);
    if (volunteer) {
      const populatedRequest = await Request.findById(requestId).populate('foodPost');
      io.to(volunteer.firebaseId).emit('taskAssigned', {
        requestId,
        foodName: populatedRequest.foodPost.foodName
      });
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Status (Volunteer)
router.patch('/status', async (req, res) => {
  try {
    const { requestId, status } = req.body; // status: 'picked', 'delivered'
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = status;
    if (status === 'delivered') {
      const food = await FoodPost.findById(request.foodPost);
      food.status = 'completed';
      await food.save();
    }
    await request.save();

    // Emit socket events
    const io = req.app.get('socketio');
    const trust = await User.findById(request.trust);
    if (trust) {
      const populatedRequest = await Request.findById(requestId).populate('foodPost');
      io.to(trust.firebaseId).emit('statusUpdated', {
        requestId,
        status,
        foodName: populatedRequest.foodPost.foodName
      });
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get My Requests (Trust / Volunteer)
router.get('/my/:firebaseId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.firebaseId });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    let query = {};
    if (user.role === 'trust') query.trust = user._id;
    else if (user.role === 'volunteer') query.volunteer = user._id;

    const requests = await Request.find(query)
      .populate('foodPost')
      .populate('trust', 'name address')
      .populate('volunteer', 'name')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
