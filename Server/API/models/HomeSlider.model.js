const mongoose = require('mongoose');

const bannerSliderSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, 'Name is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  image: {
    type: String,
    required: [true, 'Image is required.'],
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required.'],
  },
  visiblity:{
    type: Boolean,
    required: [true, 'visiblity is required.']
  }
});

const BannerSlider = mongoose.model('HomeBannerSlider', bannerSliderSchema);

module.exports = BannerSlider;
