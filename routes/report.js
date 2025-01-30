const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Import Cost model

/**
 * @route GET /api/report
 * @description Generate a monthly cost report for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - A report containing total cost and grouped items
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

        // Define all possible categories
        const categories = ['food', 'health', 'housing', 'sport', 'education'];

        // Group costs by category with the required structure
        let groupedCosts = categories.map(category => ({
            [category]: costs
                .filter(cost => cost.category === category)
                .map(cost => ({
                    sum: cost.sum,
                    description: cost.description,
                    day: new Date(cost.created_at).getDate(), // Extracting day from timestamp
                }))
        }));

        // Build response object
        res.status(200).json({
            userid: id,
            year: yearNum,
            month: monthNum,
            costs: groupedCosts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the report' });
    }
});

module.exports = router;
