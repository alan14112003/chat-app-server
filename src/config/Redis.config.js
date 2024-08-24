import { createClient } from 'redis'
import { configDotenv } from 'dotenv'

configDotenv()

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()

const RedisConfig = {
  get: async (key) => {
    const redisClient = await client
    const data = await redisClient.get(key)
    if (!data) {
      return data
    }
    return JSON.parse(data)
  },

  /**
   * @param { import("redis").SetOptions } options
   */
  set: async (key, value, options = null) => {
    const redisClient = await client
    const ttl = options && options.EX ? options.EX : 3600

    return value
      ? redisClient.set(key, JSON.stringify(value), {
          EX: ttl,
          ...options,
        })
      : value
  },

  del: async (key) => {
    const redisClient = await client
    return await redisClient.del(key)
  },

  delWithPrefix: async (prefix) => {
    const redisClient = await client
    let count = 0
    const { keys } = await redisClient.scan(0, {
      MATCH: `${prefix}*`,
    })

    // Xóa từng khóa phù hợp với điều kiện
    await Promise.all(
      keys.map(async (key) => {
        await RedisConfig.del(key)
        count++
      })
    )

    return count
  },

  /**
   * Lấy thời gian sống của khoá
   * @param {string} key Khoá
   * @returns {Promise<number>} Thời gian sống còn lại của khoá (tính bằng giây)
   */
  ttl: async (key) => {
    const redisClient = await client
    return redisClient.ttl(key)
  },
}

export default RedisConfig
