const Destination = require('../models/Destination.models');
const sizeOf = require('image-size');
const fs = require('fs');
const { json } = require('express');
const { uploadFileOnCloudinary,deleteFileFromCloudinary } = require('../helper/Cloudinary');



const getAllDestinaion = async (req,res)=>{
  try {
    
    const allData = await Destination.find();
    if(allData.length === 0){
        return res.status(200).json({message:"no data inside ",data:allData})
    }
    res.status(200).json({data:allData,message:"succesfully fetched"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'Server error'});
  }
}


// get one by id
const getOneDestination = async (req,res)=>{
    const id = req.params.id;
    console.log(id)
    try {
        console.log('running')
        const Data = await Destination.find({_id:id});
        if(Data.length === 0){
            return res.status(200).json({message:"no data inside"})
        }
        res.status(200).json({data:Data,message:"succesfully fetched"})
      } catch (error) {
        console.log(error)
        res.status(500).json({message:'Server error'});
      }
}

const deleateDestination = async(req,res)=>{
    const {id} = req.body
    console.log(id)
    try {
       const user = await Destination.deleteOne({_id:id})
       if(user.deletedCount !== 0){
       return res.status(200).json({message:"successfully deleated",user})
       }
       else{
        return res.status(401).json({message:"somwthing went wrong "})
       }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong "})
    }
}


// helper function
function isExpressResponse(obj) {
  return obj && typeof obj.status === 'function' && typeof obj.json === 'function' && typeof obj.send === 'function';
}



const updateDestination = async(req,res)=>{
  const { id } = req.params
  const cloudinaryArr = [];
  
 
  // check function for image validation and uploading to cloudinary
  async function  geturl(inputname,feildname,width,height,key){
    if(inputname === false || inputname === "false"){
      let filepath = req.files.find(file => file.fieldname ===  feildname)?.path ?? null;
      console.log("Filepath",filepath);
      const dimensions =  await sizeOf(filepath);
      console.log(dimensions)
      if(dimensions.width === width && dimensions.height === height){
        const ImageUploded = await uploadFileOnCloudinary(filepath)
    if(!ImageUploded){
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
      
      return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:`${feildname} cloudinary` });
      }
     
    else{
      cloudinaryArr.push(ImageUploded.url)
      return ImageUploded.url
    }
  
      }
      else{
        fs.unlinkSync(filepath);
        return res.status(400).json({message:`${key} image width should be ${width}px and height should be ${height}px`});
        
      }
      
    }
    else{
       return inputname
    }
   }
  //  for day it
  async function  geturlForDayItnaries(inputname,feildname,width,height,key){
    if(inputname.length >200 ){
      let filepath = req.files.find(file => file.fieldname ===  feildname)?.path ?? null;
      console.log("Filepath",filepath);
      const dimensions =  await sizeOf(filepath);
      console.log(dimensions)
      if(dimensions.width === width && dimensions.height === height){
        const ImageUploded = await uploadFileOnCloudinary(filepath)
    if(!ImageUploded){
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
      
      return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:`${feildname} cloudinary` });
      }
     
    else{
      cloudinaryArr.push(ImageUploded.url)
      return ImageUploded.url
    }
  
      }
      else{
        fs.unlinkSync(filepath);
        return res.status(400).json({message:`${key} image width should be ${width}px and height should be ${height}px`});
        
      }
      
    }
    else{
       return inputname
    }
   }


   
  //   images getting start
   let  coverImage = await geturl(req.body.CoverImg,"CoverImg",515,685,"Cover")
   if(isExpressResponse(coverImage)){
    return;
   }

   console.log("coverImage:",coverImage)
 
   let BannerImg = await geturl(JSON.parse(req.body.Bannerdata).image,"BannerImg",2067,599,"Banner");
   if(isExpressResponse(BannerImg)){
    return;
   }

   let otherSctionimg = await geturl(JSON.parse(req.body.Whysectiondata).image,"WhySectionImg",515,685,"WhySection");
   if(isExpressResponse(otherSctionimg)){
    return;
   }
   console.log("otherSctionimg",otherSctionimg);

   let contacSectionImg  = await geturl(JSON.parse(req.body.ContactSection).image,"ContactImg",1920,322,"contacSection");
   if(isExpressResponse(contacSectionImg)){
    return;
   }
   console.log("contacSectionImg",contacSectionImg);
  
  //  end of gettingi imges

  
  const catagory = req.body.catagory;
  const  bannerData = {
    ...JSON.parse(req.body.Bannerdata),
    image:BannerImg
  };
  const  otherSectionData = {
    ...JSON.parse(req.body.Whysectiondata),
    image : otherSctionimg
  };
  const bestThings  = JSON.parse(req.body.BestTings);
  const  ContactSection =  {
    ...JSON.parse(req.body.ContactSection),
    image : contacSectionImg
  };
  const  itineraries = [];
  
   const DayItinearies = JSON.parse(req.body.DayItinearies);
   for (let key in DayItinearies) {
   let image = await geturlForDayItnaries(DayItinearies[key].image,`${key}Img`,636,544,key)
   if(isExpressResponse(image)){
    return;
   }

  const dayItinerary = {
        
        heading: DayItinearies[key].heading,
        description:DayItinearies[key].description ,
        image: image
      };
      itineraries.push(dayItinerary);
}
  
console.log("coverimg:",coverImage)

try {
  const updated = await Destination.updateOne({ _id: id },{$set:{
    coverImage,
    catagory,
    bannerData ,
    otherSectionData ,
    bestThings,
    itineraries,
    ContactSection,
  }})
  if (updated.modifiedCount > 0) {
  
    return res.status(200).json({ message: ' updated successfully' });
  } else {
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
    
   return res.status(404).json({ message: 'Document not found' });
  }
} catch (error) {
  console.log("mongo eroro while updating",error);
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
  console.log("clooudninarr array:",cloudinaryArr)
  return res.status(500).json({message:"trouble updating destination"});
}
  

}
module.exports = {getAllDestinaion,getOneDestination,deleateDestination,updateDestination}