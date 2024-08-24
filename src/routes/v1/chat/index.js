import express from 'express'
import AuthMiddleware from '@/app/www/middleware/Auth.middleware'
import ChatRouter from './Chat.routes'
import MessageRouter from './Message.routes'
// lấy ra bộ định tuyến
const ChatPackageRouter = express.Router()

ChatPackageRouter.use('/chats', AuthMiddleware.checkAuth, ChatRouter)
ChatPackageRouter.use('/messages', AuthMiddleware.checkAuth, MessageRouter)

export default ChatPackageRouter
