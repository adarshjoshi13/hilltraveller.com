const Hotels = require('../models/Hotels.model')
const {checkImageSize} = require('../helper/ImageSize');
const {uploadFileOnCloudinary,deleteFileFromCloudinary} = require('../helper/Cloudinary');
const Hotel = require('../models/Hotels.model');


async function Addhotel(req,res){
    const cloudinaryArr = []
try {
   
    const{catagory,heading,description} = req.body
    let image;
    console.log(catagory,heading,description)
    if(!req.files[0]){
   return res.status(400).json({message:"please select one image to proceed"});
    }
 const imagepath = req.files[0].path;
 console.log(imagepath);
 const checkHeigthWidth = await checkImageSize(imagepath,528,269)
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

 const hotel = await Hotel.create({
    image,
    category:catagory,
    heading,
    description
 })

  return res.status(200).json({message:"Hotel Added successfully"})


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

async function GetAllHotels(req,res){
try {
    const allhotels = await Hotel.find()
     if(allhotels){
        return res.status(200).json({message:"fetched successfully",data:allhotels})
     }
} catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({message:"something went wrong while fetching data",})
}
}

async function DeleteHotel(req, res) {
    const { id } = req.params;
  
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(id);
  
      if (deletedHotel) {
        return res.status(200).json({ message: "Deleted successfully", data: deletedHotel });
      } else {
        return res.status(404).json({ message: "Hotel not found" });
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      return res.status(500).json({ message: "Something went wrong while deleting hotel" });
    }
  }
async function UpdateHotel(req,res){
    const cloudinaryArr = []
    try {
       const {id} = req.params
        const{ BannerImg,catagory,heading,description,flag} = req.body
        let image;
        console.log(req.body)
  if(flag === "true"){
    if(!req.files[0]){
        return res.status(400).json({message:"please select one image to proceed"});
         }
      const imagepath = req.files[0].path;
      console.log(imagepath);
      const checkHeigthWidth = await checkImageSize(imagepath,528,269)
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
     
  }
  else{
    image = BannerImg
  }
  const updatedHotel = await Hotel.findByIdAndUpdate(
    id,
    {
        image,
        category:catagory,
        heading,
        description
    },
    { new: true, runValidators: true }
  );
  
  if (updatedHotel) {
    
    console.log("Hotel has been updated:", updatedHotel);
    return res.status(200).json({message:"Hotel updated successfully"})
  } else {
    
    console.log("Hotel not found or update failed");
    return res.status(400).json({message:"something went wrong "})
  }
  
    
    
    
    
    } catch (error) {
        // dlt imag form cloudinay
      if(!flag){
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

async function GetOneHotel(req,res){
    const { id } = req.params;

    try {
      const hotel = await Hotel.findById(id);
  
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      res.status(200).json({ message: 'Hotel found successfully', data: hotel });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {Addhotel,GetAllHotels,DeleteHotel,GetOneHotel,UpdateHotel};