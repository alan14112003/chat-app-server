import express from 'express'
import AuthMiddleware from '@/app/www/middleware/Auth.middleware'
import AuthRouter from './Auth.routes'
import NotificationRouter from './Notification.routes'
import FriendRouter from './Friend.routes'
// lấy ra bộ định tuyến
const AuthPackageRouter = express.Router()

AuthPackageRouter.use('/auth', AuthRouter)

AuthPackageRouter.use('/friends', AuthMiddleware.checkAuth, FriendRouter)

AuthPackageRouter.use(
  '/notifications',
  AuthMiddleware.checkAuth,
  NotificationRouter
)

export default AuthPackageRouter
