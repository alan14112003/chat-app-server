import UploadController from '@/app/www/controllers/util/Upload.controller'
import ValidatorMiddleware from '@/app/www/middleware/Validator.middleware'
import UploadDeleteMultipleValidator from '@/app/www/validators/body/upload/DeleteMultiple.validator'
import MulterConfig from '@/config/Multer.config'
import express from 'express'
// lấy ra bộ định tuyến
const UploadRouter = express.Router()

UploadRouter.delete('/single', UploadController.deleteSingleFile)

UploadRouter.delete(
  '/multiple',
  ValidatorMiddleware.validateBody(UploadDeleteMultipleValidator),
  UploadController.deleteMultipleFile
)

UploadRouter.post(
  '/single',
  MulterConfig.single('file'),
  UploadController.uploadSingleFile
)

UploadRouter.post('/multiple', UploadController.uploadMultipleFile)

export default UploadRouter
