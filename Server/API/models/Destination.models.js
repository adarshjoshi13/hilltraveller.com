const mongoose = require('../config/connect');


const dayItinerarySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image: String,
  heading: String,
  description: String,
  // Add other fields as needed
});

const destinationSchema = new mongoose.Schema({
  coverImage: {
    type: String,
  },
  catagory:String,
  bannerData: {
    heading: String,
    image: {
      type: String,
      required: [true, "banner image cannot be empty"],
    },
    description: String,
  },
  otherSectionData: {
    heading: String,
    description: String,
    image: String,
  },
  bestThings: {
  type : Object
  },
  itineraries: [dayItinerarySchema],
  ContactSection:{
    heading: String,
    description: String,
    image: String,
  }
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination
