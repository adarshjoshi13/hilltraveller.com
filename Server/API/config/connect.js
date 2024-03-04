const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()
mongoose.connect(process.env.MONGOPASS ).then(()=>{
    console.log(`connected to ${process.env.MONGODB_URI}`)
}).catch((err)=>{
    console.log("could not connect to the database",err)
});

module.exports = mongoose