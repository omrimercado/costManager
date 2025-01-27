const express = require('express');
const router = express.Router();
const reportRoutes = require('./report');
const userRoutes = require('./users');
const costRoutes = require('./costs');

/**
 * @route USE /api/report
 * @description Mount report-related routes
 */
router.use('/report', reportRoutes);

/**
 * @route USE /api/users
 * @description Mount user-related routes
 */
router.use('/users', userRoutes);

/**
 * @route USE /api/costs
 * @description Mount cost-related routes
 */
router.use('/costs', costRoutes);

module.exports = router;
