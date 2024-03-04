var express = require('express');
var router = express.Router();
const {Addhotel,GetAllHotels,DeleteHotel,GetOneHotel,UpdateHotel} = require('../API/controlers/hotels')
const upload = require('../API/midlleware/multer');

router.post('/add-hotel',upload.any(),Addhotel)
router.get('/get-all-hotel',GetAllHotels);
router.delete('/delete-hotel/:id',DeleteHotel);
router.post('/update-hotel/:id',upload.any(),UpdateHotel);
router.get('/get-one-hotel/:id',GetOneHotel)

module.exports = router;