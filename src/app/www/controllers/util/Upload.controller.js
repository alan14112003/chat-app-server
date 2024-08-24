import UploadCodeEnum from '@/app/enums/response_code/util/UploadCode.enum'
import UploadUtil from '@/app/utils/Upload.util'

const UploadController = {
  uploadSingleFile: async (req, res, next) => {
    try {
      const file = req.file
      const { path } = await req.body

      if (!file) {
        return res.status(400).json({
          code: UploadCodeEnum.pleaseUpload,
          message: 'please upload a file',
        })
      }

      if (!path) {
        return res.status(422).json({
          code: UploadCodeEnum.pathRequired,
          message: 'path is required',
        })
      }

      const fileResponse = await UploadUtil.uploadSingleFile(file.path, path)
      return res.status(200).json(fileResponse)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  uploadMultipleFile: async (req, res, next) => {
    try {
      const { path, files } = await req.body

      if (!files) {
        return res.status(400).json({
          code: UploadCodeEnum.pleaseUpload,
          message: 'please upload a file',
        })
      }

      if (!path) {
        return res.status(422).json({
          code: UploadCodeEnum.pathRequired,
          message: 'path is required',
        })
      }

      const fileResponse = await UploadUtil.uploadMultipleFile(files, path)

      return res.status(200).json(fileResponse)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  deleteSingleFile: async (req, res, next) => {
    try {
      const { path } = await req.body

      if (!path) {
        return res.status(422).json({
          code: UploadCodeEnum.pathRequired,
          message: 'path is required',
        })
      }

      const deleted = await UploadUtil.deleteSingleFile(path)
      return res.status(200).json(deleted)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  deleteMultipleFile: async (req, res, next) => {
    try {
      const { paths } = await req.body

      const deleted = await UploadUtil.deleteMultipleFile(paths)
      return res.status(200).json(deleted)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
}

export default UploadController
