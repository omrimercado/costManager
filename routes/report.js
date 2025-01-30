const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Adjust the path based on your project structure

/**
 * @route GET /api/report
 * @description Generate a monthly cost report for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - A report containing total cost and items
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // Ensure `id`, `year`, and `month` are provided
        if (!id || !year || !month) {
            return res.status(400).json({ error: 'Missing required query parameters: id, year, or month' });
        }

        // Validate `year` and `month`
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ error: 'Invalid year or month. Month should be between 1 and 12.' });
        }

        // Calculate date range for the specified year and month
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

        // Query for costs within the date range and for the specific user
        const costs = await Cost.find({
            userid: id,
            created_at: { $gte: startDate, $lte: endDate },
        });

        // Calculate total cost
        const totalCost = costs.reduce((sum, cost) => sum + cost.sum, 0);
        // Group costs by category
        const groupedCosts = costs.reduce((acc, cost) => {
            if (!acc[cost.category]) {
                acc[cost.category] = [];
            }
            acc[cost.category].push(cost);
            return acc;
        }, {})

        // Build response
        res.status(200).json({
            user_id: id,
            year,
            month,
            total_cost: totalCost,
            categories: groupedCosts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the report' });
    }
});

module.exports = router;
