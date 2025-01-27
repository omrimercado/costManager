const mongoose = require('mongoose');
/**
 * @typedef {Object} Cost
 * @property {string} description - The description of the cost item.
 * @property {string} category - The category of the cost item (food, health, housing, sport, education).
 * @property {string} userid - The user ID associated with the cost item.
 * @property {number} sum - The amount spent.
 * @property {Date} [created_at] - The date when the cost item was created.
 */
// Define the Cost schema
const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    category: {
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    sum: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now, // Defaults to the current date and time
    },
});

// Create the Cost model
const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
