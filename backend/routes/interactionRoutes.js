// interactionRoutes.js
const express = require('express');
const router = express.Router();
const { UserInteraction } = require('../models/UserInteraction'); // Adjust path as needed
const { prod } = require('@tensorflow/tfjs-node');

// POST /api/interactions - Log a user interaction
router.post('/', async (req, res) => {
  const { user_id, product_id, action_type } = req.body;

  console.log(user_id);
  console.log(product_id);
  console.log(action_type);

  // Basic validation for required fields
  if (!user_id || !product_id || !action_type) {
    return res.status(400).json({ error: 'Missing required fields: user_id, product_id, and action_type' });
  }

  try {
    const newInteraction = new UserInteraction({
      user_id,
      product_id,
      action_type,
    });
    
    await newInteraction.save();
    
    res.status(201).json({ message: 'Interaction logged successfully', interaction: newInteraction });
  } catch (error) {
    console.error('Error logging interaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
