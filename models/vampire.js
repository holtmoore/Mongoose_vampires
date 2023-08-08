const mongoose = require('mongoose');

const vampireSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  // Name is a required field
    },
    title: String,
    hair_color: {
        type: String,
        default: 'blonde' // Default value for hair color is 'blonde'
    },
    eye_color: String,
    dob: Date,
    loves: [String],
    location: String,
    gender: String,
    victims: {
        type: Number,
        min: 0 // No vampire will have less than 0 victims
    },
});

const Vampire = mongoose.model('Vampire', vampireSchema);

module.exports = Vampire;
