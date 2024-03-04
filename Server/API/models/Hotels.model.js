const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  image: {
    type: String, // Assuming you'll store the image URL as a string
    required:[true,"image is required"],
  },
  category: {
    type: String,
    required:[true,"category is required"],
  },
  heading: {
    type: String,
    required: [true,"heading is required"],
  },
  description: {
    type: String,
    required: [true," description is required"],
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
