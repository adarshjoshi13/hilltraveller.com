var express = require('express');
var router = express.Router();
const {AddHomeBanner,GetAllHomeBanner,UpdatePriority, deleateBanner,UpdateVisibility} = require('../API/controlers/HomeBanner')
const upload = require('../API/midlleware/multer');

router.post('/add-banner',upload.any(),AddHomeBanner);
router.get('/get-all-home-banner', GetAllHomeBanner);
router.put('/update-priority/:id',UpdatePriority);
router.delete('/deleate-banner/:id',deleateBanner);
router.put('/update-visiblity/:id',UpdateVisibility)

module.exports = router;