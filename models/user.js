const mongoose = require('mongoose');
/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} first_name - First name of the user.
 * @property {string} last_name - Last name of the user.
 * @property {Date} birthday - Birthday of the user.
 * @property {string} marital_status - Marital status of the user (single, married, divorced, widowed).
 */

// Define the User schema
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Ensures that each user has a unique ID
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    marital_status: {
        type: String,
        enum: ['single', 'married', 'divorced', 'widowed'], // Restricts values to specific options
        required: true,
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
