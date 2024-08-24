import express from 'express'
import ValidatorMiddleware from '@/app/www/middleware/Validator.middleware'
import LoginValidator from '@/app/www/validators/body/auth/Login.validator'
import FriendController from '@/app/www/controllers/auth/Friend.controller'
import AuthMiddleware from '@/app/www/middleware/Auth.middleware'
import FriendAddValidator from '@/app/www/validators/body/friend/Add.validator'
import FriendAcceptValidator from '@/app/www/validators/body/friend/Accept.validator'
// lấy ra bộ định tuyến
const FriendRouter = express.Router()

FriendRouter.get('/', AuthMiddleware.checkAuth, FriendController.all)

FriendRouter.get(
  '/requests',
  AuthMiddleware.checkAuth,
  FriendController.requests
)

FriendRouter.post(
  '/add',
  AuthMiddleware.checkAuth,
  ValidatorMiddleware.validateBody(FriendAddValidator),
  FriendController.add
)

FriendRouter.post(
  '/accept',
  AuthMiddleware.checkAuth,
  ValidatorMiddleware.validateBody(FriendAcceptValidator),
  FriendController.accept
)

FriendRouter.post(
  '/remove',
  AuthMiddleware.checkAuth,
  ValidatorMiddleware.validateBody(FriendAddValidator),
  FriendController.remove
)

export default FriendRouter
