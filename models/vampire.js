const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vampireSchema = new Schema({
  name: { type: String, required: true },
  title: String,
  hair_color: { type: String, default: 'blonde' },
  eye_color: String,
  dob: Date,
  loves: [String],
  location: String,
  gender: String,
  victims: { type: Number, min: 0 }
});

const Vampire = mongoose.model('Vampire', vampireSchema);

module.exports = Vampire;
