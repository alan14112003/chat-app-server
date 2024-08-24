import StatusCodeEnum from '@/app/enums/response_code/notification/StatusCode.enum'
import RedisConfig from '@/config/Redis.config'

const RateLimitMiddleware = {
  /**
   *
   * @param {{
   * limit?: number
   * limitTime?: number
   * blockTime?: number
   * }} options
   *
   */
  limitRequest: (options = {}) => {
    let { limit = 100, limitTime = 30, blockTime = 3600 } = options

    limitTime *= 1000
    blockTime *= 1000

    return async (req, res, next) => {
      try {
        // lấy ra client ip
        const clientIp =
          req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const now = Date.now()
        const timeStart = now - limitTime
        const redisKey = `rate-limit:${clientIp}`

        let requestCount = await RedisConfig.get(redisKey)

        // Sửa: Kiểm tra nếu requestCount tồn tại và requestCount.status là false
        if (requestCount && !requestCount.status) {
          return res.status(429).json({
            code: StatusCodeEnum.serverLocked,
            message: 'you are locked',
          })
        }

        // Nếu chưa có dữ liệu hoặc đã qua thời gian hạn chế, đặt lại đếm
        if (!requestCount || requestCount.start < timeStart) {
          requestCount = {
            start: now,
            count: 1,
            status: true,
          }
        } else {
          // Tăng số lượng yêu cầu
          requestCount.count++
        }

        // Nếu số lượng yêu cầu vượt quá giới hạn, khóa nó lại
        if (requestCount.count > limit) {
          requestCount.status = false
          limitTime = blockTime
        }

        // Lưu trữ số lượng yêu cầu cùng với thời gian bắt đầu và TTL (thời gian sống)
        await RedisConfig.set(redisKey, requestCount, {
          EX: limitTime / 1000,
        })

        next()
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  },
}

export default RateLimitMiddleware
