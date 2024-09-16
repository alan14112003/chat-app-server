import UserController from '@/app/www/controllers/auth/User.controller'
import express from 'express'
// lấy ra bộ định tuyến
const UserRouter = express.Router()

UserRouter.get('/', UserController.findByEmail)

export default UserRouter
