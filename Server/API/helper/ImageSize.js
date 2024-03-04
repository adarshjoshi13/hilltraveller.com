const sizeOf = require('image-size');
const fs = require('fs');
const {uploadFileOnCloudinary,deleteFileFromCloudinary} = require('../helper/Cloudinary')


async function checkImageSize(filePath, expectedWidth, expectedHeight) {
  try {
    // Get dimensions of the image
    const dimensions = await sizeOf(filePath);

    if (
      dimensions.width === expectedWidth &&
      dimensions.height === expectedHeight
    ) {

      return true;
    } else {
        fs.unlinkSync(filePath)
      return `Image should have dimensions ${expectedWidth}x${expectedHeight}.`;
    }
  } catch (error) {
    fs.unlinkSync(filePath)
    return null;
  }
}

module.exports = {checkImageSize}


