import express from 'express'
import AuthPackageRouter from './auth'
import UtilPackageRouter from './util'
import ChatPackageRouter from './chat'
import RateLimitMiddleware from '@/app/www/middleware/RateLimit.middleware'
// lấy ra bộ định tuyến
const RouterV1 = express.Router()

// giới hạn yêu cầu để chặn ddos
RouterV1.use(RateLimitMiddleware.limitRequest())

RouterV1.use(AuthPackageRouter)
RouterV1.use(ChatPackageRouter)
RouterV1.use(UtilPackageRouter)

export default RouterV1
