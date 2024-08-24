import express from 'express'
import RouterV1 from './v1'

// lấy ra bộ định tuyến để định nghĩa các tuyến đường
const Router = express.Router()

// bản v1
Router.use('/v1', RouterV1)

export default Router
