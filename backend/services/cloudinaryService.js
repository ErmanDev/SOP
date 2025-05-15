const cloudinary = require('../config/cloudinary');

/**
 * Uploads an image to Cloudinary.
 * @param {string} filePath - The local path of the image to upload.
 * @param {string} folder - The folder in Cloudinary where the image will be stored.
 * @returns {Promise<object>} - The result of the upload.
 */
const uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Deletes an image from Cloudinary.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<object>} - The result of the deletion.
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
