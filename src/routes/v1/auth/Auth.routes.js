import express from 'express'
import AuthController from '@/app/www/controllers/auth/Auth.controller'
import AuthMiddleware from '@/app/www/middleware/Auth.middleware'
import ValidatorMiddleware from '@/app/www/middleware/Validator.middleware'
import ChangeInfoValidator from '@/app/www/validators/body/auth/ChangeInfo.validator'
import LoginValidator from '@/app/www/validators/body/auth/Login.validator'
import RegisterValidator from '@/app/www/validators/body/auth/Register.validator'
// lấy ra bộ định tuyến
const AuthRouter = express.Router()

AuthRouter.post(
  '/register',
  ValidatorMiddleware.validateBody(RegisterValidator),
  AuthController.register
)

AuthRouter.post(
  '/login',
  ValidatorMiddleware.validateBody(LoginValidator),
  AuthController.login
)

AuthRouter.post('/login-google', AuthController.loginWithGoogle)

AuthRouter.post('/request-code', AuthController.requestCode)
AuthRouter.post('/handle-reset-password', AuthController.handleResetPassword)

AuthRouter.post(
  '/change-password',
  AuthMiddleware.checkAuth,
  AuthController.changePassword
)

AuthRouter.post(
  '/change-info',
  AuthMiddleware.checkAuth,
  ValidatorMiddleware.validateBody(ChangeInfoValidator),
  AuthController.changeInfo
)

AuthRouter.post('/active-email', AuthController.activeEmail)

AuthRouter.post('/refresh', AuthController.refresh)

export default AuthRouter
