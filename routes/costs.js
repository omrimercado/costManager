const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Adjust the path to your Cost model
const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];
/**
 * @route POST /api/add
 * @description Add a new cost item
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - The saved cost document or an error message
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, created_at } = req.body;

        // Validate required fields
        if (!description || !category || !userid || !sum) {
            return res.status(400).json({
                error: 'Missing required fields: description, category, userid, or sum',
            });
        }
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: `Invalid category. Allowed categories are: ${allowedCategories.join(', ')}` });
        }

        // Create a new cost document
        const newCost = new Cost({
            description,
            category,
            userid,
            sum,
            created_at: created_at || Date.now(), // Use provided or default date
        });

        // Save the document to the database
        const savedCost = await newCost.save();

        // Return the saved cost item
        res.status(201).json(savedCost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the cost item' });
    }
});

module.exports = router;
