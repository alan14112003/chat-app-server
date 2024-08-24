import express from 'express'
import UploadRouter from './Upload.routes'
import AuthMiddleware from '@/app/www/middleware/Auth.middleware'

// lấy ra bộ định tuyến
const UtilPackageRouter = express.Router()

// những route này phải xác thực người dùng
UtilPackageRouter.use(AuthMiddleware.checkAuth)
UtilPackageRouter.use('/uploads', UploadRouter)

export default UtilPackageRouter
