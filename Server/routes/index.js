var express = require('express');
var router = express.Router();
const { CreateAdminControler, loginControler } = require("../API/controlers/admin")
const upload = require('../API/midlleware/multer');
const { uploadFileOnCloudinary } = require('../API/helper/Cloudinary')

/* GET home page. */
router.get('/', function (req, res, next) {
   res.send("hill traveller backend")
});

router.post('/sign-up', CreateAdminControler)

router.post('/login', loginControler)

router.post('/upload', upload.fields([
   { name: 'bannerImage', maxCount: 1 },
   { name: 'coverImage', maxCount: 1 },
   { name: 'dayItinerary', maxCount: 1 }
]), (req, res) => {
   const bannerImageFiles = req.files.bannerImage;
   console.log(bannerImageFiles[0].fieldname)

   res.send("uplaod sucessfully")
});

module.exports = router;
