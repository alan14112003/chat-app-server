import CloudinaryConfig from '@/config/Cloudinary.config'

const UploadUtil = {
  uploadSingleFile: async (file, path) => {
    const uploadResponse = await CloudinaryConfig.uploader.upload(file, {
      folder: process.env.CLOUDINARY_FOLDER + path,
      resource_type: 'auto',
    })

    return uploadResponse.public_id
  },

  uploadMultipleFile: async (files, path) => {
    return await Promise.all(
      files.map(async (file) => {
        const response = await UploadUtil.uploadSingleFile(file.url, path)
        return {
          index: file.index,
          ...response,
        }
      })
    )
  },

  deleteSingleFile: async (public_id) => {
    const deleteResponse = await CloudinaryConfig.uploader.destroy(public_id)

    return deleteResponse
  },

  deleteMultipleFile: async (public_ids) => {
    const deleteResponse = await CloudinaryConfig.api.delete_resources(
      public_ids
    )
    return deleteResponse
  },
}

export default UploadUtil
