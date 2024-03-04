const {checkImageSize} = require('../helper/ImageSize');
const {uploadFileOnCloudinary,deleteFileFromCloudinary} = require('../helper/Cloudinary');
const Testimonial = require('../models/testimonial');

async function AddTestimonial (req,res){
    const cloudinaryArr = []
try {
   
    const{name,review} = req.body
    let image;
    console.log(name,review)
    if(!req.files[0]){
   return res.status(400).json({message:"please select one image to proceed"});
    }
 const imagepath = req.files[0].path;
 console.log(imagepath);
 const checkHeigthWidth = await checkImageSize(imagepath,502,503)
 if(!checkHeigthWidth){
    return res.status(500).json({message:"trouble while chekcing image size"})
 }
 if(checkHeigthWidth === true){
    const uploaded = await uploadFileOnCloudinary(imagepath)
    if(!uploaded){
        return  res.status(500).json({message:"Error in Image Upload"})
    }
    else{
        image=uploaded.url;
        cloudinaryArr.push(uploaded.url)
        console.log("array",cloudinaryArr)
    }
 }
 else{
    return res.status(400).json({message:checkHeigthWidth})
 }

 const hotel = await Testimonial.create({
    image,
    name ,
    review
    
 })

  return res.status(200).json({message:"testimonial Added successfully"})


} catch (error) {
    // dlt imag form cloudinay
    for (const i of cloudinaryArr ) {
        try {
          const deletionResult = await deleteFileFromCloudinary(i);
          if (!deletionResult) {
            console.log(i, "not deleted");
          } else {
            console.log('File deletion successful.');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    console.log(error)
    if(error.name === 'ValidationError'){
        let message = Object.values(error.errors).map((i)=>{
            return i.message
        })[0]
      return  res.status(400).json({message:message||'please fill all the details'})
    }
    return res.status(500).json({message:"internal server error"})
   
}
}





module.exports = {AddTestimonial}

