// recommendationRoutes.js
const express = require('express');
const router = express.Router();
const { UserInteraction } = require('../models/UserInteraction'); // Adjust path as needed

/**
 * GET /api/recommendations/:userId
 * Returns recommended product IDs for the given user based on collaborative filtering
 */
router.get('/:userId', async (req, res) => {
  const {userId} = req.query(userId);
  
  try {
    // 1. Get products the target user has interacted with.
    const userInteractions = await UserInteraction.find({ user_id: userId });
    const userProductIds = userInteractions.map(interaction => interaction.product_id.toString());
    
    // 2. Find interactions from other users on these same products.
    const similarInteractions = await UserInteraction.find({
      product_id: { $in: userProductIds },
      user_id: { $ne: userId } // exclude the target user's own interactions
    });
    
    // 3. Identify other users who have interacted with the same products.
    const similarUserIds = [
      ...new Set(similarInteractions.map(interaction => interaction.user_id.toString()))
    ];
    
    // 4. Get interactions for these similar users.
    const otherUserInteractions = await UserInteraction.find({
      user_id: { $in: similarUserIds }
    });
    
    // 5. Build a frequency count of products these users have interacted with,
    // excluding products the target user already interacted with.
    const productFrequency = {};
    otherUserInteractions.forEach(interaction => {
      const prodId = interaction.product_id.toString();
      if (!userProductIds.includes(prodId)) {
        productFrequency[prodId] = (productFrequency[prodId] || 0) + 1;
      }
    });
    
    // 6. Sort products by frequency in descending order.
    const recommendedProductIds = Object.keys(productFrequency).sort(
      (a, b) => productFrequency[b] - productFrequency[a]
    );
    
    res.status(200).json({
      recommendations: recommendedProductIds,
      frequency: productFrequency
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
