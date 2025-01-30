const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path to your User model
const Cost = require('../models/cost'); // Adjust the path to your Cost model

/**
 * @route GET /api/users/:id
 * @description Get user details and total costs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User details and total costs
 */
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Searching for user with ID:", userId); // Debugging log
    // Find the user by ID
    const user = await User.findOne({ id:userId.toString() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total costs for the user
    const totalCosts = await Cost.aggregate([
      { $match: { userid: userId } },
      { $group: { _id: null, total: { $sum: '$sum' } } },
    ]);

    const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

    // Return user details with total costs
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving user details' });
  }
});

module.exports = router;
