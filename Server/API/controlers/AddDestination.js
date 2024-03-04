const { json } = require('express');
const mongoose = require('../config/connect');
const { uploadFileOnCloudinary } = require('../helper/Cloudinary');
const Destination = require('../models/Destination.models');


const AddDestination = async (req, res) => {
  console.log('running...')
  const coverimg = req.files.find(file => file.fieldname === 'CoverImg')?.path ?? null;

  // console.log(coverimg)
  if(!coverimg){
    return res.status(400).json({ message: 'cover Image required' });
  }
  const coverImage = await uploadFileOnCloudinary(coverimg)
  if(!coverImage){
    return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:"coverimg cloudindary err" });
  }

  // for banner 
  let bannerimg =  req.files.find(file => file.fieldname === 'BannerImg')?.path ?? null
  if(!bannerimg){
    return res.status(500).json({ message: 'Banner image is required'});
  }
  let BannerImg = await uploadFileOnCloudinary(bannerimg);
  if(!BannerImg){
    return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:"banner-img cloudindary err" });
  }
 let Bannerdata = {
  ...JSON.parse( req.body.Bannerdata),
  image:BannerImg.url
 }

//  for why section
 let whyimg =  req.files.find(file => file.fieldname === 'WhySectionImg')?.path ?? null
 if(!whyimg){
   return res.status(500).json({ message: 'why section Image is required'});
 }
 let WhySectionImg = await uploadFileOnCloudinary(whyimg);
 if(!WhySectionImg){
   return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:" otherSectio-img cloudindary err" });
 }
let otherSectionData = {
 ...JSON.parse( req.body.Whysectiondata),
 image:WhySectionImg.url
}
 
 
//  contact section 

let contactimg =  req.files.find(file => file.fieldname === 'ContactImg')?.path ?? null
if(!contactimg){
  return res.status(500).json({ message: 'Contact Image is required'});
}
let ContactImg = await uploadFileOnCloudinary(contactimg);
if(!ContactImg){
  return res.status(500).json({ message: 'soemthing went wrong',devloperMessage:" ContactImg cloudindary err" });
}
let ContactSection = {
...JSON.parse( req.body.ContactSection),
image:ContactImg.url
}
  
// day itenrary 
const Dayit = JSON.parse(req.body.DayItinearies)
const dayItineraries = []
for (let key in Dayit) {
    let img = req.files.find(file => file.fieldname === `${key}Img`)?.path ?? null
    if(!img){
      return res.status(400).json({ message: `${key}Image required` });
    }
    const image = await uploadFileOnCloudinary(img);
    if(!image){
      return res.status(400).json({ message: `${key}Image cloudinary error` });
    }
  const dayItinerary = {
        Day:key,
        heading: Dayit[key].heading,
        description:Dayit[key].description ,
        image: image.url
      };
      dayItineraries.push(dayItinerary);
}

// catagory
const  catagory =  req.body.catagory
const  bestThings = JSON.parse(req.body.BestTings)


console.log(dayItineraries,otherSectionData,Bannerdata,coverImage.url,ContactSection)
try{
  const  destination = await Destination.create({
    coverImage:coverImage.url,
    catagory:catagory,
    bannerData:Bannerdata ,
    otherSectionData:otherSectionData ,
    bestThings:bestThings ,
    itineraries:dayItineraries,
    ContactSection:ContactSection
  })
  return res.status(200).json({ message: 'Destinaiton added succesfully',destination, });
}
catch(error){
  console.log(error.message)
  return res.status(500).json({message:"something went wrong"});
}
  
};

module.exports = { AddDestination };
