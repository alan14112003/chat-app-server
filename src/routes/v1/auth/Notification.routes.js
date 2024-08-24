import NotificationController from '@/app/www/controllers/auth/Notification.controller'
import express from 'express'
// lấy ra bộ định tuyến
const NotificationRouter = express.Router()

NotificationRouter.get('/', NotificationController.all)

NotificationRouter.put('/:id/checked', NotificationController.checked)

export default NotificationRouter
