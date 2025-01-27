const express = require('express');
const router = express.Router();

/**
* @route GET /api/about
* @description Get team details
* @access Public
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @returns {Array<Object>} - List of team members
**/
router.get('/about', (req, res) => {
    // Define team members
    const team = [
        { first_name: 'Omri', last_name: 'Mercado'},
        { first_name: 'Shir', last_name: 'Berko'},

    ];

    // Return the team details
    res.status(200).json(team);
});

module.exports = router;
