const BannerSlider = require('../modals/HomeSlider.model')
const fs = require('fs');
const sizeOf = require('image-size');
const {uploadFileOnCloudinary,deleteFileFromCloudinary} = require('../helper/Cloudinary')
const mongoose = require('mongoose');


async function AddHomeBanner(req,res){
    
    console.log( typeof req.body.visibility,"and",req.files)
    let cloudinaryArr = [];
   const {heading,description,priority, visiblity} = req.body
   if(req.files.length === 0){
    return res.status(422).json({message:"Please select  one image"})
   }
   let imagePath = req.files[0].path
   const dimensions =  await sizeOf(imagePath);
   let image;
   if(dimensions.width === 1920 && dimensions.height ===800){
    let uploaded = await uploadFileOnCloudinary(imagePath)
    if(!uploaded){
        return res.status(400).json({message:"something went wrong internal server error"})
    }
    else{
        image=uploaded.url
        cloudinaryArr.push(uploaded.url)
    }
   }
   else{
    fs.unlinkSync(imagePath);
    return res.status(400).json({message:'Image dimension must be 1920px and height should be 800px'})
   }

   try {
    const checkPriority = await BannerSlider.findOne({priority});
    if(checkPriority){
      for (const i of cloudinaryArr) {
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
      return res.status(400).json({ message: 'Banner with this priority already exists' });
    }
    const countdocument = await BannerSlider.countDocuments();
    if(countdocument >= 5){
      for (const i of cloudinaryArr) {
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
      return res.status(400).json({message:`Only 5 banners can be added`})
    }


    const createdBanner = await BannerSlider.create({
        heading,
        description,
        image,
        priority,
        visiblity: req.body.visibility
      });

     return res.status(200).json({message:"Banner added succesfully"})
   
   } catch (error) {
    for (const i of cloudinaryArr) {
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
    if (error instanceof mongoose.Error.ValidationError){
        let message = Object.values(error.errors).map((i)=>{
            return i.message
        })[0]
    
        console.log('array',cloudinaryArr)
        return res.status(400).json({message:message});
    }
    else{
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"});

    }
  
   }

}

async function GetAllHomeBanner (req,res){
  try {
    const allData = await BannerSlider.find().sort('priority');
    if(allData.length === 0){
      return res.status(200).json({message:"no data inside ",data:allData})
  }
 return res.status(200).json({data:allData,message:"succesfully fetched"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'something went wrong'});
  }
}

async function UpdatePriority(req,res){
  const id= req.params.id;
  
  const  Newpriority = req.body
  console.log(+Newpriority.priority,id)
  if(!Newpriority.priority){
    return res.status(400).json({message:"no data given to change"})
  }

  try {
    const updatedBanner = await BannerSlider.findByIdAndUpdate(id,{priority:+Newpriority.priority}, { new: true });

    await BannerSlider.updateMany({_id:{ $ne: id },priority: {$gte: +Newpriority.priority}},
      { $inc: {priority: 1 } }
      )

      return  res.status(200).json({message:"updated sucesfully",data:updatedBanner});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error cannot change priority' });
  }
  

};

async function deleateBanner(req,res){
 try {
  const {id} = req.params;

  const deleated = await BannerSlider.deleteOne({_id:id})
  if(deleated.deletedCount === 1){
    return res.status(200).json({message:"deleated succesfully"})
  }
  else{
    return res.status(500).json({message:"something went wrong"})
  }
 } catch (error) {
  console.log(error)
  return res.status(500).json({message:"something went wrong"})
 }

}


  async function UpdateVisibility(req, res) {
    try {
      const { id } = req.params;
      let visibility = req.body.visibility; // Corrected variable name
  
      console.log( visibility, id);
  
      const updatedBanner = await BannerSlider.updateOne({_id:id},{$set:{
        visiblity:visibility
      }})
  
      if (updatedBanner.modifiedCount === 1) {
        return res.status(200).json({ message: "modified successfully", data: updatedBanner });
      } else {
        console.log(updatedBanner)
        return res.status(404).json({ message: "something went wrong" });

      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }
  


module.exports = {AddHomeBanner,GetAllHomeBanner,UpdatePriority,deleateBanner,UpdateVisibility}