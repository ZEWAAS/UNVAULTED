// --- CONFIGURATION ---
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

/**
 * Uploads a single file to Cloudinary
 * @param {File} file - The file object from the input
 * @param {String} folder - (Optional) Folder name in Cloudinary
 * @returns {Promise<String>} - The secure image URL
 */
export async function uploadSingleFile(file, folder = 'general') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);


  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}

/**
 * Uploads multiple files in parallel
 * @param {Array<File>} files - Array of file objects
 * @param {String} folder - (Optional) Folder name
 * @returns {Promise<Array<String>>} - Array of secure image URLs
 */
export async function uploadMultipleFiles(files, folder = 'general') {
  const uploadPromises = files.map((file) => uploadSingleFile(file, folder));
  return await Promise.all(uploadPromises);
}