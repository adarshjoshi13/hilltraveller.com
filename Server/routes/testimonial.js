var express = require('express');
var router = express.Router();
const upload = require('../API/midlleware/multer');
const {uploadFileOnCloudinary} = require('../API/helper/Cloudinary')
const {AddTestimonial} = require('../API/controlers/testimonial')

router.post('/add-testimonial',upload.any(),AddTestimonial)



module.exports = router;