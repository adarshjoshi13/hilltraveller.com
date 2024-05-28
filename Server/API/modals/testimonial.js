const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Name is Required"],
  },
  review: {
    type: String,
    required: [true,'review is Required'],
  },
  image: {
    type: String, 
    required: [true,'image is Required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
