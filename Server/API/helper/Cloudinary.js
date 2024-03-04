const cloudinary = require('cloudinary').v2;
const fs = require('fs');



          
cloudinary.config({ 
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUNDINARY_API_KEY , 
  api_secret:process.env.CLOUNDINARY_API_SECRET 
});

const uploadFileOnCloudinary = async (localfilepath)=>{
      try {
        if(!localfilepath) return null
      const response = await cloudinary.uploader.upload(localfilepath,{
        resource_type:'auto'
       })
       console.log("file has been uploaded",response.url)
       return response
      } catch (error) {                                                                     
        fs.unlinkSync(localfilepath)
        return null
      }
}

const deleteFileFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    console.log('File has been deleted from Cloudinary:', response.result);

    return response.result === 'ok'? true:false; 
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
    return false; // Return false if an error occurred during deletion
  }
};

module.exports = {uploadFileOnCloudinary,deleteFileFromCloudinary}