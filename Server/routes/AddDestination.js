var express = require('express');
var router = express.Router();
const {AddDestination} = require('../API/controlers/AddDestination')
const upload = require('../API/midlleware/multer');
const {getAllDestinaion,getOneDestination,deleateDestination,updateDestination} = require('../API/controlers/getAllDestinaion')

router.post('/add-destination', upload.any(),AddDestination);
router.get('/getalldestination',getAllDestinaion);
router.get('/getdestination/:id',getOneDestination);
router.put('/deleate-destination',deleateDestination);
router.put('/update/:id', upload.any(),updateDestination)

module.exports = router;